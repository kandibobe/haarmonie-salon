'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { SectionBadge } from '@components/ui/SectionBadge';
import { InitialAvatar } from '@components/ui/InitialAvatar';
import { testimonials } from '@lib/config';

export function TestimonialsSection() {
  const t = useTranslations('testimonials');

  return (
    <section className="section-padding bg-[var(--color-bg-alt)]">
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

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((review, i) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative bg-white rounded-2xl p-7 border border-[var(--color-border)] shadow-sm overflow-hidden"
            >
              {/* Watermark quote icon */}
              <Quote
                size={64}
                className="absolute top-4 right-4 text-[var(--color-blue)]/6 rotate-180"
              />

              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: review.rating }).map((_, j) => (
                  <Star
                    key={j}
                    size={14}
                    className="text-[var(--color-yellow-dark)] fill-[var(--color-yellow-dark)]"
                  />
                ))}
              </div>

              {/* Text */}
              <p className="text-sm text-[var(--color-muted)] leading-relaxed mb-6 relative z-10">
                &ldquo;{review.text}&rdquo;
              </p>

              {/* Divider */}
              <div className="h-px bg-[var(--color-border)] mb-4" />

              {/* Author */}
              <div className="flex items-center gap-3">
                <InitialAvatar name={review.name} size={40} />
                <div>
                  <div className="text-sm font-bold text-[var(--color-text)]">{review.name}</div>
                  <div className="text-xs text-[var(--color-muted)]">{review.location}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
