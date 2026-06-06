import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { z } from 'zod';
import { reserveSlot, generateSlotsForDate } from '@lib/availability';
import { salonConfig } from '@lib/config';
import { checkRateLimit, getClientIp } from '@lib/rate-limit';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

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

function formatDateDE(dateStr: string): string {
  const d = new Date(`${dateStr}T00:00:00`);
  return d.toLocaleDateString('de-DE', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

function esc(s: string): string {
  return s.replace(/[<>&"]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' })[c]!);
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

    // 3) Slot muss zu den Öffnungszeiten passen.
    if (!generateSlotsForDate(data.date).includes(data.time)) {
      return NextResponse.json({ error: 'slot_invalid' }, { status: 422 });
    }

    // 4) Keine Termine in der Vergangenheit.
    const slotDate = new Date(`${data.date}T${data.time}:00`);
    if (slotDate.getTime() < Date.now()) {
      return NextResponse.json({ error: 'slot_invalid' }, { status: 422 });
    }

    // 5) Slot reservieren (prüft Belegung in Redis, schützt vor Doppelbuchung).
    const reserved = await reserveSlot(data);
    if (!reserved) {
      return NextResponse.json({ error: 'slot_taken' }, { status: 409 });
    }

    const serviceLabel = data.service;
    const dateDE = formatDateDE(data.date);

    // 6) E-Mail nur senden, wenn Resend konfiguriert ist — sonst Mock (Demo).
    if (!resend || !process.env.RESEND_API_KEY) {
      console.info('[Booking] Mock confirmation:', { ...data, dateDE });
      return NextResponse.json({ success: true, mock: true });
    }

    const salonEmail = process.env.SALON_EMAIL || salonConfig.email;
    const fromEmail = process.env.BOOKING_EMAIL_FROM || 'onboarding@resend.dev';

    // Benachrichtigung an den Salon.
    const salonSend = resend.emails.send({
      from: `${salonConfig.name} <${fromEmail}>`,
      to: [salonEmail],
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
    const customerSend = resend.emails
      .send({
        from: `${salonConfig.name} <${fromEmail}>`,
        to: [data.email],
        subject: `Ihre Terminbestätigung — ${salonConfig.name}`,
        text: `Hallo ${data.name},\n\nvielen Dank für Ihre Buchung bei ${salonConfig.name}!\n\nLeistung: ${serviceLabel}\nTermin: ${dateDE} um ${data.time} Uhr\nAdresse: ${salonConfig.addressDisplay}\n\nWir freuen uns auf Sie!\n\n(Demo-Website — alle Angaben fiktiv.)`,
        html: emailShell(
          `Ihre Terminbestätigung`,
          `<p style="margin:0 0 16px;color:#2a2228;">Hallo ${esc(data.name)},<br/>vielen Dank für Ihre Buchung bei <strong>${salonConfig.name}</strong>!</p>` +
            rows([
              ['Leistung', esc(serviceLabel)],
              ['Termin', `${dateDE} um ${data.time} Uhr`],
              ['Adresse', salonConfig.addressDisplay],
            ]) +
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

function rows(items: [string, string][]): string {
  return `<table style="width:100%;border-collapse:collapse;">${items
    .map(
      ([k, v]) =>
        `<tr><td style="padding:8px 0;color:#8a7a80;font-size:13px;width:110px;vertical-align:top;">${k}</td><td style="padding:8px 0;font-weight:600;">${v}</td></tr>`
    )
    .join('')}</table>`;
}

function emailShell(title: string, inner: string): string {
  return `
<div style="font-family: Inter, system-ui, sans-serif; max-width: 540px; margin: 0 auto; color: #2a2228;">
  <div style="background: #9e5e6e; padding: 24px 32px; border-radius: 8px 8px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 20px;">${title}</h1>
    <p style="color: rgba(255,255,255,0.8); margin: 6px 0 0; font-size: 13px;">${salonConfig.name}</p>
  </div>
  <div style="background: #faf7f5; padding: 32px; border-radius: 0 0 8px 8px; border: 1px solid #e7ddd8;">
    ${inner}
  </div>
</div>`;
}
