'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Calendar, Bot, ShieldCheck, ExternalLink, ArrowRight } from 'lucide-react';
import { salonConfig } from '@lib/config';

const FEATURES = [
  { icon: Calendar, key: 'feature1' },
  { icon: Bot, key: 'feature2' },
  { icon: ShieldCheck, key: 'feature3' },
] as const;

export function HireCTASection() {
  const t = useTranslations('hireCta');

  if (!salonConfig.demo.enabled) return null;

  return (
    <section className="relative overflow-hidden py-20 md:py-28 bg-[var(--color-slate)]">
      {/* Subtle gradient orbs */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[var(--color-blue)]/10 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-[var(--color-yellow)]/10 blur-3xl"
      />

      <div className="container-narrow relative z-10 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-block text-xs font-semibold tracking-[0.25em] uppercase rounded-full px-4 py-1.5 bg-[var(--color-yellow)]/15 text-[var(--color-yellow)]">
            {t('badge')}
          </span>
        </motion.div>

        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.08 }}
          className="mt-5 text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight"
        >
          {t('headline')}
        </motion.h2>

        {/* Subline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.14 }}
          className="mt-4 text-white/60 text-base md:text-lg max-w-xl mx-auto leading-relaxed"
        >
          {t('subline')}
        </motion.p>

        {/* Feature pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.2 }}
          className="mt-10 flex flex-wrap justify-center gap-4"
        >
          {FEATURES.map(({ icon: Icon, key }) => (
            <div
              key={key}
              className="flex items-center gap-2.5 bg-white/8 border border-white/10 rounded-xl px-5 py-3"
            >
              <Icon size={16} className="text-[var(--color-yellow)] shrink-0" />
              <span className="text-sm font-medium text-white/85">{t(key)}</span>
            </div>
          ))}
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.26 }}
          className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
        >
          <a
            href={`${salonConfig.demo.authorUrl}/contact`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--color-yellow)] px-8 py-4 text-sm font-bold text-[var(--color-slate)] hover:brightness-110 transition-all shadow-lg shadow-[var(--color-yellow)]/20"
          >
            {t('ctaPrimary')}
            <ArrowRight size={16} />
          </a>
          <a
            href={`${salonConfig.demo.authorUrl}/portfolio`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 px-8 py-4 text-sm font-semibold text-white/80 hover:bg-white/8 hover:text-white transition-all"
          >
            {t('ctaSecondary')}
            <ExternalLink size={14} />
          </a>
        </motion.div>

        {/* Fine print */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="mt-8 text-xs text-white/35 tracking-wide"
        >
          {t('finePrint')}{' '}
          <a
            href={salonConfig.demo.authorUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-white/60 transition-colors"
          >
            {salonConfig.demo.author}
          </a>
        </motion.p>
      </div>
    </section>
  );
}
