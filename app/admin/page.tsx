import { CalendarDays, LogOut, Inbox, Clock } from 'lucide-react';
import { getAllBookings, type BookingStatus } from '@lib/availability';
import { salonConfig } from '@lib/config';
import { AdminLogin } from '@components/admin/AdminLogin';
import { BookingActions } from '@components/admin/BookingActions';
import { isAdminAuthed } from '@lib/admin-auth';

export const dynamic = 'force-dynamic';

function formatDateDE(dateStr: string): string {
  const d = new Date(`${dateStr}T00:00:00`);
  return d.toLocaleDateString('de-DE', { weekday: 'short', day: '2-digit', month: '2-digit' });
}

const STATUS_BADGE: Record<BookingStatus, { label: string; cls: string }> = {
  pending: { label: 'Ausstehend', cls: 'bg-slate-100 text-slate-600' },
  completed: { label: 'Abgeschlossen', cls: 'bg-emerald-50 text-emerald-700' },
  cancelled: { label: 'Abgesagt', cls: 'bg-red-50 text-red-600' },
  no_show: { label: 'Nicht erschienen', cls: 'bg-orange-50 text-orange-700' },
};

export default async function AdminPage() {
  const authed = await isAdminAuthed();
  if (!authed) return <AdminLogin />;

  const bookings = await getAllBookings();
  const today = new Date().toISOString().slice(0, 10);
  const past14 = new Date();
  past14.setDate(past14.getDate() - 14);
  const past14Str = past14.toISOString().slice(0, 10);

  const upcoming = bookings.filter((b) => b.date >= today && (b.status ?? 'pending') !== 'cancelled');
  const recent = bookings.filter(
    (b) => b.date >= past14Str && b.date < today && b.status !== undefined
  );

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
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

      <main className="max-w-4xl mx-auto px-6 py-8 space-y-8">
        {/* Upcoming */}
        <section>
          <div className="flex items-center gap-2 mb-4 text-[var(--color-muted)]">
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
              <p className="text-xs mt-1 opacity-70">Neue Online-Buchungen erscheinen hier automatisch.</p>
            </div>
          ) : (
            <BookingsTable bookings={upcoming} showActions />
          )}
        </section>

        {/* Recent (last 14 days) */}
        {recent.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-4 text-[var(--color-muted)]">
              <Clock size={16} className="text-[var(--color-blue-glow)]" />
              <span className="text-sm font-semibold text-[var(--color-text)]">Kürzlich (letzte 14 Tage)</span>
            </div>
            <BookingsTable bookings={recent} showActions={false} />
          </section>
        )}

        <p className="text-[11px] text-[var(--color-muted)] text-center">
          ⚠ Demo · Alle Daten fiktiv · Buchungen aus Upstash Redis.
        </p>
      </main>
    </div>
  );
}

function BookingsTable({
  bookings,
  showActions,
}: {
  bookings: Awaited<ReturnType<typeof getAllBookings>>;
  showActions: boolean;
}) {
  return (
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
              <th className="px-4 py-3 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b, i) => {
              const status = (b.status ?? 'pending') as BookingStatus;
              const badge = STATUS_BADGE[status];
              const bookingId = `booking:${b.date}:${b.time}`;
              return (
                <tr key={`${b.date}-${b.time}-${i}`} className="border-t border-[var(--color-border)]">
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
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-medium ${badge.cls}`}>
                      {badge.label}
                    </span>
                    {showActions && (
                      <div className="mt-2">
                        <BookingActions bookingId={bookingId} currentStatus={status} />
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
