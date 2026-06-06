'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Scissors, User, Baby, Palette, Sparkles, Clock, Info } from 'lucide-react';
import { priceList } from '@lib/config';

const iconMap = { Scissors, User, Baby, Palette, Sparkles } as const;

export function PriceList() {
  const t = useTranslations('priceList');

  return (
    <section className="section-padding bg-[var(--color-bg)]">
      <div className="container-narrow max-w-4xl">
        <div className="space-y-12">
          {priceList.map((cat, ci) => {
            const Icon = iconMap[cat.icon as keyof typeof iconMap];
            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: ci * 0.05 }}
              >
                {/* Category header */}
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-11 h-11 rounded-xl bg-[var(--color-blue)]/10 flex items-center justify-center">
                    <Icon size={20} className="text-[var(--color-blue-glow)]" />
                  </div>
                  <h2 className="text-xl md:text-2xl font-extrabold text-[var(--color-text)] tracking-tight">
                    {t(cat.titleKey)}
                  </h2>
                </div>

                {/* Items */}
                <div className="rounded-2xl border border-[var(--color-border)] bg-white overflow-hidden divide-y divide-[var(--color-border)]">
                  {cat.items.map((item) => (
                    <div
                      key={item.nameKey}
                      className="flex items-center justify-between gap-4 px-5 py-4 hover:bg-[var(--color-bg-alt)]/60 transition-colors"
                    >
                      <div className="min-w-0">
                        <p className="text-sm md:text-base font-semibold text-[var(--color-text)]">
                          {t(item.nameKey)}
                        </p>
                        <p className="flex items-center gap-1 text-xs text-[var(--color-muted)] mt-0.5">
                          <Clock size={12} />
                          {t('durationLabel')}: ca. {item.duration} Min.
                        </p>
                      </div>
                      <span className="shrink-0 text-sm md:text-base font-bold text-[var(--color-blue-glow)] whitespace-nowrap">
                        {item.price}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Note */}
        <div className="mt-10 flex items-start gap-2.5 rounded-xl bg-[var(--color-bg-alt)] border border-[var(--color-border)] p-4">
          <Info size={16} className="text-[var(--color-blue-glow)] shrink-0 mt-0.5" />
          <p className="text-xs text-[var(--color-muted)] leading-relaxed">{t('note')}</p>
        </div>
      </div>
    </section>
  );
}
