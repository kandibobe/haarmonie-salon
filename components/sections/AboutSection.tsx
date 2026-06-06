'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { CheckCircle2, Award, Users, Sparkles } from 'lucide-react';
import { SectionBadge } from '@components/ui/SectionBadge';
import { salonConfig } from '@lib/config';

const featureIcons = [CheckCircle2, Users, Award] as const;

export function AboutSection() {
  const t = useTranslations('about');

  const features = [
    { icon: featureIcons[0], title: t('feature1Title'), desc: t('feature1Desc') },
    { icon: featureIcons[1], title: t('feature2Title'), desc: t('feature2Desc') },
    { icon: featureIcons[2], title: t('feature3Title'), desc: t('feature3Desc') },
  ];

  return (
    <section id="about" className="section-padding bg-[var(--color-bg-alt)]">
      <div className="container-narrow">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Left: Image */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="relative h-[420px] lg:h-[500px] rounded-3xl overflow-hidden shadow-2xl shadow-[var(--color-slate)]/20">
              <Image
                src="https://images.unsplash.com/photo-1600948836101-f9ffda59d250?w=800&q=85"
                alt={t('imageAlt')}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-slate)]/40 via-transparent to-transparent" />
            </div>

            {/* Badge: Meisterbetrieb seit 2013 */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="absolute -bottom-5 -right-4 md:right-4 bg-white rounded-2xl px-5 py-3 shadow-xl border border-[var(--color-border)] flex items-center gap-3"
            >
              <div className="w-9 h-9 rounded-xl bg-[var(--color-blue)]/10 flex items-center justify-center shrink-0">
                <Award size={18} className="text-[var(--color-blue-glow)]" />
              </div>
              <div>
                <div className="text-xs font-bold text-[var(--color-text)] leading-tight">
                  {t('badgeExperience')}
                </div>
                <div className="text-[10px] text-[var(--color-muted)]">
                  {salonConfig.highlights[0]}
                </div>
              </div>
            </motion.div>

            {/* Badge: Bio */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.55 }}
              className="absolute -top-4 -left-4 md:left-4 bg-[var(--color-slate)] text-white rounded-2xl px-4 py-3 shadow-xl flex items-center gap-2"
            >
              <Sparkles size={15} className="text-[var(--color-yellow)]" />
              <span className="text-xs font-bold">{t('badgeCert')}</span>
            </motion.div>
          </motion.div>

          {/* Right: Text */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="space-y-6"
          >
            <SectionBadge>{t('badge')}</SectionBadge>

            <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-text)] leading-tight">
              {t('title')}
            </h2>

            <p className="text-[var(--color-muted)] text-base leading-relaxed">
              {t('description')}
            </p>

            {/* Feature list */}
            <div className="space-y-4 pt-2">
              {features.map(({ icon: Icon, title, desc }, idx) => (
                <div
                  key={title}
                  className="flex gap-4 border-l-2 border-[var(--color-blue-light)]/60 pl-4 py-1"
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                      idx === 0
                        ? 'bg-[var(--color-yellow)]/15'
                        : 'bg-[var(--color-blue)]/10'
                    }`}
                  >
                    <Icon
                      size={18}
                      className={
                        idx === 0
                          ? 'text-[var(--color-yellow-dark)]'
                          : 'text-[var(--color-blue-glow)]'
                      }
                    />
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-[var(--color-text)] mb-0.5">{title}</div>
                    <div className="text-sm text-[var(--color-muted)] leading-relaxed">{desc}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pull-quote */}
            <blockquote className="relative border-l-0 pl-0 mt-4">
              <p className="font-heading-italic text-lg text-[var(--color-blue-glow)] leading-snug">
                „Seit 2013 — über 3.000 glückliche Kunden in Gelsenkirchen."
              </p>
            </blockquote>

            {/* Highlights */}
            <div className="flex flex-wrap gap-2 pt-2">
              {salonConfig.highlights.map((item) => (
                <span
                  key={item}
                  className="text-xs font-semibold bg-[var(--color-blue)]/8 text-[var(--color-blue-glow)] border border-[var(--color-blue)]/20 rounded-full px-3 py-1"
                >
                  {item}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
