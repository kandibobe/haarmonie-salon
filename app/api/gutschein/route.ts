import { NextResponse } from 'next/server';
import { z } from 'zod';
import { salonConfig } from '@lib/config';
import { checkRateLimit, getClientIp } from '@lib/rate-limit';
import { resend, esc, rows, emailShell, salonEmailTo, emailFrom } from '@lib/email';

const schema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email().max(150),
  amount: z.coerce.number().min(10).max(1000),
  occasion: z.string().max(120).optional().or(z.literal('')),
  message: z.string().max(1000).optional().or(z.literal('')),
  consent: z.literal(true),
  // Honeypot: für Menschen unsichtbar.
  company: z.string().optional(),
});

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { success } = await checkRateLimit('contact', getClientIp(request));
    if (!success) {
      return NextResponse.json({ error: 'rate_limited' }, { status: 429 });
    }

    const body = await request.json();
    const data = schema.parse(body);

    // Honeypot → Bot. Stiller Erfolg.
    if (data.company) {
      return NextResponse.json({ success: true });
    }

    // Mock-Modus ohne Resend (Demo).
    if (!resend || !process.env.RESEND_API_KEY) {
      console.info('[Gutschein] Mock request:', data);
      return NextResponse.json({ success: true, mock: true });
    }

    await resend.emails
      .send({
        from: `${salonConfig.name} <${emailFrom()}>`,
        to: [salonEmailTo()],
        replyTo: data.email,
        subject: `Gutschein-Anfrage: ${data.name} — ${data.amount} €`,
        text: `Neue Gutschein-Anfrage\n\nName: ${data.name}\nE-Mail: ${data.email}\nBetrag: ${data.amount} €\nAnlass: ${data.occasion || '—'}\nNachricht: ${data.message || '—'}`,
        html: emailShell(
          'Neue Gutschein-Anfrage',
          rows([
            ['Name', esc(data.name)],
            ['E-Mail', `<a href="mailto:${esc(data.email)}" style="color:#9e5e6e;">${esc(data.email)}</a>`],
            ['Betrag', `${data.amount} €`],
            ['Anlass', esc(data.occasion || '—')],
            ['Nachricht', esc(data.message || '—')],
          ])
        ),
      })
      .catch(() => null);

    return NextResponse.json({ success: true });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'invalid_data', issues: err.issues }, { status: 422 });
    }
    console.error('[Gutschein] Error:', err);
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }
}
