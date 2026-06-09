import { NextResponse } from 'next/server';
import { z } from 'zod';
import { redis } from '@lib/redis';
import { checkRateLimit, getClientIp } from '@lib/rate-limit';
import { resend, esc, rows, emailShell, salonEmailTo, emailFrom } from '@lib/email';
import { salonConfig } from '@lib/config';

const schema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email().max(150),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  service: z.string().max(80).optional(),
});

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const { success } = await checkRateLimit('contact', getClientIp(request));
  if (!success) {
    return NextResponse.json({ error: 'rate_limited' }, { status: 429 });
  }

  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'invalid_data' }, { status: 422 });
  }

  const { name, email, date, service } = parsed.data;

  // Store in Redis (TTL 30 days) — salon can review via admin dashboard later
  if (redis) {
    const key = `waitlist:${date}:${Date.now()}`;
    await redis.set(key, JSON.stringify({ name, email, date, service, createdAt: new Date().toISOString() }), {
      ex: 60 * 60 * 24 * 30,
    });
  }

  // Notify salon
  if (resend && process.env.RESEND_API_KEY) {
    const dateDE = new Date(`${date}T00:00:00`).toLocaleDateString('de-DE', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
    });
    await resend.emails
      .send({
        from: `${salonConfig.name} <${emailFrom()}>`,
        to: [salonEmailTo()],
        subject: `Neue Wartelisten-Anfrage: ${name} — ${dateDE}`,
        html: emailShell(
          'Neue Wartelisten-Anfrage',
          rows([
            ['Name', esc(name)],
            ['E-Mail', `<a href="mailto:${esc(email)}" style="color:#9e5e6e;">${esc(email)}</a>`],
            ['Datum', dateDE],
            ...(service ? ([['Leistung', esc(service)]] as [string, string][]) : []),
          ])
        ),
        text: `Neue Wartelisten-Anfrage\n\nName: ${name}\nE-Mail: ${email}\nDatum: ${dateDE}${service ? `\nLeistung: ${service}` : ''}`,
      })
      .catch(() => null);
  } else {
    console.info('[Waitlist] Mock entry:', { name, email, date, service });
  }

  return NextResponse.json({ success: true });
}
