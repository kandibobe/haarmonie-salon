'use client';

export default function Error() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)]">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-[var(--color-text)] mb-2">Etwas ist schiefgelaufen</h1>
        <a href="/" className="text-[var(--color-blue-glow)] underline text-sm">Zurück zur Startseite</a>
      </div>
    </div>
  );
}
