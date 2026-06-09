'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { BellRing, CheckCircle2, Loader2 } from 'lucide-react';
import { cn } from '@lib/utils';

const schema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email().max(150),
});
type FormData = z.infer<typeof schema>;

interface Props {
  date: string;
  serviceId?: string;
}

export function WaitlistCapture({ date, serviceId }: Props) {
  const [done, setDone] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    await fetch('/api/waitlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, date, service: serviceId ?? '' }),
    }).catch(() => null);
    setDone(true);
  };

  const inputClass = cn(
    'w-full bg-white border border-[var(--color-border)] rounded-xl px-4 py-2.5',
    'text-[var(--color-text)] text-sm placeholder:text-[var(--color-muted)]/60',
    'focus:outline-none focus:border-[var(--color-blue)] focus:ring-1 focus:ring-[var(--color-blue)]/30 transition-all'
  );

  if (done) {
    return (
      <div className="flex items-center gap-2 py-4 text-sm text-emerald-700">
        <CheckCircle2 size={16} className="shrink-0" />
        Wir melden uns, sobald ein Termin frei wird!
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-[var(--color-yellow)]/30 bg-[var(--color-yellow)]/5 p-4">
      <div className="flex items-center gap-2 mb-3">
        <BellRing size={15} className="text-[var(--color-yellow-dark)] shrink-0" />
        <p className="text-sm font-semibold text-[var(--color-text)]">
          Kein freier Termin? Auf die Warteliste!
        </p>
      </div>
      <p className="text-xs text-[var(--color-muted)] mb-3">
        Wir benachrichtigen Sie, wenn ein Termin frei wird.
      </p>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
        <input {...register('name')} placeholder="Ihr Name" className={cn(inputClass, errors.name && 'border-red-400')} />
        <input {...register('email')} type="email" placeholder="Ihre E-Mail" className={cn(inputClass, errors.email && 'border-red-400')} />
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2.5 rounded-xl bg-[var(--color-yellow-dark)] hover:bg-[var(--color-yellow)] text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : <BellRing size={14} />}
          Auf Warteliste setzen
        </button>
      </form>
    </div>
  );
}
