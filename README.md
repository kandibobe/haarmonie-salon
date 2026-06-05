# Haarmonie — Friseur-Demo mit Online-Terminbuchung

Demo-Website eines fiktiven Friseur- & Beauty-Salons in Gelsenkirchen. Portfolio-Projekt von
[kobiakov.dev](https://kobiakov.dev). Alle Angaben (Firma, Preise, Kontaktdaten, Bewertungen) sind
**fiktiv**.

Der Kern ist ein **wiederverwendbares Online-Buchungsmodul**: echte Slot-Verfügbarkeit mit
Blockierung belegter Termine, ein KI-Empfang (Google Gemini) und WhatsApp-Bestätigung.

## Stack

Next.js 15 (App Router) · TypeScript · Tailwind CSS 4 · next-intl (DE/EN) · Framer Motion ·
React Hook Form + Zod · Upstash Redis (Slot-Speicher) · Google Gemini (KI-Chat) · Resend (E-Mail)

## Lokal starten

```bash
npm install
npm run dev      # http://localhost:3004
```

Die Demo läuft **ohne jegliche Umgebungsvariablen** im Mock-Modus:

- Buchung: funktioniert, aber Slots werden nicht dauerhaft blockiert (kein Redis)
- E-Mail: wird nur in der Konsole geloggt (kein Resend)
- KI-Chat: gibt eine feste Fallback-Antwort (kein Gemini-Key)

## Umgebungsvariablen (optional, für vollen Funktionsumfang)

Siehe [.env.example](.env.example). Kopiere sie nach `.env.local` und fülle aus, was du brauchst:

| Variable                            | Zweck                                 | Ohne sie                          |
| ----------------------------------- | ------------------------------------- | --------------------------------- |
| `UPSTASH_REDIS_REST_URL` / `_TOKEN` | Echte Blockierung belegter Slots      | Slots immer frei                  |
| `RESEND_API_KEY`                    | Buchungsbestätigung per E-Mail        | E-Mail nur als Log                |
| `SALON_EMAIL`                       | Empfänger der Buchungsmail            | Standard: `salonConfig.email`     |
| `BOOKING_EMAIL_FROM`                | Absender (verifizierte Resend-Domain) | `onboarding@resend.dev`           |
| `GOOGLE_GENERATIVE_AI_API_KEY`      | KI-Empfang via Gemini                 | Fallback-Antwort                  |
| `NEXT_PUBLIC_APP_URL`               | Metadaten / Sitemap                   | `https://friseur-demo.vercel.app` |

## Skripte

```bash
npm run dev          # Dev-Server (Port 3004)
npm run build        # Production-Build
npm run start        # Production-Server (Port 3004)
npm run type-check   # tsc --noEmit
```

## Das Buchungsmodul wiederverwenden

Für ein anderes Projekt (z. B. Physio, Restaurant) genügt es, **`lib/config.ts`** anzupassen
(Leistungen, Öffnungszeiten, `slotMinutes`, `whatsappNumber`). Diese Dateien bilden das
config-getriebene, portierbare Kernmodul:

- `lib/availability.ts` — Slot-Generierung + Redis-Persistenz
- `app/api/availability/route.ts` — freie Slots (GET)
- `app/api/booking/route.ts` — Buchung anlegen (POST)
- `components/booking/BookingWidget.tsx` — 3-Schritt-Buchungs-UI

## Hinweis zu WhatsApp

Es wird bewusst **wa.me** (Click-to-Chat) genutzt — kostenlos und ohne Meta-Verifizierung, wie bei
realen kleinen Betrieben in DE. Die WhatsApp Business API ist hier nicht nötig.
