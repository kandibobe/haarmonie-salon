import { createHmac } from 'crypto';
import { cookies } from 'next/headers';

export function makeSessionToken(password: string): string {
  const secret = process.env.SESSION_SECRET || 'fallback-dev-secret';
  return createHmac('sha256', secret).update(password).digest('hex');
}

export async function isAdminAuthed(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_auth')?.value;
  const expected = makeSessionToken(process.env.ADMIN_PASSWORD || 'haarmonie-demo');
  return token === expected;
}
