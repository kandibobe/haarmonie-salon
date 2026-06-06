import { Link } from '@/i18n/routing';
import { salonConfig } from '@lib/config';

export default function DatenschutzPage() {
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
          Datenschutzerklärung
        </h1>

        <div className="space-y-6 text-sm text-[var(--color-muted)]">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-amber-800">
            ⚠ <strong>Demo-Hinweis:</strong> Dies ist eine fiktive Demo-Website. Alle genannten
            Angaben sind erfunden. Es werden keine echten Kundendaten dauerhaft verarbeitet.
          </div>

          <section>
            <h2 className="text-base font-bold text-[var(--color-text)] mb-2">
              1. Verantwortlicher
            </h2>
            <p className="leading-relaxed">
              Verantwortlich für diese Demo-Website im Sinne der DSGVO ist:
              <br />
              <a
                href="https://kobiakov.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--color-blue-glow)] underline hover:no-underline"
              >
                Vladislav Kobiakov — kobiakov.dev
              </a>
              <br />
              Fiktive Unternehmensadresse: {salonConfig.addressDisplay}
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-[var(--color-text)] mb-2">
              2. Online-Terminbuchung
            </h2>
            <p className="leading-relaxed">
              Wenn Sie über das Buchungsformular einen Termin anfragen, verarbeiten wir die
              folgenden Daten zum Zweck der Terminvereinbarung (Art. 6 Abs. 1 lit. b DSGVO —
              Vertragsanbahnung):
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Vor- und Nachname</li>
              <li>E-Mail-Adresse</li>
              <li>Telefonnummer</li>
              <li>Gewählte Leistung sowie Datum und Uhrzeit</li>
            </ul>
            <p className="mt-2 leading-relaxed">
              Zur Verwaltung freier und belegter Termine wird der gebuchte Zeitpunkt in einem
              Datenbankdienst (Upstash Redis) gespeichert. In dieser Demo werden die Daten nur zu
              Demonstrationszwecken verarbeitet und nach 60 Tagen automatisch gelöscht.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-[var(--color-text)] mb-2">
              3. KI-Chat (Google Gemini)
            </h2>
            <p className="leading-relaxed">
              Der KI-Empfang auf dieser Website beantwortet Ihre Fragen mithilfe des
              KI-Dienstes Google Gemini. Ihre im Chat eingegebenen Nachrichten werden zur
              Beantwortung an Google übermittelt und dort verarbeitet. Geben Sie dort bitte keine
              sensiblen personenbezogenen Daten ein. Weitere Informationen in der{' '}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--color-blue-glow)] underline hover:no-underline"
              >
                Datenschutzerklärung von Google
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-[var(--color-text)] mb-2">
              4. WhatsApp-Bestätigung
            </h2>
            <p className="leading-relaxed">
              Optional können Sie Ihren Termin per WhatsApp bestätigen. Wenn Sie die Schaltfläche
              „Per WhatsApp bestätigen“ nutzen, werden Sie zu WhatsApp (Meta Platforms Ireland Ltd.)
              weitergeleitet und es wird eine vorausgefüllte Nachricht geöffnet. Die Nutzung von
              WhatsApp erfolgt freiwillig und unterliegt der{' '}
              <a
                href="https://www.whatsapp.com/legal/privacy-policy-eea"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--color-blue-glow)] underline hover:no-underline"
              >
                Datenschutzerklärung von WhatsApp
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-[var(--color-text)] mb-2">5. Cookies</h2>
            <p className="leading-relaxed">
              Diese Demo-Website verwendet keine Tracking- oder Analyse-Cookies. Es werden
              ausschließlich technisch notwendige Funktionen eingesetzt.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-[var(--color-text)] mb-2">6. Google Maps</h2>
            <p className="leading-relaxed">
              Diese Website verwendet Google Maps für die Darstellung des Standorts. Beim Laden der
              Karte kann Google Daten erheben. Weitere Informationen finden Sie in der{' '}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--color-blue-glow)] underline hover:no-underline"
              >
                Datenschutzerklärung von Google
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-[var(--color-text)] mb-2">7. Bildmaterial (Unsplash)</h2>
            <p className="leading-relaxed">
              Einige Bilder auf dieser Website werden über den Dienst Unsplash (Unsplash Inc., 500
              rue Notre-Dame Ouest, Montréal, QC, Kanada) eingebunden. Beim Abrufen der Bilder kann
              Unsplash technische Daten (z. B. IP-Adresse) empfangen. Weitere Informationen finden
              Sie in der{' '}
              <a
                href="https://unsplash.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--color-blue-glow)] underline hover:no-underline"
              >
                Datenschutzerklärung von Unsplash
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-[var(--color-text)] mb-2">8. Ihre Rechte</h2>
            <p className="leading-relaxed">
              Sie haben gemäß DSGVO das Recht auf Auskunft, Berichtigung, Löschung und
              Einschränkung der Verarbeitung Ihrer personenbezogenen Daten. Wenden Sie sich hierzu
              an:{' '}
              <a
                href="https://kobiakov.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--color-blue-glow)] underline hover:no-underline"
              >
                kobiakov.dev
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
