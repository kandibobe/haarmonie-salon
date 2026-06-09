'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import {
  Scissors,
  User,
  Palette,
  Sparkles,
  Crown,
  Baby,
  Clock,
  CalendarDays,
  CheckCircle2,
  Loader2,
  ChevronLeft,
  ArrowRight,
  Calendar,
  Instagram,
  Tag,
} from 'lucide-react';
import { cn } from '@lib/utils';
import { salonConfig, services, team, type Service } from '@lib/config';
import { WaitlistCapture } from './WaitlistCapture';

const iconMap = { Scissors, User, Palette, Sparkles, Crown, Baby } as const;

const formSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(7),
  consent: z.literal(true),
  // Honeypot — für Menschen unsichtbar, nur Bots füllen es aus.
  company: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

type Step = 1 | 2 | 3 | 'success';

interface Confirmed {
  service: string;
  date: string;
  time: string;
  name: string;
  stylist: string | null;
}

/** Kommende buchbare Tage (pure, basierend auf salonConfig — kein Redis im Client). */
function upcomingDates(limit = 10): string[] {
  const out: string[] = [];
  const today = new Date();
  for (let i = 0; i < salonConfig.bookingDaysAhead && out.length < limit; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    if (salonConfig.bookingHours[d.getDay()]) {
      out.push(
        `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
          d.getDate()
        ).padStart(2, '0')}`
      );
    }
  }
  return out;
}

