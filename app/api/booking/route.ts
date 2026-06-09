import { NextResponse } from 'next/server';
import { randomBytes } from 'crypto';
import { z } from 'zod';
import { reserveSlot, generateSlotsForDate } from '@lib/availability';
import { salonConfig } from '@lib/config';
import { checkRateLimit, getClientIp } from '@lib/rate-limit';
import { resend, esc, rows, emailShell, salonEmailTo, emailFrom } from '@lib/email';
import { redis } from '@lib/redis';

const schema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email().max(150),
  phone: z.string().min(7).max(30),
  service: z.string().min(1).max(80),
  stylist: z.string().max(80).optional().or(z.literal('')),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string().regex(/^\d{2}:\d{2}$/),
  consent: z.literal(true),
  // Honeypot: für Menschen unsichtbar. Wird akzeptiert, aber im Handler
  // als Bot behandelt (stiller Erfolg) — verrät dem Bot nichts.
  company: z.string().optional(),
});

export const dynamic = 'force-dynamic';

const BOOKING_TTL = 60 * 60 * 24 * 60; // 60 Tage

function formatDateDE(dateStr: string): string {
  const d = new Date(`${dateStr}T00:00:00`);
  return d.toLocaleDateString('de-DE', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

export async function POST(request: Request) {
  try {
    // 1) Rate limit pro IP (Anti-Spam / Missbrauch).
    const { success } = await checkRateLimit('booking', getClientIp(request));
    if (!success) {
      return NextResponse.json({ error: 'rate_limited' }, { status: 429 });
    }

    const body = await request.json();
    const data = schema.parse(body);

    // 2) Honeypot ausgefüllt → Bot. So tun, als ob alles ok ist, aber nichts buchen.
    if (data.company) {
      return NextResponse.json({ success: true });
    }

    // 3) Datum semantisch prüfen (Regex lässt 9999-99-99 durch).
    const parsedDate = new Date(`${data.date}T00:00:00`);
    if (isNaN(parsedDate.getTime())) {
      return NextResponse.json({ error: 'slot_invalid' }, { status: 422 });
    }

    // 4) Slot muss zu den Öffnungszeiten passen.
    if (!generateSlotsForDate(data.date).includes(data.time)) {
      return NextResponse.json({ error: 'slot_invalid' }, { status: 422 });
    }

    // 5) Keine Termine in der Vergangenheit.
    const slotDate = new Date(`${data.date}T${data.time}:00`);
    if (slotDate.getTime() < Date.now()) {
      return NextResponse.json({ error: 'slot_invalid' }, { status: 422 });
    }

    // 6) Cancel-Token erzeugen (für Selbst-Stornierung per E-Mail-Link).
    const cancelToken = randomBytes(16).toString('hex');

    // 7) Slot reservieren (prüft Belegung in Redis, schützt vor Doppelbuchung).
    const reserved = await reserveSlot(data, cancelToken);
    if (!reserved) {
      return NextResponse.json({ error: 'slot_taken' }, { status: 409 });
    }

    // 8) Cancel-Token Reverse-Lookup speichern (O(1) Lookup im Cancel-Endpoint).
    if (redis) {
      await redis.set(
        `cancel:${cancelToken}`,
        `booking:${data.date}:${data.time}`,
        { ex: BOOKING_TTL }
      );
    }

    const serviceLabel = data.service;
    const dateDE = formatDateDE(data.date);
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || '';
    const cancelUrl = `${appUrl}/api/booking/cancel?token=${cancelToken}`;

    // 9) E-Mail nur senden, wenn Resend konfiguriert ist — sonst Mock (Demo).
    if (!resend || !process.env.RESEND_API_KEY) {
      console.info('[Booking] Mock confirmation:', { ...data, dateDE, cancelToken });
      return NextResponse.json({ success: true, mock: true });
    }

    const from = `${salonConfig.name} <${emailFrom()}>`;

    // Benachrichtigung an den Salon.
    const salonSend = resend.emails.send({
      from,
      to: [salonEmailTo()],
      replyTo: data.email,
      subject: `Neue Online-Buchung: ${data.name} — ${dateDE} ${data.time}`,
      text: `Neue Online-Terminbuchung\n\nName: ${data.name}\nE-Mail: ${data.email}\nTelefon: ${data.phone}\nLeistung: ${serviceLabel}${data.stylist ? `\nStylist: ${data.stylist}` : ''}\nTermin: ${dateDE} um ${data.time} Uhr`,
      html: emailShell(
        'Neue Online-Terminbuchung',
        rows([
          ['Name', esc(data.name)],
          ['E-Mail', `<a href="mailto:${esc(data.email)}" style="color:#9e5e6e;">${esc(data.email)}</a>`],
          ['Telefon', `<a href="tel:${esc(data.phone)}" style="color:#9e5e6e;">${esc(data.phone)}</a>`],
          ['Leistung', esc(serviceLabel)],
          ...(data.stylist ? ([['Stylist', esc(data.stylist)]] as [string, string][]) : []),
          ['Termin', `${dateDE} um ${data.time} Uhr`],
        ])
      ),
    });

    // Bestätigung an den Kunden (best-effort; im Resend-Testmodus ohne
    // verifizierte Domain kann das fehlschlagen — Buchung bleibt trotzdem gültig).
    const cancelHint = cancelUrl
      ? `<p style="margin:16px 0 0;font-size:12px;color:#8a7a80;">Termin stornieren oder ändern? <a href="${cancelUrl}" style="color:#9e5e6e;">Hier klicken</a></p>`
      : '';

    const customerSend = resend.emails
      .send({
        from,
        to: [data.email],
        subject: `Ihre Terminbestätigung — ${salonConfig.name}`,
        text: `Hallo ${data.name},\n\nvielen Dank für Ihre Buchung bei ${salonConfig.name}!\n\nLeistung: ${serviceLabel}\nTermin: ${dateDE} um ${data.time} Uhr\nAdresse: ${salonConfig.addressDisplay}\n\nTermin stornieren: ${cancelUrl}\n\nWir freuen uns auf Sie!\n\n(Demo-Website — alle Angaben fiktiv.)`,
        html: emailShell(
          `Ihre Terminbestätigung`,
          `<p style="margin:0 0 16px;color:#2a2228;">Hallo ${esc(data.name)},<br/>vielen Dank für Ihre Buchung bei <strong>${salonConfig.name}</strong>!</p>` +
            rows([
              ['Leistung', esc(serviceLabel)],
              ['Termin', `${dateDE} um ${data.time} Uhr`],
              ['Adresse', salonConfig.addressDisplay],
            ]) +
            cancelHint +
            `<p style="margin:16px 0 0;color:#8a7a80;font-size:12px;">Demo-Website — alle Angaben fiktiv.</p>`
        ),
      })
      .catch(() => null);

    await Promise.allSettled([salonSend, customerSend]);

    return NextResponse.json({ success: true });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'invalid_data', issues: err.issues }, { status: 422 });
    }
    console.error('[Booking] Error:', err);
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }
}
