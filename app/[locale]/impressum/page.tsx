import { Link } from '@/i18n/routing';
import { salonConfig } from '@lib/config';

export default function ImpressumPage() {
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
          Impressum
        </h1>

        <div className="prose prose-sm max-w-none text-[var(--color-muted)] space-y-6">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
            ⚠ <strong>Demo-Hinweis:</strong> Diese Website ist ein fiktives Demonstrationsprojekt.
            Alle unten genannten Angaben sind <strong>erfunden</strong> und dienen ausschließlich
            zur Veranschaulichung. Es handelt sich um kein reales Unternehmen.
          </div>

          <section>
            <h2 className="text-base font-bold text-[var(--color-text)] mb-2">
              Angaben gemäß § 5 TMG
            </h2>
            <p className="text-sm leading-relaxed">
              {salonConfig.name} <span className="text-xs opacity-50">[fiktiv]</span>
              <br />
              {salonConfig.addressDisplay} <span className="text-xs opacity-50">[fiktiv]</span>
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-[var(--color-text)] mb-2">Kontakt</h2>
            <p className="text-sm leading-relaxed">
              Telefon: {salonConfig.phone} <span className="text-xs opacity-50">[fiktiv]</span>
              <br />
              E-Mail: {salonConfig.email} <span className="text-xs opacity-50">[fiktiv]</span>
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-[var(--color-text)] mb-2">
              Verantwortlich für den Inhalt
            </h2>
            <p className="text-sm leading-relaxed">
              Diese Demo-Website wurde erstellt von:
              <br />
              <a
                href="https://kobiakov.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--color-blue-glow)] underline hover:no-underline"
              >
                Vladislav Kobiakov — kobiakov.dev
              </a>
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-[var(--color-text)] mb-2">Haftungsausschluss</h2>
            <p className="text-sm leading-relaxed">
              Diese Website dient ausschließlich als Portfolio-Demonstration. Alle dargestellten
              Inhalte, Preise, Kontaktdaten, Bewertungen und Referenzen sind fiktiv. Eine
              Kontaktaufnahme über die auf dieser Seite genannten Daten ist nicht möglich.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
