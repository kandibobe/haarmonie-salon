'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { SectionBadge } from '@components/ui/SectionBadge';
import { MapEmbed } from '@components/features/consent/MapEmbed';
import { salonConfig } from '@lib/config';

export function ContactSection({ showHeader = true }: { showHeader?: boolean } = {}) {
  const t = useTranslations('contact');

  const cards = [
    {
      icon: MapPin,
      label: t('address'),
      value: salonConfig.addressDisplay,
      note: '(fiktiv)',
      href: undefined,
    },
    {
      icon: Phone,
      label: t('phone'),
      value: salonConfig.phone,
      note: '(fiktiv)',
      href: salonConfig.phoneHref,
    },
    {
      icon: Mail,
      label: t('email'),
      value: salonConfig.email,
      note: undefined,
      href: `mailto:${salonConfig.email}`,
    },
    {
      icon: Clock,
      label: t('hours'),
      value: `${salonConfig.openingHours.weekdays} · ${salonConfig.openingHours.saturday}`,
      note: salonConfig.openingHours.closed,
      href: undefined,
    },
  ];

  return (
    <section id="contact" className="section-padding bg-[var(--color-bg)]">
      <div className="container-narrow">
        {/* Header */}
        {showHeader && (
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
            <p className="text-[var(--color-muted)] text-base md:text-lg max-w-xl mx-auto">
              {t('subtitle')}
            </p>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Info cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {cards.map(({ icon: Icon, label, value, note, href }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="bg-white rounded-2xl p-5 border border-[var(--color-border)] shadow-sm"
              >
                <div className="w-10 h-10 rounded-xl bg-[var(--color-blue)]/10 flex items-center justify-center mb-3">
                  <Icon size={18} className="text-[var(--color-blue-glow)]" />
                </div>
                <div className="text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wider mb-1">
                  {label}
                </div>
                {href ? (
                  <a
                    href={href}
                    className="text-sm font-semibold text-[var(--color-text)] hover:text-[var(--color-blue-glow)] transition-colors break-all"
                  >
                    {value}
                  </a>
                ) : (
                  <p className="text-sm font-semibold text-[var(--color-text)]">{value}</p>
                )}
                {note && (
                  <p className="text-xs text-[var(--color-muted)] mt-0.5">
                    {note.startsWith('(') ? (
                      <span className="opacity-50">{note}</span>
                    ) : (
                      <span className="text-[var(--color-blue-glow)] font-medium">{note}</span>
                    )}
                  </p>
                )}
              </motion.div>
            ))}
          </div>

          {/* Map */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="rounded-2xl overflow-hidden border border-[var(--color-border)] shadow-sm h-[320px] lg:h-auto min-h-[320px]"
          >
            <MapEmbed title={t('mapTitle')} className="w-full h-full min-h-[320px]" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
