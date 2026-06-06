import { Resend } from 'resend';
import { salonConfig } from './config';

/**
 * Geteilte E-Mail-Helfer für API-Routen (Kontakt, Gutschein, …).
 * Ohne RESEND_API_KEY läuft alles im Mock-Modus (Demo) — es wird nichts
 * versendet, der Request gilt trotzdem als erfolgreich.
 */
export const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export function esc(s: string): string {
  return s.replace(
    /[<>&"]/g,
    (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' })[c]!
  );
}

export function rows(items: [string, string][]): string {
  return `<table style="width:100%;border-collapse:collapse;">${items
    .map(
      ([k, v]) =>
        `<tr><td style="padding:8px 0;color:#8a7a80;font-size:13px;width:130px;vertical-align:top;">${k}</td><td style="padding:8px 0;font-weight:600;">${v}</td></tr>`
    )
    .join('')}</table>`;
}

export function emailShell(title: string, inner: string): string {
  return `
<div style="font-family: Inter, system-ui, sans-serif; max-width: 540px; margin: 0 auto; color: #2a2228;">
  <div style="background: #9e5e6e; padding: 24px 32px; border-radius: 8px 8px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 20px;">${title}</h1>
    <p style="color: rgba(255,255,255,0.8); margin: 6px 0 0; font-size: 13px;">${salonConfig.name}</p>
  </div>
  <div style="background: #faf7f5; padding: 32px; border-radius: 0 0 8px 8px; border: 1px solid #e7ddd8;">
    ${inner}
  </div>
</div>`;
}

export const salonEmailTo = () => process.env.SALON_EMAIL || salonConfig.email;
export const emailFrom = () => process.env.BOOKING_EMAIL_FROM || 'onboarding@resend.dev';
