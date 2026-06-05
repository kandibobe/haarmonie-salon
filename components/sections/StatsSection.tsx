'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion, useInView } from 'framer-motion';
import { Users, Clock, Scissors, Star } from 'lucide-react';
import { stats } from '@lib/config';

const iconMap = {
  Users,
  Clock,
  Scissors,
  Star,
} as const;

function useCounter(target: number, duration = 1400, active: boolean) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!active) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration, active]);

  return count;
}

function StatCard({
  stat,
  delay,
  active,
}: {
  stat: (typeof stats)[number];
  delay: number;
  active: boolean;
}) {
  const t = useTranslations('stats');
  const Icon = iconMap[stat.icon as keyof typeof iconMap];

  // Extract numeric portion for animation
  const numericMatch = stat.value.match(/(\d+)/);
  const numericValue = numericMatch ? parseInt(numericMatch[1]) : 0;
  const suffix = stat.value.replace(/\d+/, '');
  const count = useCounter(numericValue, 1400, active);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={active ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
      className="flex flex-col items-center text-center"
    >
      <div className="w-12 h-12 rounded-xl bg-[var(--color-yellow)]/15 flex items-center justify-center mb-4">
        <Icon size={22} className="text-[var(--color-yellow)]" />
      </div>
      <div className="text-4xl font-extrabold text-white tracking-tight mb-1">
        {numericValue > 0 ? `${count}${suffix}` : stat.value}
      </div>
      <div className="text-sm text-white/55 font-medium">{t(stat.labelKey)}</div>
    </motion.div>
  );
}

export function StatsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="stats" ref={ref} className="py-20 bg-[var(--color-slate)]">
      <div className="container-narrow">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-6">
          {stats.map((stat, i) => (
            <StatCard key={stat.icon} stat={stat} delay={i * 0.12} active={isInView} />
          ))}
        </div>
      </div>
    </section>
  );
}
