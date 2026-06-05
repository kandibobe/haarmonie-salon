'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, X } from 'lucide-react';
import { salonConfig } from '@lib/config';

export function FloatingCallButton() {
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="fixed bottom-24 right-4 z-[100] md:hidden flex flex-col items-end gap-2"
        >
          {/* Dismiss button */}
          <button
            onClick={() => setVisible(false)}
            className="w-6 h-6 rounded-full bg-[var(--color-slate-light)]/80 flex items-center justify-center text-white/50 hover:text-white transition-colors"
            aria-label="Schließen"
          >
            <X size={12} />
          </button>

          {/* Main CTA */}
          <motion.a
            href={salonConfig.phoneHref}
            animate={expanded ? {} : { scale: [1, 1.06, 1] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
            onTouchStart={() => setExpanded(true)}
            className="flex items-center gap-3 bg-[var(--color-blue)] text-white rounded-full shadow-xl shadow-[var(--color-blue)]/40 px-5 py-3.5 font-semibold text-sm"
            aria-label={`Jetzt anrufen: ${salonConfig.phone}`}
          >
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0">
              <Phone size={16} fill="white" />
            </div>
            <div className="text-left">
              <div className="text-[10px] text-white/70 leading-none mb-0.5">Jetzt anrufen</div>
              <div className="font-bold leading-none">{salonConfig.phone}</div>
            </div>
          </motion.a>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
