import { NextResponse } from 'next/server';
import { redis } from '@lib/redis';
import { cancelSlot } from '@lib/availability';

export const dynamic = 'force-dynamic';

// GET /api/booking/cancel?token=<cancelToken>
// Triggered from the cancellation link in the customer confirmation email.
// One-time use: the cancel token is deleted after use.
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const token = searchParams.get('token');

  if (!token || !/^[a-f0-9]{32}$/.test(token)) {
    return NextResponse.redirect(`${origin}/?cancelled=error`);
  }

  if (!redis) {
    // No Redis → can't verify token, redirect with error
    return NextResponse.redirect(`${origin}/?cancelled=error`);
  }

  try {
    const bookingId = await redis.get<string>(`cancel:${token}`);
    if (!bookingId) {
      // Token not found or already used
      return NextResponse.redirect(`${origin}/?cancelled=error`);
    }

    const cancelled = await cancelSlot(bookingId as string);

    // Delete the token — one-time use
    await redis.del(`cancel:${token}`);

    if (!cancelled) {
      // Already cancelled or not found
      return NextResponse.redirect(`${origin}/?cancelled=already`);
    }

    return NextResponse.redirect(`${origin}/?cancelled=1`);
  } catch {
    return NextResponse.redirect(`${origin}/?cancelled=error`);
  }
}
