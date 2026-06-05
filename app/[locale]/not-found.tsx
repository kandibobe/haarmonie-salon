import { Link } from '@/i18n/routing';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)]">
      <div className="text-center">
        <div className="text-8xl font-black text-[var(--color-blue)]/10 mb-4">404</div>
        <h1 className="text-2xl font-bold text-[var(--color-text)] mb-2">Seite nicht gefunden</h1>
        <Link href="/" className="text-[var(--color-blue-glow)] underline text-sm">
          Zurück zur Startseite
        </Link>
      </div>
    </div>
  );
}
