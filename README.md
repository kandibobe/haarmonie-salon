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

## Für einen neuen Kunden anpassen (Rebranding-Checkliste)

Diese Vorlage ist bewusst config-getrieben. Für einen neuen Betrieb (Physio, Restaurant,
Kosmetik …) in der Regel nur:

1. **`lib/config.ts`** — `salonConfig` (Name, Adresse, Telefon, `whatsappNumber`, Öffnungszeiten,
   `bookingHours`, `slotMinutes`), `services` (Leistungen, Dauer, Preis), `stats`, `testimonials`,
   `projects` (Galeriebilder).
2. **`app/globals.css`** — `@theme`-Farbwerte (die Variablennamen bleiben, nur die Hex-Werte
   ändern → die ganze Seite wird umgefärbt).
3. **`i18n/messages/{de,en}.json`** — Texte.
4. **`app/api/chat/route.ts`** — `SYSTEM_PROMPT` an die neue Branche anpassen.
5. **Bilder** — Hero/About/Projects-URLs in `config.ts` + `HeroSection`/`AboutSection`.
6. **Recht** — `impressum`/`datenschutz`, `public/favicon.svg`, `app/[locale]/opengraph-image.tsx`.

## Produktionshärtung (bereits enthalten)

- **Rate-Limiting** (Upstash sliding window) auf `/api/booking` (5/10 min) und `/api/chat`
  (20/min) — `lib/rate-limit.ts`.
- **Anti-Spam-Honeypot** im Buchungsformular + Serverprüfung.
- **Sicherheits-Header** (HSTS, X-Content-Type-Options, Referrer-Policy …) in `next.config.ts`.
- **Kundenbestätigung per E-Mail** zusätzlich zur Salon-Benachrichtigung (best-effort).
- **Dynamisches OG-Bild** (`next/og`) für Social-Sharing.
- **Vercel Analytics + Speed Insights**.
- **A11y**: sichtbarer Fokus-Ring, `prefers-reduced-motion`, semantische Labels.
- Alle externen Dienste **degradieren graceful** (Mock/Fallback ohne Keys).

## Hinweis zu WhatsApp

Es wird bewusst **wa.me** (Click-to-Chat) genutzt — kostenlos und ohne Meta-Verifizierung, wie bei
realen kleinen Betrieben in DE. Die WhatsApp Business API ist hier nicht nötig.

## Deployment (Vercel)

1. Repo zu GitHub pushen oder `npx vercel` aus dem Ordner.
2. In den Vercel-Projekt-Einstellungen die Env-Variablen setzen (siehe Tabelle oben).
3. `npx vercel --prod`.
