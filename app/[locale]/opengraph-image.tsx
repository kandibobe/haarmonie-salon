import { ImageResponse } from 'next/og';
import { salonConfig } from '@lib/config';

export const alt = `${salonConfig.name} — Friseur mit Online-Terminbuchung`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px',
          background: 'linear-gradient(135deg, #2a2228 0%, #3d3038 55%, #9e5e6e 140%)',
          fontFamily: 'Georgia, serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 20,
            marginBottom: 36,
          }}
        >
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 18,
              background: '#9e5e6e',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 44,
              fontWeight: 700,
              color: '#e6cfa0',
            }}
          >
            H
          </div>
          <div style={{ fontSize: 30, color: '#c9a36a', letterSpacing: 4 }}>
            FRISEUR &amp; BEAUTY · GELSENKIRCHEN
          </div>
        </div>
        <div style={{ fontSize: 84, fontWeight: 700, color: '#ffffff', lineHeight: 1.05 }}>
          {salonConfig.name}
        </div>
        <div style={{ fontSize: 40, color: 'rgba(255,255,255,0.8)', marginTop: 24 }}>
          Termin online buchen — in 60 Sekunden
        </div>
        <div
          style={{
            display: 'flex',
            gap: 16,
            marginTop: 48,
          }}
        >
          {['Online-Terminbuchung', 'KI-Empfang', 'WhatsApp'].map((tag) => (
            <div
              key={tag}
              style={{
                fontSize: 26,
                color: '#e6cfa0',
                border: '2px solid rgba(230,207,160,0.4)',
                borderRadius: 999,
                padding: '10px 26px',
              }}
            >
              {tag}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
