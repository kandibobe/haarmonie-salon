'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Award } from 'lucide-react';
import { team } from '@lib/config';

export function TeamGrid() {
  const t = useTranslations('team');

  return (
    <section className="section-padding bg-[var(--color-bg)]">
      <div className="container-narrow">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((member, i) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="group bg-white rounded-2xl overflow-hidden border border-[var(--color-border)] hover:shadow-xl hover:shadow-[var(--color-blue)]/8 transition-all duration-300"
            >
              {/* Photo */}
              <div className="relative aspect-[4/5] overflow-hidden">
                <Image
                  src={member.photo}
                  alt={member.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-slate)]/60 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 right-3">
                  <h3 className="text-lg font-bold text-white tracking-tight">{member.name}</h3>
                  <p className="text-xs text-[var(--color-yellow)] font-semibold">
                    {t(member.roleKey)}
                  </p>
                </div>
              </div>

              {/* Info */}
              <div className="p-5 space-y-3">
                <p className="flex items-center gap-1.5 text-xs font-semibold text-[var(--color-muted)]">
                  <Award size={13} className="text-[var(--color-blue-glow)]" />
                  {t('experienceLabel', { years: member.experience })}
                </p>
                <p className="text-sm text-[var(--color-muted)] leading-relaxed">
                  {t(member.bioKey)}
                </p>
                <div>
                  <p className="text-[10px] font-semibold text-[var(--color-muted)] uppercase tracking-wider mb-1.5">
                    {t('specialtiesLabel')}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {member.specialtyKeys.map((key) => (
                      <span
                        key={key}
                        className="text-[10px] font-semibold text-[var(--color-blue-glow)] bg-[var(--color-blue)]/8 rounded px-2 py-0.5"
                      >
                        {t(key)}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