export function BookingWidget() {
  const t = useTranslations('booking');
  const tServices = useTranslations('services');

  const [step, setStep] = useState<Step>(1);
  const [service, setService] = useState<Service | null>(null);
  const [stylist, setStylist] = useState<string | null>(null);
  const [date, setDate] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [slots, setSlots] = useState<string[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [confirmed, setConfirmed] = useState<Confirmed | null>(null);

  const dates = upcomingDates();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({ resolver: zodResolver(formSchema) });

  const serviceTitle = (s: Service) => tServices(s.titleKey);

  const fmtDate = (d: string, opts: Intl.DateTimeFormatOptions) =>
    new Date(`${d}T00:00:00`).toLocaleDateString('de-DE', opts);

  // Slots laden, wenn ein Datum gewählt wird.
  const loadSlots = useCallback(async (d: string) => {
    setSlotsLoading(true);
    setSlots([]);
    try {
      const res = await fetch(`/api/availability?date=${d}`);
      const json = await res.json();
      setSlots(json.slots ?? []);
    } catch {
      setSlots([]);
    } finally {
      setSlotsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (date) loadSlots(date);
  }, [date, loadSlots]);

  const stylistName = stylist ? (team.find((m) => m.id === stylist)?.name ?? null) : null;

  const onSubmit = async (data: FormData) => {
    if (!service || !date || !time) return;
    try {
      const res = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phone: data.phone,
          service: serviceTitle(service),
          stylist: stylistName ?? '',
          date,
          time,
          consent: data.consent,
          company: data.company ?? '',
        }),
      });

      if (res.status === 409) {
        toast.error(t('slotTaken'));
        setTime(null);
        setStep(2);
        loadSlots(date);
        return;
      }
      if (res.status === 429) {
        toast.error(t('rateLimited'));
        return;
      }
      if (!res.ok) throw new Error();

      setConfirmed({ service: serviceTitle(service), date, time, name: data.name, stylist: stylistName });
      setStep('success');
      reset();
      toast.success(t('successToast'));
    } catch {
      toast.error(t('error'));
    }
  };

  const resetAll = () => {
    setService(null);
    setStylist(null);
    setDate(null);
    setTime(null);
    setSlots([]);
    setConfirmed(null);
    reset();
    setStep(1);
  };

  const whatsappHref = confirmed
    ? `https://wa.me/${salonConfig.whatsappNumber}?text=${encodeURIComponent(
        t('waMessage', {
          salon: salonConfig.name,
          service: confirmed.service,
          date: fmtDate(confirmed.date, { weekday: 'long', day: '2-digit', month: 'long' }),
          time: confirmed.time,
          name: confirmed.name,
        })
      )}`
    : '#';

  const icsHref = confirmed ? buildIcsHref(confirmed) : null;

  const inputClass = cn(
    'w-full bg-white border border-[var(--color-border)] rounded-xl px-4 py-3',
    'text-[var(--color-text)] text-sm placeholder:text-[var(--color-muted)]/60',
    'focus:outline-none focus:border-[var(--color-blue)] focus:ring-1 focus:ring-[var(--color-blue)]/30',
    'transition-all duration-200'
  );

  return (
    <div className="bg-white rounded-3xl border border-[var(--color-border)] shadow-xl shadow-[var(--color-slate)]/5 overflow-hidden">
      {/* Stepper header */}
      {step !== 'success' && (
        <div className="flex items-center gap-2 px-6 md:px-8 pt-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="flex-1 flex items-center gap-2">
              <div
                className={cn(
                  'h-1.5 flex-1 rounded-full transition-colors duration-300',
                  (step as number) >= n ? 'bg-[var(--color-blue)]' : 'bg-[var(--color-border)]'
                )}
              />
            </div>
          ))}
        </div>
      )}

      <div className="p-6 md:p-8">
        <AnimatePresence mode="wait">
          {/* STEP 1 — Service */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-blue-glow)] mb-1">
                {t('step1Label')}
              </p>
              <h3 className="text-xl font-bold text-[var(--color-text)] mb-5">{t('step1Title')}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {services.map((s) => {
                  const Icon = iconMap[s.icon as keyof typeof iconMap];
                  const active = service?.id === s.id;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => {
                        setService(s);
                        setStep(2);
                      }}
                      className={cn(
                        'group flex items-center gap-3 text-left rounded-2xl border p-4 transition-all duration-200',
                        active
                          ? 'border-[var(--color-blue)] bg-[var(--color-blue)]/5'
                          : 'border-[var(--color-border)] hover:border-[var(--color-blue-light)] hover:bg-[var(--color-bg-alt)]'
                      )}
                    >
                      <div className="w-11 h-11 rounded-xl bg-[var(--color-blue)]/10 flex items-center justify-center shrink-0">
                        <Icon size={20} className="text-[var(--color-blue-glow)]" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-semibold text-sm text-[var(--color-text)] truncate">
                          {serviceTitle(s)}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-[var(--color-muted)] mt-0.5">
                          <span className="font-semibold text-[var(--color-blue-glow)]">
                            {s.price}
                          </span>
                          <span>·</span>
                          <span className="inline-flex items-center gap-1">
                            <Clock size={11} /> {t('durationShort', { min: s.duration })}
                          </span>
                        </div>
                      </div>
                      <ArrowRight
                        size={16}
                        className="text-[var(--color-muted)]/40 group-hover:text-[var(--color-blue)] transition-colors shrink-0"
                      />
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* STEP 2 — Date & time */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
            >
              <button
                type="button"
                onClick={() => setStep(1)}
                className="inline-flex items-center gap-1 text-xs text-[var(--color-muted)] hover:text-[var(--color-blue)] transition-colors mb-3"
              >
                <ChevronLeft size={14} /> {t('back')}
              </button>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-blue-glow)] mb-1">
                {t('step2Label')}
              </p>
              <h3 className="text-xl font-bold text-[var(--color-text)] mb-1">{t('step2Title')}</h3>
              {service && (
                <p className="text-sm text-[var(--color-muted)] mb-5">
                  {serviceTitle(service)} · {service.price}
                </p>
              )}

              {/* Date chips */}
              <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 mb-5">
                {dates.map((d) => {
                  const active = date === d;
                  return (
                    <button
                      key={d}
                      type="button"
                      onClick={() => {
                        setDate(d);
                        setTime(null);
                      }}
                      className={cn(
                        'shrink-0 w-16 rounded-xl border py-2.5 flex flex-col items-center transition-all duration-200',
                        active
                          ? 'border-[var(--color-blue)] bg-[var(--color-blue)] text-white'
                          : 'border-[var(--color-border)] hover:border-[var(--color-blue-light)] text-[var(--color-text)]'
                      )}
                    >
                      <span
                        className={cn(
                          'text-[10px] uppercase font-semibold',
                          active ? 'text-white/80' : 'text-[var(--color-muted)]'
                        )}
                      >
                        {fmtDate(d, { weekday: 'short' })}
                      </span>
                      <span className="text-lg font-bold leading-tight">
                        {fmtDate(d, { day: '2-digit' })}
                      </span>
                      <span
                        className={cn(
                          'text-[10px]',
                          active ? 'text-white/80' : 'text-[var(--color-muted)]'
                        )}
                      >
                        {fmtDate(d, { month: 'short' })}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Time slots */}
              {!date ? (
                <p className="text-sm text-[var(--color-muted)] flex items-center gap-2">
                  <CalendarDays size={15} /> {t('pickDate')}
                </p>
              ) : slotsLoading ? (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="h-10 rounded-lg bg-[var(--color-border)] animate-pulse" />
                  ))}
                </div>
              ) : slots.length === 0 ? (
                <WaitlistCapture date={date} serviceId={service?.id} />
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {slots.map((s) => {
                    const active = time === s;
                    return (
                      <button
                        key={s}
                        type="button"
                        onClick={() => {
                          setTime(s);
                          setStep(3);
                        }}
                        className={cn(
                          'rounded-lg border py-2.5 text-sm font-semibold transition-all duration-200',
                          active
                            ? 'border-[var(--color-blue)] bg-[var(--color-blue)] text-white'
                            : 'border-[var(--color-border)] hover:border-[var(--color-blue)] text-[var(--color-text)]'
                        )}
                      >
                        {s}
                      </button>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}

          {/* STEP 3 — Details */}
          {step === 3 && (
            <motion.form
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              onSubmit={handleSubmit(onSubmit)}
            >
              {/* Honeypot: visuell + für Screenreader versteckt */}
              <input
                {...register('company')}
                type="text"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="absolute left-[-9999px] h-0 w-0 opacity-0"
              />
              <button
                type="button"
                onClick={() => setStep(2)}
                className="inline-flex items-center gap-1 text-xs text-[var(--color-muted)] hover:text-[var(--color-blue)] transition-colors mb-3"
              >
                <ChevronLeft size={14} /> {t('back')}
              </button>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-blue-glow)] mb-1">
                {t('step3Label')}
              </p>
              <h3 className="text-xl font-bold text-[var(--color-text)] mb-4">{t('step3Title')}</h3>

              {/* Summary */}
              {service && date && time && (
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm bg-[var(--color-bg-alt)] rounded-xl px-4 py-3 mb-5">
                  <span className="font-semibold text-[var(--color-text)]">
                    {serviceTitle(service)}
                  </span>
                  <span className="text-[var(--color-muted)]">·</span>
                  <span className="text-[var(--color-text)]">
                    {fmtDate(date, { weekday: 'long', day: '2-digit', month: 'long' })}
                  </span>
                  <span className="text-[var(--color-muted)]">·</span>
                  <span className="font-semibold text-[var(--color-blue-glow)]">{time} Uhr</span>
                </div>
              )}

              {/* Wunsch-Stylist (optional) */}
              <div className="mb-5">
                <p className="text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wider mb-2">
                  {t('stylistLabel')}
                </p>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setStylist(null)}
                    className={cn(
                      'px-3.5 py-2 rounded-xl border text-xs font-semibold transition-colors',
                      stylist === null
                        ? 'border-[var(--color-blue)] bg-[var(--color-blue)] text-white'
                        : 'border-[var(--color-border)] hover:border-[var(--color-blue-light)] text-[var(--color-text)]'
                    )}
                  >
                    {t('stylistAny')}
                  </button>
                  {team.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setStylist(m.id)}
                      className={cn(
                        'px-3.5 py-2 rounded-xl border text-xs font-semibold transition-colors',
                        stylist === m.id
                          ? 'border-[var(--color-blue)] bg-[var(--color-blue)] text-white'
                          : 'border-[var(--color-border)] hover:border-[var(--color-blue-light)] text-[var(--color-text)]'
                      )}
                    >
                      {m.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <input
                    {...register('name')}
                    placeholder={t('namePlaceholder')}
                    className={cn(inputClass, errors.name && 'border-red-400')}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1">{t('nameError')}</p>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <input
                      {...register('email')}
                      type="email"
                      placeholder={t('emailPlaceholder')}
                      className={cn(inputClass, errors.email && 'border-red-400')}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-xs mt-1">{t('emailError')}</p>
                    )}
                  </div>
                  <div>
                    <input
                      {...register('phone')}
                      type="tel"
                      placeholder={t('phonePlaceholder')}
                      className={cn(inputClass, errors.phone && 'border-red-400')}
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-xs mt-1">{t('phoneError')}</p>
                    )}
                  </div>
                </div>

                {/* DSGVO consent */}
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    {...register('consent')}
                    type="checkbox"
                    className="mt-0.5 w-4 h-4 accent-[var(--color-blue)] shrink-0"
                  />
                  <span className="text-xs text-[var(--color-muted)] leading-relaxed">
                    {t('consentBefore')}{' '}
                    <a
                      href="/datenschutz"
                      target="_blank"
                      className="text-[var(--color-blue-glow)] underline"
                    >
                      {t('consentLink')}
                    </a>{' '}
                    {t('consentAfter')}
                  </span>
                </label>
                {errors.consent && (
                  <p className="text-red-500 text-xs">{t('consentError')}</p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-full bg-[var(--color-blue)] hover:bg-[var(--color-blue-light)] disabled:opacity-60 text-white font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] shadow-lg shadow-[var(--color-blue)]/30"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" /> {t('submitting')}
                    </>
                  ) : (
                    t('submit')
                  )}
                </button>
              </div>
            </motion.form>
          )}

          {/* SUCCESS */}
          {step === 'success' && confirmed && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-6"
            >
              <CheckCircle2 size={56} className="text-[var(--color-blue)] mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-[var(--color-text)] mb-2">{t('successTitle')}</h3>
              <p className="text-sm text-[var(--color-muted)] mb-5">{t('successSubtitle')}</p>
              {salonConfig.promo?.enabled && (
                <div className="mb-5 px-4 py-3 rounded-xl bg-[var(--color-yellow)]/10 border border-[var(--color-yellow)]/30 text-sm text-center max-w-sm mx-auto">
                  <Tag size={13} className="inline-block mr-1 text-[var(--color-yellow-dark)]" />
                  <strong className="text-[var(--color-yellow-dark)]">{salonConfig.promo.badge}:</strong>{' '}
                  <span className="text-[var(--color-text)]">{salonConfig.promo.detailText}</span>
                </div>
              )}

              <div className="bg-[var(--color-bg-alt)] rounded-2xl px-5 py-4 text-left max-w-sm mx-auto mb-6 space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--color-muted)]">{t('summaryService')}</span>
                  <span className="font-semibold text-[var(--color-text)]">{confirmed.service}</span>
                </div>
                {confirmed.stylist && (
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--color-muted)]">{t('summaryStylist')}</span>
                    <span className="font-semibold text-[var(--color-text)]">{confirmed.stylist}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--color-muted)]">{t('summaryDate')}</span>
                  <span className="font-semibold text-[var(--color-text)]">
                    {fmtDate(confirmed.date, { weekday: 'long', day: '2-digit', month: 'long' })}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--color-muted)]">{t('summaryTime')}</span>
                  <span className="font-semibold text-[var(--color-blue-glow)]">
                    {confirmed.time} Uhr
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#25D366] hover:bg-[#1ebe5d] text-white font-semibold text-sm transition-colors"
                >
                  <WhatsAppIcon /> {t('confirmWhatsApp')}
                </a>
                {icsHref && (
                  <a
                    href={icsHref}
                    download={`termin-${confirmed?.date}.ics`}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-[var(--color-border)] text-[var(--color-text)] hover:bg-[var(--color-bg-alt)] font-semibold text-sm transition-colors"
                  >
                    <Calendar size={15} /> {t('addToCalendar')}
                  </a>
                )}
                <button
                  type="button"
                  onClick={resetAll}
                  className="inline-flex items-center justify-center px-6 py-3 rounded-full border border-[var(--color-border)] text-[var(--color-text)] hover:bg-[var(--color-bg-alt)] font-semibold text-sm transition-colors"
                >
                  {t('newBooking')}
                </button>
              </div>
              {salonConfig.social.instagram && (
                <div className="mt-5">
                  <a
                    href={salonConfig.social.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-[var(--color-muted)] hover:text-[var(--color-blue-glow)] transition-colors"
                  >
                    <Instagram size={14} /> {t('followInstagram')}
                  </a>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function buildIcsHref(confirmed: Confirmed): string {
  const [y, m, d] = confirmed.date.split('-');
  const [hh, mm] = confirmed.time.split(':');
  const pad = (n: string) => n.padStart(2, '0');
  const start = `${y}${pad(m)}${pad(d)}T${pad(hh)}${pad(mm)}00`;
  // Add ~60 min for the end time
  const endMin = parseInt(hh) * 60 + parseInt(mm) + 60;
  const endHH = Math.floor(endMin / 60).toString();
  const endMM = (endMin % 60).toString();
  const end = `${y}${pad(m)}${pad(d)}T${pad(endHH)}${pad(endMM)}00`;

  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Haarmonie//Termin//DE',
    'BEGIN:VEVENT',
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `SUMMARY:${confirmed.service} bei ${salonConfig.name}`,
    `LOCATION:${salonConfig.addressDisplay}`,
    `DESCRIPTION:Ihr Termin bei ${salonConfig.name}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  return `data:text/calendar;charset=utf8,${encodeURIComponent(ics)}`;
}

function WhatsAppIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38c1.45.79 3.08 1.21 4.79 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm0 18.15h-.01c-1.52 0-3.01-.41-4.3-1.18l-.31-.18-3.12.82.83-3.04-.2-.31a8.23 8.23 0 0 1-1.26-4.36c0-4.54 3.7-8.23 8.24-8.23 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.82c0 4.54-3.69 8.24-8.23 8.24zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.12-.16.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.01-.38.11-.5.11-.11.25-.29.37-.43.13-.14.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.43-.14 0-.31-.01-.48-.01-.17 0-.43.06-.66.31-.23.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.14-1.18-.06-.11-.22-.17-.47-.29z" />
    </svg>
  );
}
