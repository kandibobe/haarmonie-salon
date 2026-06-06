'use client';

import { CalendarDays } from 'lucide-react';
import { useRouter } from '@/i18n/routing';

/**
 * Wiederverwendbarer Call-to-Action-Streifen am Seitenende.
 * Führt zum Buchungsbereich der Startseite (/#booking).
 */
export function CtaBand({
  title,
  text,
  button,
}: {
  title: string;
  text: string;
  button: string;
}) {
  const router = useRouter();

  return (
    <section className="section-padding bg-[var(--color-bg-alt)]">
      <div className="container-narrow">
        <div className="relative overflow-hidden rounded-3xl gradient-blue px-8 py-12 md:px-14 md:py-16 text-center">
          <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/10 blur-2xl" />
          <div className="relative">
            <h2 className="text-2xl md:text-4xl font-extrabold text-white mb-3 tracking-tight text-balance">
              {title}
            </h2>
            <p className="text-white/85 text-base md:text-lg max-w-xl mx-auto mb-7">{text}</p>
            <button
              onClick={() => router.push('/#booking')}
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-white text-[var(--color-blue-dark)] text-sm font-bold hover:bg-white/90 transition-colors shadow-lg"
            >
              <CalendarDays size={16} />
              {button}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
