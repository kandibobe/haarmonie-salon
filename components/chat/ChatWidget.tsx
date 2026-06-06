'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';
import { cn } from '@lib/utils';
import { useConsent } from '@components/features/consent/ConsentProvider';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function ChatWidget() {
  const t = useTranslations('chat');
  const tc = useTranslations('consent');
  const { consent, save } = useConsent();
  const aiAllowed = consent?.ai ?? false;
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Welcome message on first open (only once AI chat is consented).
  useEffect(() => {
    if (isOpen && aiAllowed && messages.length === 0) {
      setMessages([{ role: 'assistant', content: t('welcome') }]);
    }
  }, [isOpen, aiAllowed, messages.length, t]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const send = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const text = input.trim();
      if (!text || loading) return;

      const history = [...messages, { role: 'user' as const, content: text }];
      setMessages([...history, { role: 'assistant', content: '' }]);
      setInput('');
      setLoading(true);

      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: history }),
        });
        if (!res.body) throw new Error();

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let acc = '';
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          acc += decoder.decode(value, { stream: true });
          setMessages([...history, { role: 'assistant', content: acc }]);
        }
      } catch {
        setMessages([...history, { role: 'assistant', content: t('error') }]);
      } finally {
        setLoading(false);
      }
    },
    [input, loading, messages, t]
  );

  return (
    <>
      {/* Launcher */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.5, type: 'spring', stiffness: 260, damping: 20 }}
        onClick={() => setIsOpen((v) => !v)}
        className="fixed bottom-6 right-6 z-[95] w-14 h-14 rounded-full bg-[var(--color-blue)] hover:bg-[var(--color-blue-light)] text-white shadow-xl shadow-[var(--color-blue)]/40 flex items-center justify-center transition-colors"
        aria-label={isOpen ? t('closeLabel') : t('openLabel')}
      >
        <AnimatePresence mode="wait" initial={false}>
          {isOpen ? (
            <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X size={22} />
            </motion.span>
          ) : (
            <motion.span key="chat" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
              <MessageCircle size={22} />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 60, scale: 0.95 }}
            transition={{ type: 'spring', damping: 26, stiffness: 320 }}
            className="fixed bottom-24 right-4 left-4 md:left-auto md:right-6 z-[95] w-auto md:w-[380px] h-[520px] max-h-[72vh] flex flex-col rounded-3xl overflow-hidden shadow-2xl border border-[var(--color-border)] bg-white"
          >
            {/* Header */}
            <div className="shrink-0 px-5 py-4 bg-[var(--color-slate)] flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[var(--color-blue)] flex items-center justify-center">
                <Sparkles size={18} className="text-[var(--color-yellow)]" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">{t('title')}</p>
                <p className="text-[10px] text-[var(--color-yellow)] font-semibold uppercase tracking-widest flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
                  {t('online')}
                </p>
              </div>
            </div>

            {!aiAllowed ? (
              /* DSGVO-Gate: KI-Chat erst nach Zustimmung (Daten gehen an Google). */
              <div className="flex-1 flex flex-col items-center justify-center text-center gap-3 p-6 bg-[var(--color-bg)]">
                <div className="w-12 h-12 rounded-xl bg-[var(--color-yellow)]/15 flex items-center justify-center">
                  <Sparkles size={22} className="text-[var(--color-yellow-dark)]" />
                </div>
                <h3 className="text-sm font-bold text-[var(--color-text)]">{tc('aiGateTitle')}</h3>
                <p className="text-xs text-[var(--color-muted)] max-w-[15rem] leading-relaxed">
                  {tc('aiGateText')}
                </p>
                <button
                  onClick={() => save({ maps: consent?.maps ?? false, ai: true })}
                  className="mt-1 px-5 py-2 rounded-full bg-[var(--color-blue)] hover:bg-[var(--color-blue-light)] text-white text-sm font-semibold transition-colors"
                >
                  {tc('aiGateButton')}
                </button>
              </div>
            ) : (
              <>
            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-[var(--color-bg)]">
              {messages.map((m, i) => (
                <div key={i} className={cn('flex', m.role === 'user' ? 'justify-end' : 'justify-start')}>
                  <div
                    className={cn(
                      'max-w-[85%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap',
                      m.role === 'user'
                        ? 'bg-[var(--color-blue)] text-white rounded-tr-sm'
                        : 'bg-white text-[var(--color-text)] border border-[var(--color-border)] rounded-tl-sm'
                    )}
                  >
                    {m.content || (loading && i === messages.length - 1 ? <Dots /> : '')}
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <form onSubmit={send} className="shrink-0 p-3 border-t border-[var(--color-border)] bg-white">
              <div className="relative">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={t('placeholder')}
                  disabled={loading}
                  className="w-full bg-[var(--color-bg-alt)] border border-[var(--color-border)] rounded-xl pl-4 pr-11 py-3 text-sm text-[var(--color-text)] placeholder:text-[var(--color-muted)]/60 outline-none focus:border-[var(--color-blue)] transition-colors disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-[var(--color-blue)] hover:text-[var(--color-blue-light)] transition-colors disabled:opacity-30"
                  aria-label={t('send')}
                >
                  <Send size={18} />
                </button>
              </div>
            </form>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function Dots() {
  return (
    <span className="inline-flex items-center gap-1 py-0.5">
      <span className="w-1.5 h-1.5 bg-[var(--color-muted)]/50 rounded-full animate-bounce [animation-delay:0ms]" />
      <span className="w-1.5 h-1.5 bg-[var(--color-muted)]/50 rounded-full animate-bounce [animation-delay:150ms]" />
      <span className="w-1.5 h-1.5 bg-[var(--color-muted)]/50 rounded-full animate-bounce [animation-delay:300ms]" />
    </span>
  );
}
