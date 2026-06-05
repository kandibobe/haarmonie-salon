import { google } from '@ai-sdk/google';
import { streamText } from 'ai';
import { salonConfig, services } from '@lib/config';

export const maxDuration = 30;

const serviceLines = services
  .map((s) => `- ${s.id} (${s.price}, ca. ${s.duration} Min.)`)
  .join('\n');

const SYSTEM_PROMPT = `Du bist der freundliche KI-Empfang von "${salonConfig.name}", einem Friseur- und Beauty-Salon in Gelsenkirchen.
Antworte kurz, herzlich und auf Deutsch (oder in der Sprache des Kunden).

Fakten über den Salon:
- Adresse: ${salonConfig.addressDisplay} (fiktiv, Demo)
- Öffnungszeiten: ${salonConfig.openingHours.weekdays}; ${salonConfig.openingHours.saturday}; ${salonConfig.openingHours.closed}
- Telefon: ${salonConfig.phone}
- Leistungen und Richtpreise:
${serviceLines}

Wichtig:
- Wenn jemand einen Termin möchte, weise freundlich auf die Online-Terminbuchung auf dieser Seite hin ("Klicken Sie auf 'Termin buchen'").
- Du kannst KEINE Termine direkt buchen — leite immer zur Buchungsfunktion weiter.
- Dies ist eine Demo-Website; alle Angaben sind fiktiv. Erwähne das nur, wenn ausdrücklich danach gefragt wird.`;

const FALLBACK_RESPONSE = `Hallo und willkommen bei ${salonConfig.name}! Ich bin der KI-Empfang. Ich kann Ihnen Fragen zu Leistungen, Preisen und Öffnungszeiten beantworten. Für einen Termin nutzen Sie bitte die Online-Terminbuchung auf dieser Seite ("Termin buchen").`;

export async function POST(req: Request) {
  const { messages } = await req.json();

  // Fallback ohne API-Key: einfacher Text-Stream (Demo läuft trotzdem).
  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    return new Response(FALLBACK_RESPONSE, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }

  const result = streamText({
    model: google('gemini-2.5-flash'),
    system: SYSTEM_PROMPT,
    messages,
  });

  return result.toTextStreamResponse();
}
