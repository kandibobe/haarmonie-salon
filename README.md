# Haarmonie — Friseur-Demo mit Online-Terminbuchung

Demo-Website eines fiktiven Friseur- & Beauty-Salons in Gelsenkirchen. Portfolio-Projekt von
[kobiakov.dev](https://kobiakov.dev). Alle Angaben (Firma, Preise, Kontaktdaten, Bewertungen) sind
**fiktiv**.

Der Kern ist ein **wiederverwendbares Online-Buchungsmodul**: echte Slot-Verfügbarkeit mit
Blockierung belegter Termine, ein KI-Empfang (Google Gemini) und WhatsApp-Bestätigung.

Es ist ein **vollständiger Mehrseiter** mit Startseite und eigenständigen Unterseiten
(Leistungen & Preise, Team, Galerie, Gutscheine, Kontakt) sowie rechtlichen Seiten
(Impressum, Datenschutz, AGB) und **DSGVO-konformem Cookie-Consent** (Google Maps und KI-Chat
werden erst nach Einwilligung geladen). Die gesamte Architektur ist config-getrieben und als
**Vorlage** für weitere lokale Dienstleister-Sites ausgelegt.

### Seitenstruktur

| Route                                  | Inhalt                                                                           |
| -------------------------------------- | -------------------------------------------------------------------------------- |
| `/`                                    | Startseite (Hero, Stats, Leistungen, Über uns, Galerie-Teaser, Buchung, Kontakt) |
| `/leistungen`                          | Vollständige Preisliste nach Kategorien + OfferCatalog-JSON-LD                   |
| `/team`                                | Stylisten-Profile (Foto, Schwerpunkte, Erfahrung)                                |
| `/galerie`                             | Galerie mit Lightbox                                                             |
| `/gutscheine`                          | Gutschein-Anfrage (Formular → `/api/gutschein`)                                  |
| `/kontakt`                             | Kontaktformular + Karte (consent-gated) + Anfahrt                                |
| `/impressum` · `/datenschutz` · `/agb` | Rechtliche Seiten                                                                |

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
   `bookingHours`, `slotMinutes`, `structuredAddress`, `seo`, `aggregateRating`, `defaultUrl`,
   `businessType`), `services`, `priceList` (volle Preisliste), `team` (Stylisten), `navItems`
   (Menü), `stats`, `testimonials`, `projects` (Galeriebilder).
2. **`app/globals.css`** — die ~11 **BRAND-TOKENS** im `@theme`-Block (Variablennamen bleiben,
   nur die Hex-Werte ändern → die ganze Seite wird umgefärbt).
3. **`i18n/messages/{de,en}.json`** — Texte (beide Sprachen synchron halten).
4. **`app/api/chat/route.ts`** — `SYSTEM_PROMPT` an die neue Branche anpassen.
5. **Bilder** — Hero/About/Projects/Team-URLs in `config.ts` (eigene Hosts ggf. in
   `next.config.ts → images.remotePatterns`).
6. **Recht** — `impressum`/`datenschutz`/`agb`, `public/favicon.svg`,
   `app/[locale]/opengraph-image.tsx`.
7. **Demo-Modus aus** — `lib/config.ts` → `demo.enabled = false` entfernt Demo-Banner,
   „fiktiv"-Hinweise und den Footer-Vermerk für ein echtes Kundenprojekt.

### Weitere wiederverwendbare Module

- **Cookie-Consent** (`components/features/consent/`) — Provider, Banner mit Kategorie-Schaltern,
  `MapEmbed` (Maps-Gate); KI-Chat-Gate im `ChatWidget`. Opt-in/Blockierung bis Einwilligung.
- **Formular-Mails** (`lib/email.ts`) — geteilte Helfer für `app/api/contact` und
  `app/api/gutschein` (Zod + Honeypot + Rate-Limit + Resend-Mock-Fallback).
- **Seiten-Bausteine** (`components/ui/`) — `PageHero` (Banner + Breadcrumb), `CtaBand`,
  `SectionBadge`.

## Produktionshärtung (bereits enthalten)

- **Rate-Limiting** (Upstash sliding window) auf `/api/booking` (5/10 min), `/api/chat`
  (20/min) und `/api/contact` + `/api/gutschein` (5/10 min) — `lib/rate-limit.ts`.
- **Anti-Spam-Honeypot** in allen Formularen (Buchung, Kontakt, Gutschein) + Serverprüfung.
- **DSGVO-Consent** — externe Dienste (Maps, KI-Chat) erst nach Einwilligung.
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
