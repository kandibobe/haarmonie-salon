import { createHmac } from 'crypto';
import { cookies } from 'next/headers';

function getSessionSecret(): string {
  if (process.env.SESSION_SECRET) return process.env.SESSION_SECRET;
  if (process.env.NODE_ENV === 'production') {
    console.error('[admin-auth] SESSION_SECRET not set in production! HMAC tokens are insecure. Set this env var in Vercel.');
  }
  return 'fallback-dev-secret';
}

export function makeSessionToken(password: string): string {
  return createHmac('sha256', getSessionSecret()).update(password).digest('hex');
}

export async function isAdminAuthed(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_auth')?.value;
  const expected = makeSessionToken(process.env.ADMIN_PASSWORD || 'haarmonie-demo');
  return token === expected;
}
