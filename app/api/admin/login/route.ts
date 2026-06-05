import { NextResponse } from 'next/server';

// Einfaches Demo-Passwort-Gate (kein NextAuth nötig für eine Demo).
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'haarmonie-demo';
const COOKIE = 'admin_auth';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const { password } = await request.json().catch(() => ({ password: '' }));
  if (password !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'invalid' }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE, ADMIN_PASSWORD, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 8, // 8 Stunden
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
