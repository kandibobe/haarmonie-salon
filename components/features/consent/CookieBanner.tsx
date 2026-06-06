'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, X, MapPin, Sparkles, ShieldCheck } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { useConsent, onOpenCookieSettings } from './ConsentProvider';
import { cn } from '@lib/utils';

export function CookieBanner() {
  const t = useTranslations('consent');
  const { consent, ready, decided, acceptAll, necessaryOnly, save } = useConsent();
  const [showSettings, setShowSettings] = useState(false);
  const [maps, setMaps] = useState(false);
  const [ai, setAi] = useState(false);

  // Footer-Link „Cookie-Einstellungen" öffnet den Detaildialog.
  useEffect(() => {
    return onOpenCookieSettings(() => {
      setMaps(consent?.maps ?? false);
      setAi(consent?.ai ?? false);
      setShowSettings(true);
    });
  }, [consent]);

  const openSettings = () => {
    setMaps(consent?.maps ?? false);
    setAi(consent?.ai ?? false);
    setShowSettings(true);
  };

  const handleSave = () => {
    save({ maps, ai });
    setShowSettings(false);
  };

  // Banner nur zeigen, wenn noch keine Entscheidung getroffen wurde.
  const showBanner = ready && !decided && !showSettings;

  return (
    <>
      <AnimatePresence>
        {showBanner && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ type: 'spring', damping: 26, stiffness: 280 }}
            className="fixed bottom-4 left-4 right-4 md:left-6 md:right-auto md:max-w-md z-[150] rounded-2xl bg-white shadow-2xl border border-[var(--color-border)] p-5"
            role="dialog"
            aria-label={t('title')}
          >
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-[var(--color-blue)]/10 flex items-center justify-center shrink-0">
                <Cookie size={18} className="text-[var(--color-blue-glow)]" />
              </div>
              <div className="flex-1">
                <h2 className="text-sm font-bold text-[var(--color-text)] mb-1">{t('title')}</h2>
                <p className="text-xs text-[var(--color-muted)] leading-relaxed">
                  {t('description')}
                </p>
              </div>
            </div>
            <div className="mt-4 flex flex-col gap-2">
              <button
                onClick={acceptAll}
                className="w-full py-2.5 rounded-xl bg-[var(--color-blue)] hover:bg-[var(--color-blue-light)] text-white text-sm font-semibold transition-colors"
              >
                {t('acceptAll')}
              </button>
              <div className="flex gap-2">
                <button
                  onClick={necessaryOnly}
                  className="flex-1 py-2.5 rounded-xl border border-[var(--color-border)] text-[var(--color-text)] text-sm font-semibold hover:bg-[var(--color-bg-alt)] transition-colors"
                >
                  {t('necessaryOnly')}
                </button>
                <button
                  onClick={openSettings}
                  className="flex-1 py-2.5 rounded-xl border border-[var(--color-border)] text-[var(--color-text)] text-sm font-semibold hover:bg-[var(--color-bg-alt)] transition-colors"
                >
                  {t('settings')}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Settings modal */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/60 flex items-end sm:items-center justify-center p-0 sm:p-4"
            onClick={() => setShowSettings(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.98 }}
              transition={{ type: 'spring', damping: 28, stiffness: 320 }}
              className="relative w-full sm:max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[88vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white px-6 py-4 border-b border-[var(--color-border)] flex items-center justify-between">
                <h2 className="text-base font-bold text-[var(--color-text)]">{t('title')}</h2>
                <button
                  onClick={() => setShowSettings(false)}
                  className="p-1.5 text-[var(--color-muted)] hover:text-[var(--color-text)] transition-colors"
                  aria-label="Close"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="p-6 space-y-3">
                <p className="text-sm text-[var(--color-muted)] leading-relaxed">
                  {t('description')}
                </p>

                {/* Necessary — always on */}
                <CategoryRow
                  icon={<ShieldCheck size={18} className="text-green-600" />}
                  title={t('necessaryTitle')}
                  desc={t('necessaryDesc')}
                  checked
                  disabled
                  badge={t('alwaysOn')}
                />

                {/* Maps */}
                <CategoryRow
                  icon={<MapPin size={18} className="text-[var(--color-blue-glow)]" />}
                  title={t('mapsTitle')}
                  desc={t('mapsDesc')}
                  checked={maps}
                  onChange={setMaps}
                />

                {/* AI */}
                <CategoryRow
                  icon={<Sparkles size={18} className="text-[var(--color-yellow-dark)]" />}
                  title={t('aiTitle')}
                  desc={t('aiDesc')}
                  checked={ai}
                  onChange={setAi}
                />
              </div>

              <div className="sticky bottom-0 bg-white px-6 py-4 border-t border-[var(--color-border)] flex flex-col sm:flex-row gap-2">
                <button
                  onClick={() => {
                    necessaryOnly();
                    setShowSettings(false);
                  }}
                  className="flex-1 py-2.5 rounded-xl border border-[var(--color-border)] text-[var(--color-text)] text-sm font-semibold hover:bg-[var(--color-bg-alt)] transition-colors"
                >
                  {t('necessaryOnly')}
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 py-2.5 rounded-xl border border-[var(--color-border)] text-[var(--color-text)] text-sm font-semibold hover:bg-[var(--color-bg-alt)] transition-colors"
                >
                  {t('save')}
                </button>
                <button
                  onClick={() => {
                    acceptAll();
                    setShowSettings(false);
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-[var(--color-blue)] hover:bg-[var(--color-blue-light)] text-white text-sm font-semibold transition-colors"
                >
                  {t('acceptAll')}
                </button>
              </div>

              <div className="px-6 pb-5 -mt-1">
                <Link
                  href="/datenschutz"
                  className="text-xs text-[var(--color-muted)] underline hover:text-[var(--color-blue-glow)] transition-colors"
                  onClick={() => setShowSettings(false)}
                >
                  {t('changeSettings')}
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function CategoryRow({
  icon,
  title,
  desc,
  checked,
  onChange,
  disabled,
  badge,
}: {
  icon: ReactNodeIcon;
  title: string;
  desc: string;
  checked: boolean;
  onChange?: (v: boolean) => void;
  disabled?: boolean;
  badge?: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-[var(--color-border)] p-4">
      <div className="w-9 h-9 rounded-lg bg-[var(--color-bg-alt)] flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <h3 className="text-sm font-bold text-[var(--color-text)]">{title}</h3>
          {badge && (
            <span className="text-[10px] font-semibold text-green-700 bg-green-100 rounded px-1.5 py-0.5">
              {badge}
            </span>
          )}
        </div>
        <p className="text-xs text-[var(--color-muted)] leading-relaxed">{desc}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange?.(!checked)}
        className={cn(
          'relative w-11 h-6 rounded-full transition-colors shrink-0 mt-0.5',
          checked ? 'bg-[var(--color-blue)]' : 'bg-[var(--color-border)]',
          disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'
        )}
      >
        <span
          className={cn(
            'absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform',
            checked && 'translate-x-5'
          )}
        />
      </button>
    </div>
  );
}

type ReactNodeIcon = React.ReactNode;
