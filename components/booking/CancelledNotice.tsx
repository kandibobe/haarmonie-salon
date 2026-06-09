'use client';

import { useEffect } from 'react';
import { toast } from 'sonner';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';

export function CancelledNotice() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const cancelled = searchParams.get('cancelled');

  useEffect(() => {
    if (!cancelled) return;

    if (cancelled === '1') {
      toast.success('Ihr Termin wurde erfolgreich storniert.');
    } else if (cancelled === 'already') {
      toast.info('Dieser Termin wurde bereits storniert.');
    } else {
      toast.error('Der Stornierungslink ist ungültig oder abgelaufen.');
    }

    // Remove query param from URL without page reload
    const params = new URLSearchParams(searchParams.toString());
    params.delete('cancelled');
    const newUrl = params.size > 0 ? `${pathname}?${params}` : pathname;
    router.replace(newUrl, { scroll: false });
  }, [cancelled]); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
}
