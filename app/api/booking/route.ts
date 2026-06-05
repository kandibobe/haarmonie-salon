import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { z } from 'zod';
import { reserveSlot, generateSlotsForDate } from '@lib/availability';
import { salonConfig } from '@lib/config';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(7),
  service: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string().regex(/^\d{2}:\d{2}$/),
  consent: z.literal(true),
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

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = schema.parse(body);

    // Slot muss zu den Öffnungszeiten passen.
    if (!generateSlotsForDate(data.date).includes(data.time)) {
      return NextResponse.json({ error: 'slot_invalid' }, { status: 422 });
    }

    // Slot reservieren (prüft Belegung in Redis).
    const reserved = await reserveSlot(data);
    if (!reserved) {
      return NextResponse.json({ error: 'slot_taken' }, { status: 409 });
    }

    // Client sendet den lesbaren Leistungsnamen (übersetzter Titel).
    const serviceLabel = data.service;
    const dateDE = formatDateDE(data.date);

    // E-Mail nur senden, wenn Resend konfiguriert ist — sonst Mock (Demo).
    if (!resend || !process.env.RESEND_API_KEY) {
      console.info('[Booking] Mock confirmation:', { ...data, dateDE });
      return NextResponse.json({ success: true, mock: true });
    }

    const salonEmail = process.env.SALON_EMAIL || salonConfig.email;
    const fromEmail = process.env.BOOKING_EMAIL_FROM || 'onboarding@resend.dev';

    await resend.emails.send({
      from: `${salonConfig.name} <${fromEmail}>`,
      to: [salonEmail],
      replyTo: data.email,
      subject: `Neue Online-Buchung: ${data.name} — ${dateDE} ${data.time}`,
      text: `
Neue Online-Terminbuchung

Name:       ${data.name}
E-Mail:     ${data.email}
Telefon:    ${data.phone}
Leistung:   ${serviceLabel}
Termin:     ${dateDE} um ${data.time} Uhr
      `.trim(),
      html: `
<div style="font-family: Inter, system-ui, sans-serif; max-width: 540px; margin: 0 auto; color: #2a2228;">
  <div style="background: #9e5e6e; padding: 24px 32px; border-radius: 8px 8px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 20px;">Neue Online-Terminbuchung</h1>
    <p style="color: rgba(255,255,255,0.8); margin: 6px 0 0; font-size: 13px;">${salonConfig.name}</p>
  </div>
  <div style="background: #faf7f5; padding: 32px; border-radius: 0 0 8px 8px; border: 1px solid #e7ddd8;">
    <table style="width: 100%; border-collapse: collapse;">
      <tr><td style="padding: 8px 0; color: #8a7a80; font-size: 13px; width: 110px;">Name</td><td style="padding: 8px 0; font-weight: 600;">${data.name}</td></tr>
      <tr><td style="padding: 8px 0; color: #8a7a80; font-size: 13px;">E-Mail</td><td style="padding: 8px 0; font-weight: 600;"><a href="mailto:${data.email}" style="color: #9e5e6e;">${data.email}</a></td></tr>
      <tr><td style="padding: 8px 0; color: #8a7a80; font-size: 13px;">Telefon</td><td style="padding: 8px 0; font-weight: 600;"><a href="tel:${data.phone}" style="color: #9e5e6e;">${data.phone}</a></td></tr>
      <tr><td style="padding: 8px 0; color: #8a7a80; font-size: 13px;">Leistung</td><td style="padding: 8px 0; font-weight: 600;">${serviceLabel}</td></tr>
      <tr><td style="padding: 8px 0; color: #8a7a80; font-size: 13px;">Termin</td><td style="padding: 8px 0; font-weight: 600;">${dateDE} um ${data.time} Uhr</td></tr>
    </table>
  </div>
</div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'invalid_data', issues: err.issues }, { status: 422 });
    }
    console.error('[Booking] Error:', err);
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }
}
