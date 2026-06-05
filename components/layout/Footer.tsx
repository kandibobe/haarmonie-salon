'use client';

import { useTranslations } from 'next-intl';
import { Scissors, MapPin, Phone, Mail } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { salonConfig } from '@lib/config';

const navSections = ['services', 'about', 'projects', 'contact'] as const;

export function Footer() {
  const t = useTranslations('nav');
  const tf = useTranslations('footer');

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-[var(--color-slate)] text-white/80">
      <div className="container-narrow py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[var(--color-blue)] flex items-center justify-center">
                <Scissors size={16} className="text-[var(--color-yellow)]" />
              </div>
              <span className="font-bold text-xl text-white">{salonConfig.shortName}</span>
            </div>
            <p className="text-sm leading-relaxed text-white/55">{tf('tagline')}</p>

            <p className="text-[10px] text-white/35 leading-relaxed border border-white/10 rounded-lg px-3 py-2">
              ⚠ Demo-Projekt · Alle Angaben fiktiv ·{' '}
              <a
                href="https://kobiakov.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--color-yellow)]/70 hover:text-[var(--color-yellow)] transition-colors"
              >
                kobiakov.dev
              </a>
            </p>

            <div className="flex flex-wrap gap-2 pt-1">
              {salonConfig.highlights.map((item) => (
                <span
                  key={item}
                  className="text-[10px] font-semibold text-[var(--color-yellow)]/80 border border-[var(--color-yellow)]/20 rounded px-2 py-0.5"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold text-white uppercase tracking-widest">
              {tf('navigation')}
            </h3>
            <ul className="space-y-2">
              {navSections.map((key) => (
                <li key={key}>
                  <button
                    type="button"
                    onClick={() => scrollTo(key)}
                    className="text-sm text-white/55 hover:text-[var(--color-yellow)] transition-colors"
                  >
                    {t(key)}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact + Legal */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold text-white uppercase tracking-widest">
              {tf('legal')}
            </h3>
            <ul className="space-y-3 text-sm text-white/55">
              <li className="flex items-start gap-2">
                <MapPin size={14} className="mt-0.5 shrink-0 text-[var(--color-blue-light)]" />
                <span>
                  {salonConfig.addressDisplay}{' '}
                  <span className="text-white/30 text-xs">(fiktiv)</span>
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={14} className="shrink-0 text-[var(--color-blue-light)]" />
                <span>
                  {salonConfig.phone}{' '}
                  <span className="text-white/30 text-xs">(fiktiv)</span>
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={14} className="shrink-0 text-[var(--color-blue-light)]" />
                <span className="text-xs break-all">{salonConfig.email}</span>
              </li>
            </ul>

            <div className="pt-2 flex flex-col gap-1.5 text-xs">
              <Link
                href="/impressum"
                className="text-white/40 hover:text-white/70 transition-colors w-fit"
              >
                {tf('impressum')}
              </Link>
              <Link
                href="/datenschutz"
                className="text-white/40 hover:text-white/70 transition-colors w-fit"
              >
                {tf('datenschutz')}
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-white/35">
          <span>{tf('copyright')}</span>
          <span>
            {tf('madeBy')}{' '}
            <a
              href="https://kobiakov.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--color-blue-light)] hover:text-white transition-colors"
            >
              {tf('madeByLink')}
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
