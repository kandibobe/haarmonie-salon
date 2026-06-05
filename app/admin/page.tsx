import { cookies } from 'next/headers';
import { CalendarDays, LogOut, Inbox } from 'lucide-react';
import { getAllBookings } from '@lib/availability';
import { salonConfig } from '@lib/config';
import { AdminLogin } from '@components/admin/AdminLogin';

export const dynamic = 'force-dynamic';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'haarmonie-demo';

function formatDateDE(dateStr: string): string {
  const d = new Date(`${dateStr}T00:00:00`);
  return d.toLocaleDateString('de-DE', { weekday: 'short', day: '2-digit', month: '2-digit' });
}

export default async function AdminPage() {
  const cookieStore = await cookies();
  const authed = cookieStore.get('admin_auth')?.value === ADMIN_PASSWORD;

  if (!authed) return <AdminLogin />;

  const bookings = await getAllBookings();
  const today = new Date().toISOString().slice(0, 10);
  const upcoming = bookings.filter((b) => b.date >= today);

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      {/* Header */}
      <header className="bg-[var(--color-slate)] text-white">
        <div className="max-w-4xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[var(--color-blue)] flex items-center justify-center font-bold text-[var(--color-yellow-light)]">
              H
            </div>
            <div>
              <h1 className="font-bold text-base leading-tight">{salonConfig.shortName} — Buchungen</h1>
              <p className="text-[11px] text-white/50">Demo-Adminbereich</p>
            </div>
          </div>
          <a
            href="/api/admin/login?action=logout"
            className="inline-flex items-center gap-1.5 text-sm text-white/70 hover:text-white transition-colors"
          >
            <LogOut size={15} /> Abmelden
          </a>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="flex items-center gap-2 mb-5 text-[var(--color-muted)]">
          <CalendarDays size={16} className="text-[var(--color-blue-glow)]" />
          <span className="text-sm font-semibold text-[var(--color-text)]">
            {upcoming.length} anstehende {upcoming.length === 1 ? 'Buchung' : 'Buchungen'}
          </span>
          <span className="text-xs">· {bookings.length} gesamt</span>
        </div>

        {upcoming.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[var(--color-border)] p-12 text-center text-[var(--color-muted)]">
            <Inbox size={40} className="mx-auto mb-3 opacity-40" />
            <p className="text-sm">Noch keine anstehenden Buchungen.</p>
            <p className="text-xs mt-1 opacity-70">
              Neue Online-Buchungen erscheinen hier automatisch.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-[var(--color-border)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[var(--color-bg-alt)] text-left text-[var(--color-muted)]">
                    <th className="px-4 py-3 font-semibold">Datum</th>
                    <th className="px-4 py-3 font-semibold">Zeit</th>
                    <th className="px-4 py-3 font-semibold">Leistung</th>
                    <th className="px-4 py-3 font-semibold">Kunde</th>
                    <th className="px-4 py-3 font-semibold">Kontakt</th>
                  </tr>
                </thead>
                <tbody>
                  {upcoming.map((b, i) => (
                    <tr
                      key={`${b.date}-${b.time}-${i}`}
                      className="border-t border-[var(--color-border)]"
                    >
                      <td className="px-4 py-3 whitespace-nowrap font-medium text-[var(--color-text)]">
                        {formatDateDE(b.date)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap font-semibold text-[var(--color-blue-glow)]">
                        {b.time}
                      </td>
                      <td className="px-4 py-3 text-[var(--color-text)]">{b.service}</td>
                      <td className="px-4 py-3 text-[var(--color-text)]">{b.name}</td>
                      <td className="px-4 py-3 text-[var(--color-muted)]">
                        <a href={`mailto:${b.email}`} className="hover:text-[var(--color-blue-glow)] block">
                          {b.email}
                        </a>
                        <a href={`tel:${b.phone}`} className="hover:text-[var(--color-blue-glow)] block text-xs">
                          {b.phone}
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <p className="text-[11px] text-[var(--color-muted)] mt-6 text-center">
          ⚠ Demo · Alle Daten fiktiv · Buchungen aus Upstash Redis. Bei fehlender Redis-Konfiguration
          ist diese Liste leer.
        </p>
      </main>
    </div>
  );
}
