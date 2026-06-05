'use client';

import { useState } from 'react';
import { X, Info } from 'lucide-react';

export function DemoBanner() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="relative z-[200] bg-[var(--color-slate)] border-b border-[var(--color-yellow)]/30">
      <div className="container-narrow py-2.5 flex items-center gap-3">
        <Info size={14} className="text-[var(--color-yellow)] shrink-0" />
        <p className="text-xs text-white/70 flex-1 leading-snug">
          <span className="font-semibold text-[var(--color-yellow)]">Demo-Website · </span>
          Diese Website ist ein fiktives Demonstrationsprojekt von{' '}
          <a
            href="https://kobiakov.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/90 underline underline-offset-2 hover:text-[var(--color-yellow)] transition-colors"
          >
            kobiakov.dev
          </a>
          . Alle Angaben (Firma, Preise, Bewertungen, Kontaktdaten) sind{' '}
          <strong className="text-white/90">fiktiv</strong> und dienen ausschließlich der
          Veranschaulichung.
        </p>
        <button
          type="button"
          onClick={() => setVisible(false)}
          className="shrink-0 p-1 text-white/40 hover:text-white transition-colors"
          aria-label="Banner schließen"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
