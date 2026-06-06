'use client';

import { useTranslations } from 'next-intl';
import { MapPin } from 'lucide-react';
import { useConsent } from './ConsentProvider';
import { salonConfig } from '@lib/config';

/**
 * Google-Maps-Einbettung mit DSGVO-Gate: Der iframe wird erst geladen,
 * wenn der Nutzer der Maps-Kategorie zugestimmt hat. Vorher erscheint ein
 * Platzhalter mit Aktivieren-Button.
 */
export function MapEmbed({ title, className }: { title: string; className?: string }) {
  const t = useTranslations('consent');
  const { consent, save } = useConsent();

  if (!consent?.maps) {
    return (
      <div
        className={`flex flex-col items-center justify-center text-center gap-3 bg-[var(--color-bg-alt)] p-8 ${className ?? ''}`}
      >
        <div className="w-12 h-12 rounded-xl bg-[var(--color-blue)]/10 flex items-center justify-center">
          <MapPin size={22} className="text-[var(--color-blue-glow)]" />
        </div>
        <h3 className="text-sm font-bold text-[var(--color-text)]">{t('mapsGateTitle')}</h3>
        <p className="text-xs text-[var(--color-muted)] max-w-xs leading-relaxed">
          {t('mapsGateText')}
        </p>
        <button
          onClick={() => save({ maps: true, ai: consent?.ai ?? false })}
          className="mt-1 px-5 py-2 rounded-full bg-[var(--color-blue)] hover:bg-[var(--color-blue-light)] text-white text-sm font-semibold transition-colors"
        >
          {t('mapsGateButton')}
        </button>
      </div>
    );
  }

  return (
    <iframe
      src={salonConfig.googleMapsEmbedUrl}
      width="100%"
      height="100%"
      style={{ border: 0, minHeight: '320px' }}
      allowFullScreen
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      title={title}
    />
  );
}
