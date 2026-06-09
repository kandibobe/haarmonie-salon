import { NextResponse } from 'next/server';
import { z } from 'zod';
import { isAdminAuthed } from '@lib/admin-auth';
import { getBookingById, updateBooking, cancelSlot, type BookingStatus } from '@lib/availability';
import { resend, emailShell, emailFrom } from '@lib/email';
import { salonConfig } from '@lib/config';

export const dynamic = 'force-dynamic';

const schema = z.object({
  id: z.string().regex(/^booking:[0-9]{4}-[0-9]{2}-[0-9]{2}:[0-9]{2}:[0-9]{2}$/),
  action: z.enum(['complete', 'cancel', 'no_show']),
});

export async function POST(request: Request) {
  // Auth check
  if (!(await isAdminAuthed())) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  // CSRF: exact hostname match
  const origin = request.headers.get('origin');
  const host = request.headers.get('host');
  if (origin && host) {
    try {
      if (new URL(origin).hostname !== host.split(':')[0]) {
        return NextResponse.json({ error: 'forbidden' }, { status: 403 });
      }
    } catch {
      return NextResponse.json({ error: 'forbidden' }, { status: 403 });
    }
  }

  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'invalid_data' }, { status: 422 });
  }

  const { id, action } = parsed.data;
  const booking = await getBookingById(id);
  if (!booking) {
    return NextResponse.json({ error: 'not_found' }, { status: 404 });
  }

  if (action === 'cancel') {
    const ok = await cancelSlot(id);
    return NextResponse.json({ ok });
  }

  const statusMap: Record<string, BookingStatus> = {
    complete: 'completed',
    no_show: 'no_show',
  };
  const newStatus = statusMap[action];
  await updateBooking(id, { status: newStatus });

  // Send review request email when marking as completed
  if (action === 'complete' && booking.email && !booking.reviewRequestSentAt) {
    await sendReviewEmail(booking.email, booking.name);
    await updateBooking(id, {
      status: 'completed',
      reviewRequestSentAt: new Date().toISOString(),
    });
  }

  return NextResponse.json({ ok: true });
}

async function sendReviewEmail(email: string, name: string) {
  if (!resend || !process.env.RESEND_API_KEY) return;

  const reviewUrl =
    process.env.GOOGLE_REVIEW_URL ||
    salonConfig.googleMapsEmbedUrl ||
    'https://www.google.com/maps/search/?api=1&query=' +
      encodeURIComponent(salonConfig.name + ' ' + salonConfig.city);

  const buttonHtml = `<div style="text-align:center;margin:24px 0;">
    <a href="${reviewUrl}" style="background:#9e5e6e;color:white;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:600;font-size:15px;">
      ⭐ Jetzt bewerten
    </a>
  </div>`;

  await resend.emails
    .send({
      from: `${salonConfig.name} <${emailFrom()}>`,
      to: [email],
      subject: `Wie war Ihr Besuch bei ${salonConfig.name}? ⭐`,
      text: `Hallo ${name},\n\nvielen Dank für Ihren Besuch bei ${salonConfig.name}! Wir würden uns sehr freuen, wenn Sie uns eine Bewertung hinterlassen:\n\n${reviewUrl}\n\nBis bald!`,
      html: emailShell(
        `Wie war Ihr Besuch?`,
        `<p style="margin:0 0 16px;color:#2a2228;">Hallo ${name},<br/><br/>vielen Dank für Ihren Besuch bei <strong>${salonConfig.name}</strong>! Wir hoffen, Sie waren zufrieden.</p>
         <p style="margin:0 0 8px;color:#2a2228;">Eine kurze Google-Bewertung hilft uns sehr und dauert nur eine Minute:</p>
         ${buttonHtml}
         <p style="margin:16px 0 0;color:#8a7a80;font-size:12px;">Sie möchten keine E-Mails mehr erhalten? Kein Problem — antworten Sie einfach auf diese E-Mail.</p>`
      ),
    })
    .catch(() => null);
}
