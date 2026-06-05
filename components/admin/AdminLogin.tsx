'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Loader2 } from 'lucide-react';

export function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(false);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        setError(true);
        return;
      }
      router.refresh();
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)] p-6">
      <form
        onSubmit={submit}
        className="w-full max-w-sm bg-white rounded-2xl border border-[var(--color-border)] shadow-xl p-8"
      >
        <div className="w-12 h-12 rounded-xl bg-[var(--color-blue)]/10 flex items-center justify-center mx-auto mb-5">
          <Lock size={22} className="text-[var(--color-blue-glow)]" />
        </div>
        <h1 className="text-xl font-bold text-[var(--color-text)] text-center mb-1">
          Buchungs-Übersicht
        </h1>
        <p className="text-sm text-[var(--color-muted)] text-center mb-6">
          Bitte mit dem Admin-Passwort anmelden.
        </p>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Passwort"
          autoFocus
          className="w-full bg-[var(--color-bg-alt)] border border-[var(--color-border)] rounded-xl px-4 py-3 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-blue)] transition-colors"
        />
        {error && <p className="text-red-500 text-xs mt-2">Falsches Passwort.</p>}
        <button
          type="submit"
          disabled={loading || !password}
          className="w-full mt-4 py-3 rounded-full bg-[var(--color-blue)] hover:bg-[var(--color-blue-light)] disabled:opacity-60 text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : null}
          Anmelden
        </button>
        <p className="text-[11px] text-[var(--color-muted)] text-center mt-4">
          Demo-Bereich · Standard-Passwort: <code>haarmonie-demo</code>
        </p>
      </form>
    </div>
  );
}
