import { NextResponse } from 'next/server';
import { getAvailableSlots } from '@lib/availability';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get('date');

  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: 'Invalid or missing date' }, { status: 400 });
  }

  const slots = await getAvailableSlots(date);
  return NextResponse.json({ date, slots });
}
