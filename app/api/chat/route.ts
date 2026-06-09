import { google } from '@ai-sdk/google';
import { streamText } from 'ai';
import { salonConfig, buildChatSystemPrompt } from '@lib/config';
import { checkRateLimit, getClientIp } from '@lib/rate-limit';

export const maxDuration = 30;

const SYSTEM_PROMPT = buildChatSystemPrompt();

const FALLBACK_RESPONSE = `Hallo und willkommen bei ${salonConfig.name}! Ich bin der KI-Empfang. Ich kann Ihnen Fragen zu Leistungen, Preisen und Öffnungszeiten beantworten. Für einen Termin nutzen Sie bitte die Online-Terminbuchung auf dieser Seite ("Termin buchen").`;

export async function POST(req: Request) {
  // Rate limit pro IP (begrenzt Gemini-Kosten / Missbrauch).
  const { success } = await checkRateLimit('chat', getClientIp(req));
  if (!success) {
    return new Response('Zu viele Anfragen. Bitte versuchen Sie es in einer Minute erneut.', {
      status: 429,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }

  const { messages: rawMessages } = await req.json();

  // Fallback ohne API-Key: einfacher Text-Stream (Demo läuft trotzdem).
  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    return new Response(FALLBACK_RESPONSE, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }

  // Cap history to last 10 turns — prevents prompt-stuffing attacks.
  const messages = Array.isArray(rawMessages) ? rawMessages.slice(-10) : [];

  const result = streamText({
    model: google('gemini-2.5-flash'),
    system: SYSTEM_PROMPT,
    messages,
    providerOptions: {
      google: { maxOutputTokens: 400 },
    },
  });

  return result.toTextStreamResponse();
}
