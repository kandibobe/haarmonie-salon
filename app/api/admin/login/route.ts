import { NextResponse } from 'next/server';
import { checkRateLimit, getClientIp } from '@lib/rate-limit';
import { makeSessionToken } from '@lib/admin-auth';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'haarmonie-demo';
const COOKIE = 'admin_auth';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  // CSRF: exact hostname match (prevents evil.com.haarmonie.com bypass)
  const origin = request.headers.get('origin');
  const host = request.headers.get('host');
  if (origin && host) {
    try {
      const originHost = new URL(origin).hostname;
      const expectedHost = host.split(':')[0];
      if (originHost !== expectedHost) {
        return NextResponse.json({ error: 'forbidden' }, { status: 403 });
      }
    } catch {
      return NextResponse.json({ error: 'forbidden' }, { status: 403 });
    }
  }

  // Rate limit: 3 attempts per 15 minutes per IP
  const ip = getClientIp(request);
  const { success } = await checkRateLimit('adminLogin', ip);
  if (!success) {
    return NextResponse.json({ error: 'too_many_requests' }, { status: 429 });
  }

  const { password } = await request.json().catch(() => ({ password: '' }));
  if (password !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'invalid' }, { status: 401 });
  }

  // Store HMAC-signed token instead of raw password
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE, makeSessionToken(ADMIN_PASSWORD), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 8,
  });
  return res;
}

// Logout: GET /api/admin/login?action=logout → Cookie löschen, zurück zu /admin
export async function GET(request: Request) {
  const url = new URL(request.url);
  if (url.searchParams.get('action') === 'logout') {
    const res = NextResponse.redirect(new URL('/admin', url.origin));
    res.cookies.delete(COOKIE);
    return res;
  }
  return NextResponse.json({ ok: true });
}
