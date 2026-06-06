import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { salonConfig } from '@lib/config';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'agb' });
  return {
    title: t('metaTitle'),
    description: t('metaDesc'),
    robots: { index: false, follow: true },
    alternates: { canonical: locale === 'de' ? '/agb' : `/${locale}/agb` },
  };
}

export default function AGBPage() {
  return (
    <div className="min-h-screen bg-[var(--color-bg)] pt-32 pb-20">
      <div className="container-narrow max-w-2xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-[var(--color-muted)] hover:text-[var(--color-blue-glow)] transition-colors mb-8"
        >
          ← Zurück zur Startseite
        </Link>

        <h1 className="text-3xl font-extrabold text-[var(--color-text)] mb-8 tracking-tight">
          Allgemeine Geschäftsbedingungen (AGB)
        </h1>

        <div className="prose prose-sm max-w-none text-[var(--color-muted)] space-y-6">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
            ⚠ <strong>Demo-Hinweis:</strong> Diese AGB sind ein Mustertext für ein fiktives
            Demonstrationsprojekt und stellen keine Rechtsberatung dar. Für ein reales Unternehmen
            sind individuell angepasste, anwaltlich geprüfte AGB erforderlich.
          </div>

          <section>
            <h2 className="text-base font-bold text-[var(--color-text)] mb-2">1. Geltungsbereich</h2>
            <p className="text-sm leading-relaxed">
              Diese AGB gelten für alle Dienstleistungen und Terminvereinbarungen zwischen{' '}
              {salonConfig.name} (nachfolgend „Salon") und der Kundin bzw. dem Kunden.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-[var(--color-text)] mb-2">
              2. Terminvereinbarung &amp; Online-Buchung
            </h2>
            <p className="text-sm leading-relaxed">
              Online gebuchte Termine sind verbindlich. Mit Abschluss der Buchung kommt ein
              Dienstleistungsvertrag über die gewählte Leistung zustande. Der angezeigte Preis ist
              ein Richtwert; der endgültige Preis kann je nach Haarlänge und Aufwand abweichen.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-[var(--color-text)] mb-2">
              3. Absage &amp; Nichterscheinen
            </h2>
            <p className="text-sm leading-relaxed">
              Termine können bis 24 Stunden vorher kostenfrei abgesagt oder verschoben werden. Bei
              kurzfristiger Absage oder Nichterscheinen behält sich der Salon vor, eine
              Ausfallgebühr zu berechnen.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-[var(--color-text)] mb-2">
              4. Preise &amp; Zahlung
            </h2>
            <p className="text-sm leading-relaxed">
              Alle Preise verstehen sich inkl. gesetzlicher Mehrwertsteuer. Die Zahlung erfolgt
              direkt nach der Dienstleistung im Salon (Bar oder EC-Karte).
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-[var(--color-text)] mb-2">5. Gutscheine</h2>
            <p className="text-sm leading-relaxed">
              Gutscheine sind ab Ausstellungsdatum drei Jahre gültig und für alle Leistungen
              einlösbar. Eine Barauszahlung ist nicht möglich.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-[var(--color-text)] mb-2">6. Haftung</h2>
            <p className="text-sm leading-relaxed">
              Der Salon haftet für Schäden nur bei Vorsatz oder grober Fahrlässigkeit. Bei
              bekannten Allergien oder Unverträglichkeiten ist der Salon vor der Behandlung zu
              informieren.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-[var(--color-text)] mb-2">7. Schlussbestimmungen</h2>
            <p className="text-sm leading-relaxed">
              Es gilt das Recht der Bundesrepublik Deutschland. Sollten einzelne Bestimmungen
              unwirksam sein, bleibt die Wirksamkeit der übrigen Bestimmungen unberührt.
            </p>
          </section>

          <p className="text-xs opacity-60">Stand: {salonConfig.founded} (Demo-Version)</p>
        </div>
      </div>
    </div>
  );
}
