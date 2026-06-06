'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { X, Info } from 'lucide-react';
import { salonConfig } from '@lib/config';

export function DemoBanner() {
  const t = useTranslations('demo');
  const [visible, setVisible] = useState(true);

  if (!salonConfig.demo.enabled || !visible) return null;

  return (
    <div className="relative z-[200] bg-[var(--color-slate)] border-b border-[var(--color-yellow)]/30">
      <div className="container-narrow py-2.5 flex items-center gap-3">
        <Info size={14} className="text-[var(--color-yellow)] shrink-0" />
        <p className="text-xs text-white/70 flex-1 leading-snug">
          <span className="font-semibold text-[var(--color-yellow)]">{t('bannerLabel')} </span>
          {t('bannerText')}{' '}
          <a
            href={salonConfig.demo.authorUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-[var(--color-yellow)] underline underline-offset-2 hover:brightness-110 transition-colors"
          >
            {salonConfig.demo.author}
          </a>
          {' '}
          <span className="hidden sm:inline text-white/40">·</span>{' '}
          <a
            href={`${salonConfig.demo.authorUrl}/contact`}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline text-white/55 underline underline-offset-2 hover:text-[var(--color-yellow)] transition-colors"
          >
            {t('bannerCta')}
          </a>
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
