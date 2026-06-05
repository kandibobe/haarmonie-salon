'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { SectionBadge } from '@components/ui/SectionBadge';
import { BookingWidget } from '@components/booking/BookingWidget';

export function BookingSection() {
  const t = useTranslations('booking');

  return (
    <section id="booking" className="section-padding bg-[var(--color-bg-alt)]">
      <div className="container-narrow">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-10"
          >
            <SectionBadge>{t('badge')}</SectionBadge>
            <h2 className="text-3xl md:text-5xl font-extrabold text-[var(--color-text)] mt-4 mb-3 tracking-tight">
              {t('title')}
            </h2>
            <p className="text-[var(--color-muted)] text-base md:text-lg max-w-xl mx-auto">
              {t('subtitle')}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            <BookingWidget />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
