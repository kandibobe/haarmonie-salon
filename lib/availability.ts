import { redis } from './redis';
import { salonConfig } from './config';

/**
 * Reusable Terminbuchungs-Kern.
 *
 * Slot-Generierung basiert auf salonConfig.bookingHours + slotMinutes.
 * Belegte Slots werden in Upstash Redis gespeichert (SET je Tag), sodass
 * gebuchte Zeiten für alle Besucher verschwinden. Ohne konfiguriertes Redis
 * fällt das Modul graceful zurück (keine Persistenz, alle Slots frei) — so
 * läuft die Demo auch lokal ohne Infrastruktur.
 *
 * Wiederverwendbar: in einem anderen Projekt nur lib/config.ts anpassen.
 */

export const isPersistenceEnabled = redis !== null;

const BOOKING_TTL_SECONDS = 60 * 60 * 24 * 60; // 60 Tage — Demo-Daten räumen sich selbst auf

function pad(n: number): string {
  return n.toString().padStart(2, '0');
}

export function timeToMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
}

function minutesToTime(min: number): string {
  return `${pad(Math.floor(min / 60))}:${pad(min % 60)}`;
}

/** YYYY-MM-DD in lokaler Zeit. */
export function toDateStr(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function parseDateStr(dateStr: string): Date {
  // Ohne "Z" → lokale Zeitzone, damit getDay() korrekt ist.
  return new Date(`${dateStr}T00:00:00`);
}

/** Alle theoretischen Slots eines Tages anhand der Öffnungszeiten. */
export function generateSlotsForDate(dateStr: string): string[] {
  const date = parseDateStr(dateStr);
  if (Number.isNaN(date.getTime())) return [];

  const hours = salonConfig.bookingHours[date.getDay()];
  if (!hours) return [];

  const slots: string[] = [];
  const start = timeToMinutes(hours.open);
  const end = timeToMinutes(hours.close);
  for (let t = start; t + salonConfig.slotMinutes <= end; t += salonConfig.slotMinutes) {
    slots.push(minutesToTime(t));
  }
  return slots;
}

/** Kommende buchbare Tage (überspringt geschlossene Wochentage). */
export function getUpcomingDates(daysAhead = salonConfig.bookingDaysAhead): string[] {
  const result: string[] = [];
  const today = new Date();
  for (let i = 0; i < daysAhead; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    if (salonConfig.bookingHours[d.getDay()]) {
      result.push(toDateStr(d));
    }
  }
  return result;
}

function bookingKey(dateStr: string): string {
  return `bookings:${dateStr}`;
}

/** Belegte Slots eines Tages (aus Redis, sonst leer). */
export async function getBookedSlots(dateStr: string): Promise<string[]> {
  if (!redis) return [];
  try {
    return await redis.smembers(bookingKey(dateStr));
  } catch {
    return [];
  }
}

/** Freie Slots = generierte Slots − belegte − (heute) vergangene Zeiten. */
export async function getAvailableSlots(dateStr: string): Promise<string[]> {
  const all = generateSlotsForDate(dateStr);
  if (all.length === 0) return [];

  const booked = new Set(await getBookedSlots(dateStr));
  let free = all.filter((s) => !booked.has(s));

  // Heutige, bereits vergangene Slots ausblenden.
  const todayStr = toDateStr(new Date());
  if (dateStr === todayStr) {
    const nowMin = new Date().getHours() * 60 + new Date().getMinutes();
    free = free.filter((s) => timeToMinutes(s) > nowMin);
  }
  return free;
}

export interface BookingDetails {
  name: string;
  email: string;
  phone: string;
  service: string;
  date: string;
  time: string;
}

/**
 * Reserviert einen Slot atomar-genug für eine Demo: prüft Belegung und
 * fügt hinzu. Gibt false zurück, wenn der Slot bereits vergeben ist.
 * Ohne Redis immer true (keine Persistenz).
 */
export async function reserveSlot(details: BookingDetails): Promise<boolean> {
  if (!redis) return true;

  const key = bookingKey(details.date);
  try {
    const already = await redis.sismember(key, details.time);
    if (already) return false;

    await redis.sadd(key, details.time);
    await redis.expire(key, BOOKING_TTL_SECONDS);

    const id = `booking:${details.date}:${details.time}`;
    await redis.set(id, JSON.stringify({ ...details, createdAt: new Date().toISOString() }), {
      ex: BOOKING_TTL_SECONDS,
    });
    return true;
  } catch {
    // Bei Redis-Fehler die Buchung nicht blockieren (Demo-Verhalten).
    return true;
  }
}
