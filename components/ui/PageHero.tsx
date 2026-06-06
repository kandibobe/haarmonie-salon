'use client';

import { type ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { SectionBadge } from '@components/ui/SectionBadge';

/**
 * Einheitlicher Seitenkopf für Unterseiten: dunkler Banner mit Breadcrumb,
 * Badge, Titel und optionalem Untertitel. Liegt unter dem fixierten Header.
 */
export function PageHero({
  badge,
  title,
  subtitle,
  breadcrumb,
}: {
  badge: string;
  title: string;
  subtitle?: ReactNode;
  breadcrumb: string;
}) {
  const tNav = useTranslations('nav');

  return (
    <section className="relative bg-[var(--color-slate)] pt-28 md:pt-36 pb-14 md:pb-20 overflow-hidden">
      {/* dezenter Verlauf */}
      <div className="absolute inset-0 gradient-dark opacity-90" />
      <div
        className="absolute -top-24 -right-24 w-80 h-80 rounded-full blur-3xl opacity-20"
        style={{ background: 'var(--color-blue)' }}
      />

      <div className="container-narrow relative">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-1.5 text-xs text-white/45 mb-6"
        >
          <Link href="/" className="hover:text-[var(--color-yellow)] transition-colors">
            {tNav('home')}
          </Link>
          <ChevronRight size={12} />
          <span className="text-white/70 font-medium">{breadcrumb}</span>
        </nav>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <SectionBadge dark>{badge}</SectionBadge>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mt-4 mb-4 tracking-tight text-balance">
            {title}
          </h1>
          {subtitle && (
            <p className="text-white/65 text-base md:text-lg max-w-2xl leading-relaxed">
              {subtitle}
            </p>
          )}
        </motion.div>
      </div>
    </section>
  );
}
