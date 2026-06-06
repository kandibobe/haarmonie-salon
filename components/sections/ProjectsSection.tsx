'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { X, ZoomIn, ArrowRight } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { SectionBadge } from '@components/ui/SectionBadge';
import { projects } from '@lib/config';

export function ProjectsSection({
  showHeader = true,
  teaser = false,
}: {
  showHeader?: boolean;
  teaser?: boolean;
} = {}) {
  const t = useTranslations('projects');
  const tg = useTranslations('gallery');
  const [lightbox, setLightbox] = useState<(typeof projects)[number] | null>(null);

  return (
    <section id="projects" className="section-padding bg-[var(--color-bg)]">
      <div className="container-narrow">
        {/* Header */}
        {showHeader && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <SectionBadge>{t('badge')}</SectionBadge>
            <h2 className="text-3xl md:text-5xl font-extrabold text-[var(--color-text)] mt-4 mb-3 tracking-tight">
              {t('title')}
            </h2>
            <p className="text-[var(--color-muted)] text-base md:text-lg max-w-2xl mx-auto">
              {t('subtitle')}
            </p>
          </motion.div>
        )}

        {/* Masonry grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[180px] gap-3">
          {projects.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              className={`relative group rounded-2xl overflow-hidden cursor-pointer ${project.span}`}
              onClick={() => setLightbox(project)}
            >
              <Image
                src={project.url}
                alt={project.alt}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-slate)]/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              {/* Zoom icon */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <ZoomIn size={18} className="text-white" />
                </div>
              </div>
              {/* Caption */}
              <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <p className="text-xs text-white/90 font-medium leading-snug">{project.caption}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Teaser-CTA (nur auf der Startseite) */}
        {teaser && (
          <div className="mt-10 text-center">
            <Link
              href="/galerie"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[var(--color-slate)] hover:bg-[var(--color-slate-light)] text-white text-sm font-semibold transition-colors"
            >
              {tg('teaserCta')}
              <ArrowRight size={16} />
            </Link>
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] bg-black/90 flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative max-w-3xl w-full max-h-[85vh] rounded-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative aspect-video">
                <Image
                  src={lightbox.url}
                  alt={lightbox.alt}
                  fill
                  className="object-cover"
                  sizes="100vw"
                />
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 p-5">
                <p className="text-sm text-white/90 font-medium">{lightbox.caption}</p>
              </div>
              <button
                onClick={() => setLightbox(null)}
                className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                aria-label="Schließen"
              >
                <X size={18} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
