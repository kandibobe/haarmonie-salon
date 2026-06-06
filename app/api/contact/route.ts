import { NextResponse } from 'next/server';
import { z } from 'zod';
import { salonConfig } from '@lib/config';
import { checkRateLimit, getClientIp } from '@lib/rate-limit';
import { resend, esc, rows, emailShell, salonEmailTo, emailFrom } from '@lib/email';

const schema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email().max(150),
  message: z.string().min(5).max(2000),
  consent: z.literal(true),
  // Honeypot
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

    if (data.company) {
      return NextResponse.json({ success: true });
    }

    if (!resend || !process.env.RESEND_API_KEY) {
      console.info('[Contact] Mock message:', data);
      return NextResponse.json({ success: true, mock: true });
    }

    await resend.emails
      .send({
        from: `${salonConfig.name} <${emailFrom()}>`,
        to: [salonEmailTo()],
        replyTo: data.email,
        subject: `Kontaktanfrage: ${data.name}`,
        text: `Neue Kontaktanfrage\n\nName: ${data.name}\nE-Mail: ${data.email}\n\n${data.message}`,
        html: emailShell(
          'Neue Kontaktanfrage',
          rows([
            ['Name', esc(data.name)],
            ['E-Mail', `<a href="mailto:${esc(data.email)}" style="color:#9e5e6e;">${esc(data.email)}</a>`],
          ]) +
            `<p style="margin:16px 0 0;color:#2a2228;white-space:pre-wrap;">${esc(data.message)}</p>`
        ),
      })
      .catch(() => null);

    return NextResponse.json({ success: true });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'invalid_data', issues: err.issues }, { status: 422 });
    }
    console.error('[Contact] Error:', err);
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }
}
