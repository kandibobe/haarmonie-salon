import { NextResponse } from 'next/server';
import { getBookedSlots, getBookingById, updateBooking } from '@lib/availability';
import { salonConfig } from '@lib/config';
import { resend, esc, rows, emailShell, emailFrom } from '@lib/email';

export const dynamic = 'force-dynamic';

// Called by Vercel Cron at 09:00 every day (see vercel.json).
// Sends a 24h reminder email to all pending bookings for tomorrow.
export async function GET(request: Request) {
  // Verify cron secret to prevent unauthorized calls
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().slice(0, 10);

  const tomorrowDE = tomorrow.toLocaleDateString('de-DE', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  const bookedTimes = await getBookedSlots(tomorrowStr);
  if (bookedTimes.length === 0) {
    return NextResponse.json({ sent: 0, date: tomorrowStr });
  }

  let sent = 0;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || '';

  for (const time of bookedTimes) {
    const id = `booking:${tomorrowStr}:${time}`;
    const booking = await getBookingById(id);
    if (!booking) continue;
    if (booking.status === 'cancelled') continue;
    if (booking.reminderSentAt) continue;

    const cancelUrl = booking.cancelToken
      ? `${appUrl}/api/booking/cancel?token=${booking.cancelToken}`
      : null;

    const cancelHint = cancelUrl
      ? `<p style="margin:16px 0 0;font-size:12px;color:#8a7a80;">Können Sie nicht erscheinen? <a href="${cancelUrl}" style="color:#9e5e6e;">Termin stornieren</a></p>`
      : '';

    if (resend && process.env.RESEND_API_KEY) {
      await resend.emails
        .send({
          from: `${salonConfig.name} <${emailFrom()}>`,
          to: [booking.email],
          subject: `Erinnerung: Ihr Termin morgen um ${time} Uhr — ${salonConfig.name}`,
          text: `Hallo ${booking.name},\n\nnur zur Erinnerung: Ihr Termin bei ${salonConfig.name} ist morgen, ${tomorrowDE}, um ${time} Uhr.\n\nLeistung: ${booking.service}\nAdresse: ${salonConfig.addressDisplay}\n\nBis morgen!${cancelUrl ? `\n\nTermin stornieren: ${cancelUrl}` : ''}`,
          html: emailShell(
            'Erinnerung an Ihren Termin',
            `<p style="margin:0 0 16px;color:#2a2228;">Hallo ${esc(booking.name)},<br/><br/>wir erinnern Sie an Ihren morgigen Termin:</p>` +
              rows([
                ['Leistung', esc(booking.service)],
                ['Termin', `${tomorrowDE} um ${time} Uhr`],
                ['Adresse', salonConfig.addressDisplay],
              ]) +
              cancelHint +
              `<p style="margin:16px 0 0;color:#8a7a80;font-size:12px;">Wir freuen uns auf Sie!</p>`
          ),
        })
        .catch(() => null);
    } else {
      console.info('[Cron/Reminders] Mock reminder for', booking.email, 'at', time);
    }

    await updateBooking(id, { reminderSentAt: new Date().toISOString() });
    sent++;
  }

  return NextResponse.json({ sent, date: tomorrowStr });
}
