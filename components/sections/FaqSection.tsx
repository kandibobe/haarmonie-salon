'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';
import { SectionBadge } from '@components/ui/SectionBadge';

const FAQ_KEYS = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6'] as const;

export function FaqSection() {
  const t = useTranslations('faq');
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (i: number) => setOpenIndex((prev) => (prev === i ? null : i));

  return (
    <section id="faq" className="section-padding bg-[var(--color-bg-alt)]">
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
          <h2 className="text-3xl md:text-5xl font-bold text-[var(--color-text)] mt-4 mb-3">
            {t('title')}
          </h2>
          <p className="text-[var(--color-muted)] text-base md:text-lg max-w-xl mx-auto">
            {t('subtitle')}
          </p>
        </motion.div>

        {/* Accordion */}
        <div className="max-w-2xl mx-auto space-y-3">
          {FAQ_KEYS.map((key, i) => {
            const isOpen = openIndex === i;
            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className={`rounded-2xl border transition-colors duration-200 overflow-hidden ${
                  isOpen
                    ? 'border-[var(--color-blue-light)] bg-white shadow-md shadow-[var(--color-blue)]/6'
                    : 'border-[var(--color-border)] bg-white hover:border-[var(--color-blue-light)]/60'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggle(i)}
                  className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="font-semibold text-[var(--color-text)] text-sm md:text-base leading-snug">
                    {t(`${key}Q` as Parameters<typeof t>[0])}
                  </span>
                  <span
                    className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-colors duration-200 ${
                      isOpen
                        ? 'bg-[var(--color-blue)] text-white'
                        : 'bg-[var(--color-bg-alt)] text-[var(--color-muted)]'
                    }`}
                  >
                    {isOpen ? <Minus size={14} /> : <Plus size={14} />}
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.28, ease: 'easeInOut' }}
                    >
                      <div className="px-6 pb-5 text-sm text-[var(--color-muted)] leading-relaxed border-t border-[var(--color-border)]  pt-4">
                        {t(`${key}A` as Parameters<typeof t>[0])}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
