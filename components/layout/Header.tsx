'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Scissors, Phone } from 'lucide-react';
import { Link, useRouter, usePathname } from '@/i18n/routing';
import { cn } from '@lib/utils';
import { salonConfig, navItems } from '@lib/config';

export function Header() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const toggleLocale = () => {
    const next = locale === 'de' ? 'en' : 'de';
    router.replace(pathname, { locale: next });
  };

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  // CTA → Buchungsbereich der Startseite. Auf der Startseite sanft scrollen,
  // sonst via Router zur Startseite mit Anker navigieren.
  const goToBooking = () => {
    setMobileOpen(false);
    if (pathname === '/') {
      document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      router.push('/#booking');
    }
  };

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled
          ? 'bg-[var(--color-slate)]/95 backdrop-blur-md shadow-lg'
          : 'bg-[var(--color-slate)]/80 backdrop-blur-sm'
      )}
    >
      <nav className="container-narrow flex items-center justify-between h-16 md:h-20">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-[var(--color-blue)] flex items-center justify-center group-hover:bg-[var(--color-blue-light)] transition-colors">
            <Scissors size={16} className="text-[var(--color-yellow)]" />
          </div>
          <span className="font-bold text-lg text-white tracking-tight">
            {salonConfig.shortName}
          </span>
        </Link>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <li key={item.key}>
              <Link
                href={item.href}
                className={cn(
                  'text-sm transition-colors font-medium',
                  isActive(item.href)
                    ? 'text-[var(--color-yellow)]'
                    : 'text-white/75 hover:text-[var(--color-yellow)]'
                )}
              >
                {t(item.key)}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right: phone + lang + CTA */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href={salonConfig.phoneHref}
            className="flex items-center gap-1.5 text-sm text-white/70 hover:text-white transition-colors"
          >
            <Phone size={13} />
            <span>{salonConfig.phone}</span>
          </a>
          <button
            onClick={toggleLocale}
            className="text-xs font-bold text-white/60 hover:text-white border border-white/20 hover:border-white/50 rounded px-2 py-1 transition-all"
          >
            {locale === 'de' ? 'EN' : 'DE'}
          </button>
          <button
            onClick={goToBooking}
            className="flex items-center gap-1.5 px-5 py-2 rounded-full bg-[var(--color-blue)] hover:bg-[var(--color-blue-light)] text-white text-sm font-semibold transition-colors shadow-lg shadow-[var(--color-blue)]/30"
          >
            <Scissors size={13} />
            {t('ctaButton')}
          </button>
        </div>

        {/* Mobile toggle */}
        <div className="flex md:hidden items-center gap-3">
          <button
            onClick={toggleLocale}
            className="text-xs font-bold text-white/60 hover:text-white border border-white/20 rounded px-2 py-1"
          >
            {locale === 'de' ? 'EN' : 'DE'}
          </button>
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="text-white p-1"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-[var(--color-slate)]/98 backdrop-blur-md border-t border-white/10"
          >
            <ul className="container-narrow py-4 flex flex-col gap-1">
              {navItems.map((item) => (
                <li key={item.key}>
                  <Link
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      'block w-full py-3 text-sm font-medium transition-colors',
                      isActive(item.href)
                        ? 'text-[var(--color-yellow)]'
                        : 'text-white/80 hover:text-[var(--color-yellow)]'
                    )}
                  >
                    {t(item.key)}
                  </Link>
                </li>
              ))}
              <li className="pt-2 flex flex-col gap-2">
                <a
                  href={salonConfig.phoneHref}
                  className="flex items-center gap-2 py-3 text-white/70 text-sm"
                  onClick={() => setMobileOpen(false)}
                >
                  <Phone size={14} />
                  {salonConfig.phone}
                </a>
                <button
                  onClick={goToBooking}
                  className="w-full py-3 rounded-full bg-[var(--color-blue)] text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <Scissors size={13} />
                  {t('ctaButton')}
                </button>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
