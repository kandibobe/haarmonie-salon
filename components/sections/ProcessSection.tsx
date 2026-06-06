'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { CalendarDays, Bell, Scissors, Heart } from 'lucide-react';
import { SectionBadge } from '@components/ui/SectionBadge';
import { processSteps } from '@lib/config';

const iconMap = { CalendarDays, Bell, Scissors, Heart } as const;

export function ProcessSection() {
  const t = useTranslations('process');

  return (
    <section className="section-padding bg-[var(--color-slate)]">
      <div className="container-narrow">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <SectionBadge dark>{t('badge')}</SectionBadge>
          <h2 className="text-3xl md:text-5xl font-bold text-white mt-4 mb-3">
            {t('title')}
          </h2>
          <p className="text-white/55 text-base md:text-lg max-w-xl mx-auto">
            {t('subtitle')}
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Connecting line on desktop */}
          <div className="hidden lg:block absolute top-10 left-[calc(12.5%+24px)] right-[calc(12.5%+24px)] h-px bg-gradient-to-r from-transparent via-[var(--color-yellow)]/35 to-transparent" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
            {processSteps.map((step, i) => {
              const Icon = iconMap[step.icon as keyof typeof iconMap];
              return (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.12 }}
                  className="relative flex flex-col items-center text-center"
                >
                  {/* Step number watermark */}
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-7xl font-black text-white/[0.04] select-none pointer-events-none leading-none">
                    {step.step}
                  </div>

                  {/* Icon circle — gradient bg */}
                  <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-[var(--color-slate-light)] to-[var(--color-slate-mid)] border border-white/10 flex items-center justify-center mb-5 shadow-lg">
                    <Icon size={28} className="text-[var(--color-yellow)]" />
                    {/* Step badge — gold */}
                    <span className="absolute -top-2.5 -right-2.5 w-6 h-6 rounded-full bg-[var(--color-yellow)] text-[var(--color-slate)] text-[10px] font-black flex items-center justify-center border-2 border-[var(--color-slate)]">
                      {step.step}
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-white mb-2 tracking-tight">
                    {t(step.titleKey)}
                  </h3>
                  <p className="text-sm text-white/50 leading-relaxed max-w-[200px]">
                    {t(step.descKey)}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
