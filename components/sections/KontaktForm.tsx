'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Mail, Check } from 'lucide-react';
import { Link } from '@/i18n/routing';

export function KontaktForm() {
  const t = useTranslations('kontakt');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [consent, setConsent] = useState(false);
  const [company, setCompany] = useState(''); // honeypot
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (name.trim().length < 2) e.name = t('nameError');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = t('emailError');
    if (message.trim().length < 5) e.message = t('messageError');
    if (!consent) e.consent = t('consentError');
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (submitting || !validate()) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message, consent, company }),
      });
      if (res.ok) {
        setDone(true);
      } else {
        setErrors({ form: res.status === 429 ? t('rateLimited') : t('error') });
      }
    } catch {
      setErrors({ form: t('error') });
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-2xl border border-[var(--color-border)] bg-white p-8 text-center"
      >
        <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
          <Check size={26} className="text-green-600" />
        </div>
        <h3 className="text-lg font-bold text-[var(--color-text)] mb-2">{t('successTitle')}</h3>
        <p className="text-sm text-[var(--color-muted)] mb-5">{t('successText')}</p>
        <button
          onClick={() => {
            setDone(false);
            setName('');
            setEmail('');
            setMessage('');
            setConsent(false);
          }}
          className="text-sm font-semibold text-[var(--color-blue-glow)] hover:underline"
        >
          {t('newMessage')}
        </button>
      </motion.div>
    );
  }

  return (
    <form
      onSubmit={submit}
      className="rounded-2xl border border-[var(--color-border)] bg-white p-6 md:p-8 space-y-5"
    >
      <div className="flex items-center gap-2.5">
        <div className="w-10 h-10 rounded-xl bg-[var(--color-blue)]/10 flex items-center justify-center">
          <Mail size={20} className="text-[var(--color-blue-glow)]" />
        </div>
        <h2 className="text-lg font-bold text-[var(--color-text)]">{t('formTitle')}</h2>
      </div>

      <div>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t('namePlaceholder')}
          className="w-full bg-[var(--color-bg-alt)] border border-[var(--color-border)] rounded-xl px-4 py-3 text-sm outline-none focus:border-[var(--color-blue)] transition-colors"
        />
        {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
      </div>

      <div>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t('emailPlaceholder')}
          className="w-full bg-[var(--color-bg-alt)] border border-[var(--color-border)] rounded-xl px-4 py-3 text-sm outline-none focus:border-[var(--color-blue)] transition-colors"
        />
        {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
      </div>

      <div>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={t('messagePlaceholder')}
          rows={5}
          className="w-full bg-[var(--color-bg-alt)] border border-[var(--color-border)] rounded-xl px-4 py-3 text-sm outline-none focus:border-[var(--color-blue)] transition-colors resize-none"
        />
        {errors.message && <p className="text-xs text-red-600 mt-1">{errors.message}</p>}
      </div>

      {/* Honeypot */}
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        value={company}
        onChange={(e) => setCompany(e.target.value)}
        className="hidden"
        aria-hidden="true"
      />

      <label className="flex items-start gap-2.5 cursor-pointer">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-0.5 w-4 h-4 accent-[var(--color-blue)]"
        />
        <span className="text-xs text-[var(--color-muted)] leading-relaxed">
          {t('consentBefore')}{' '}
          <Link href="/datenschutz" className="text-[var(--color-blue-glow)] underline">
            {t('consentLink')}
          </Link>{' '}
          {t('consentAfter')}
        </span>
      </label>
      {errors.consent && <p className="text-xs text-red-600">{errors.consent}</p>}
      {errors.form && <p className="text-xs text-red-600">{errors.form}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="w-full py-3 rounded-xl bg-[var(--color-blue)] hover:bg-[var(--color-blue-light)] text-white text-sm font-semibold transition-colors disabled:opacity-60"
      >
        {submitting ? t('submitting') : t('submit')}
      </button>
    </form>
  );
}
