'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { ChevronDown, CalendarCheck, Sparkles, Award, Star, Tag } from 'lucide-react';
import { salonConfig } from '@lib/config';

export function HeroSection() {
  const t = useTranslations('hero');

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=1920&q=85"
          alt="Friseursalon"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#2a2228]/75 via-[#2a2228]/60 to-[#2a2228]/92" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#9e5e6e]/25 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#c9a36a]/8 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[400px] bg-[radial-gradient(ellipse_at_bottom_left,_#9e5e6e22_0%,_transparent_70%)]" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-white px-6 max-w-5xl mx-auto">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-5 flex items-center justify-center gap-3"
        >
          <span className="h-px w-10 bg-[var(--color-yellow)]/60" />
          <span className="text-xs font-semibold tracking-[0.35em] uppercase text-[var(--color-yellow)]">
            {t('eyebrow')}
          </span>
          <span className="h-px w-10 bg-[var(--color-yellow)]/60" />
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 36 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-6 leading-[1.1]"
          style={{ textShadow: '0 4px 32px rgba(0,0,0,0.5)' }}
        >
          {t('headline')}
        </motion.h1>

        {/* Separator */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="mx-auto mb-6 h-px w-24 bg-gradient-to-r from-transparent via-[var(--color-yellow)] to-transparent"
        />

        {/* Subline */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="text-base md:text-lg text-white/75 mb-10 max-w-2xl mx-auto leading-relaxed"
        >
          {t('subline')}
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.15 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <button
            type="button"
            onClick={() => scrollTo('booking')}
            className="group px-9 py-4 rounded-full bg-[var(--color-blue)] hover:bg-[var(--color-blue-light)] text-white font-semibold text-base transition-all duration-300 hover:scale-105 shadow-xl shadow-[var(--color-blue)]/40 flex items-center justify-center gap-2"
          >
            <CalendarCheck size={16} />
            {t('cta')}
            <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </button>
          <button
            type="button"
            onClick={() => scrollTo('services')}
            className="px-9 py-4 rounded-full border border-white/40 hover:border-[var(--color-yellow)] text-white hover:text-[var(--color-yellow)] font-semibold text-base transition-all duration-300 backdrop-blur-sm hover:bg-white/5"
          >
            {t('ctaServices')}
          </button>
        </motion.div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.4 }}
          className="mt-14 flex flex-wrap justify-center gap-4"
        >
          {[
            { icon: CalendarCheck, label: t('badge1') },
            { icon: Award, label: t('badge2') },
            { icon: Sparkles, label: t('badge3') },
            ...(salonConfig.promo?.enabled
              ? [{ icon: Tag, label: salonConfig.promo.badge }]
              : []),
          ].map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/15 rounded-full px-4 py-2"
            >
              <Icon size={13} className="text-[var(--color-yellow)]" />
              <span className="text-xs font-semibold text-white/90">{label}</span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Floating rating card */}
      <motion.div
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, delay: 1.8 }}
        className="absolute bottom-24 right-6 md:right-12 z-10 bg-white/12 backdrop-blur-md border border-white/20 rounded-2xl px-4 py-3 shadow-2xl hidden sm:flex flex-col items-start gap-1.5"
      >
        <div className="flex items-center gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} size={11} className="text-[var(--color-yellow)] fill-[var(--color-yellow)]" />
          ))}
        </div>
        <div className="text-white font-bold text-base leading-none">
          {salonConfig.aggregateRating.ratingValue}
          <span className="text-white/55 font-normal text-xs ml-1">/ 5</span>
        </div>
        <div className="text-white/55 text-[10px] leading-tight">
          {salonConfig.aggregateRating.reviewCount} Bewertungen · Google
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
        onClick={() => scrollTo('stats')}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-white/50 hover:text-white/80 transition-colors z-10"
        aria-label="Scroll down"
      >
        <span className="text-[10px] tracking-[0.2em] uppercase font-medium">Scroll</span>
        <motion.div
          animate={{ y: [0, 7, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
        >
          <ChevronDown size={20} />
        </motion.div>
      </motion.button>
    </section>
  );
}
