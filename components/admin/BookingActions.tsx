'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, XCircle, AlertCircle, Loader2 } from 'lucide-react';

type Action = 'complete' | 'cancel' | 'no_show';

interface Props {
  bookingId: string;
  currentStatus?: string;
}

const LABELS: Record<Action, { label: string; icon: React.ReactNode; color: string }> = {
  complete: {
    label: 'Abgeschlossen',
    icon: <CheckCircle2 size={13} />,
    color: 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200',
  },
  cancel: {
    label: 'Absagen',
    icon: <XCircle size={13} />,
    color: 'bg-red-50 text-red-700 hover:bg-red-100 border-red-200',
  },
  no_show: {
    label: 'Nicht erschienen',
    icon: <AlertCircle size={13} />,
    color: 'bg-orange-50 text-orange-700 hover:bg-orange-100 border-orange-200',
  },
};

export function BookingActions({ bookingId, currentStatus }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [active, setActive] = useState<Action | null>(null);

  if (currentStatus && currentStatus !== 'pending') return null;

  async function handleAction(action: Action) {
    setActive(action);
    try {
      const res = await fetch('/api/admin/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: bookingId, action }),
      });
      if (!res.ok) throw new Error('Fehler');
      startTransition(() => router.refresh());
    } catch {
      alert('Fehler bei der Aktion. Bitte neu laden.');
    } finally {
      setActive(null);
    }
  }

  return (
    <div className="flex gap-1 flex-wrap">
      {(Object.entries(LABELS) as [Action, (typeof LABELS)[Action]][]).map(([action, cfg]) => (
        <button
          key={action}
          onClick={() => handleAction(action)}
          disabled={pending || active !== null}
          className={`inline-flex items-center gap-1 px-2 py-1 rounded-md border text-[11px] font-medium transition-colors disabled:opacity-50 ${cfg.color}`}
        >
          {active === action && pending ? <Loader2 size={11} className="animate-spin" /> : cfg.icon}
          {cfg.label}
        </button>
      ))}
    </div>
  );
}
