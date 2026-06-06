'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

/* =============================================================================
 * Cookie-/Consent-Verwaltung (DSGVO).
 *
 * Kategorien:
 *  - necessary: immer aktiv (kein Tracking, nur Funktion)
 *  - maps:      Google Maps iframe (Datenübertragung an Google)
 *  - ai:        KI-Chat via Google Gemini (Nachrichten gehen an Google)
 *
 * Externe Dienste werden erst nach ausdrücklicher Zustimmung geladen
 * (Opt-in / Blockierung bis Einwilligung).
 * ===========================================================================*/

export interface ConsentState {
  necessary: true;
  maps: boolean;
  ai: boolean;
}

const STORAGE_KEY = 'haarmonie_consent_v1';
const OPEN_EVENT = 'haarmonie:open-cookie-settings';

interface ConsentContextValue {
  /** null = noch keine Entscheidung getroffen */
  consent: ConsentState | null;
  /** true, sobald localStorage gelesen wurde (vermeidet Hydration-Flackern) */
  ready: boolean;
  /** true, wenn der Nutzer bereits eine Wahl gespeichert hat */
  decided: boolean;
  acceptAll: () => void;
  necessaryOnly: () => void;
  save: (partial: { maps: boolean; ai: boolean }) => void;
}

const ConsentContext = createContext<ConsentContextValue | null>(null);

/** Öffnet den Cookie-Einstellungsdialog von überall (z. B. Footer-Link). */
export function openCookieSettings() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(OPEN_EVENT));
  }
}

/** Erlaubt dem Banner, auf das Öffnen-Event zu reagieren. */
export function onOpenCookieSettings(handler: () => void) {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener(OPEN_EVENT, handler);
  return () => window.removeEventListener(OPEN_EVENT, handler);
}

export function ConsentProvider({ children }: { children: ReactNode }) {
  const [consent, setConsent] = useState<ConsentState | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setConsent(JSON.parse(raw) as ConsentState);
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  const persist = useCallback((next: ConsentState) => {
    setConsent(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  }, []);

  const acceptAll = useCallback(
    () => persist({ necessary: true, maps: true, ai: true }),
    [persist]
  );
  const necessaryOnly = useCallback(
    () => persist({ necessary: true, maps: false, ai: false }),
    [persist]
  );
  const save = useCallback(
    (partial: { maps: boolean; ai: boolean }) =>
      persist({ necessary: true, ...partial }),
    [persist]
  );

  return (
    <ConsentContext.Provider
      value={{ consent, ready, decided: consent !== null, acceptAll, necessaryOnly, save }}
    >
      {children}
    </ConsentContext.Provider>
  );
}

export function useConsent() {
  const ctx = useContext(ConsentContext);
  if (!ctx) {
    throw new Error('useConsent must be used within a ConsentProvider');
  }
  return ctx;
}
