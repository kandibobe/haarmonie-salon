'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Scissors, User, Palette, Sparkles, Crown, Baby } from 'lucide-react';
import { SectionBadge } from '@components/ui/SectionBadge';
import { services } from '@lib/config';

const iconMap = { Scissors, User, Palette, Sparkles, Crown, Baby } as const;

export function ServicesSection() {
  const t = useTranslations('services');

  return (
    <section id="services" className="section-padding bg-[var(--color-bg)]">
      <div className="container-narrow">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <SectionBadge>{t('badge')}</SectionBadge>
          <h2 className="text-3xl md:text-5xl font-extrabold text-[var(--color-text)] mt-4 mb-3 tracking-tight">
            {t('title')}
          </h2>
          <p className="text-[var(--color-muted)] text-base md:text-lg max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, i) => {
            const Icon = iconMap[service.icon as keyof typeof iconMap];
            const isBlue = service.color === 'blue';

            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                whileHover={{ y: -4 }}
                className="group bg-white rounded-2xl p-7 border border-[var(--color-border)] hover:border-[var(--color-blue-light)] hover:shadow-xl hover:shadow-[var(--color-blue)]/8 transition-all duration-300 cursor-pointer"
              >
                {/* Icon */}
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110 ${
                    isBlue
                      ? 'bg-[var(--color-blue)]/10'
                      : 'bg-[var(--color-yellow)]/15'
                  }`}
                >
                  <Icon
                    size={22}
                    className={isBlue ? 'text-[var(--color-blue-glow)]' : 'text-[var(--color-yellow-dark)]'}
                  />
                </div>

                {/* Text */}
                <h3 className="font-bold text-lg text-[var(--color-text)] mb-2 tracking-tight">
                  {t(service.titleKey)}
                </h3>
                <p className="text-sm text-[var(--color-muted)] leading-relaxed mb-4">
                  {t(service.descKey)}
                </p>

                {/* Price + duration */}
                <div className="flex items-center justify-between border-t border-[var(--color-border)] pt-4">
                  <span className="text-sm font-bold text-[var(--color-blue-glow)]">
                    {service.price}
                  </span>
                  <span className="text-xs text-[var(--color-muted)]">
                    {t('duration', { min: service.duration })}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
