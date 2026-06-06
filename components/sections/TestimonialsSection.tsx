'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { SectionBadge } from '@components/ui/SectionBadge';
import { InitialAvatar } from '@components/ui/InitialAvatar';
import { testimonials, salonConfig } from '@lib/config';

function Stars({ count = 5 }: { count?: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} size={13} className="text-[var(--color-yellow)] fill-[var(--color-yellow)]" />
      ))}
    </div>
  );
}

export function TestimonialsSection() {
  const t = useTranslations('testimonials');

  const [featured, ...rest] = testimonials;

  return (
    <section className="section-padding bg-[var(--color-slate)] overflow-hidden">
      <div className="container-narrow">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <SectionBadge dark>{t('badge')}</SectionBadge>
          <h2 className="text-3xl md:text-5xl font-bold text-white mt-4 mb-3">
            {t('title')}
          </h2>
          <p className="text-white/50 text-base md:text-lg max-w-2xl mx-auto">
            {t('subtitle')}
          </p>

          {/* Google aggregate pill */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 inline-flex items-center gap-2 bg-white/8 border border-white/15 rounded-full px-4 py-2"
          >
            <Stars />
            <span className="text-sm font-bold text-white">
              {salonConfig.aggregateRating.ratingValue}
            </span>
            <span className="text-white/40 text-xs">·</span>
            <span className="text-xs text-white/55">
              {salonConfig.aggregateRating.reviewCount} Bewertungen · Google
            </span>
          </motion.div>
        </motion.div>

        {/* Featured testimonial */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative mb-8 bg-white/6 border border-white/10 rounded-3xl px-8 py-10 md:px-14 md:py-12 overflow-hidden"
        >
          {/* Large decorative quote watermark */}
          <div
            aria-hidden
            className="absolute -top-6 -left-2 text-[160px] leading-none font-serif text-white/[0.04] select-none pointer-events-none"
          >
            &ldquo;
          </div>

          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <Stars />
            <p className="mt-5 font-heading-italic text-2xl md:text-3xl text-white/90 leading-snug">
              &ldquo;{featured.text}&rdquo;
            </p>
            <div className="mt-6 flex items-center justify-center gap-3">
              <InitialAvatar name={featured.name} size={44} />
              <div className="text-left">
                <div className="text-sm font-bold text-white">{featured.name}</div>
                <div className="text-xs text-white/45">{featured.location}</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Supporting testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {rest.map((review, i) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-white/6 border border-white/10 rounded-2xl p-6"
            >
              <Stars count={review.rating} />
              <p className="mt-3 text-sm text-white/70 leading-relaxed">
                &ldquo;{review.text}&rdquo;
              </p>
              <div className="mt-4 flex items-center gap-3">
                <InitialAvatar name={review.name} size={36} />
                <div>
                  <div className="text-sm font-bold text-white">{review.name}</div>
                  <div className="text-xs text-white/40">{review.location}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
