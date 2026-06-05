import { ReactNode } from 'react';
import { cn } from '@lib/utils';

export function SectionBadge({
  children,
  className,
  dark = false,
}: {
  children: ReactNode;
  className?: string;
  dark?: boolean;
}) {
  return (
    <span
      className={cn(
        'inline-block text-xs font-semibold tracking-[0.25em] uppercase rounded-full px-4 py-1.5',
        dark
          ? 'bg-white/10 text-[var(--color-yellow)]'
          : 'bg-[var(--color-blue)]/10 text-[var(--color-blue-glow)]',
        className
      )}
    >
      {children}
    </span>
  );
}
