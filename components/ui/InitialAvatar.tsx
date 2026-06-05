const COLORS = [
  { bg: '#1e40af', text: '#fff' },
  { bg: '#2563eb', text: '#fff' },
  { bg: '#fbbf24', text: '#1e293b' },
  { bg: '#334155', text: '#fff' },
];

function initials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export function InitialAvatar({ name, size = 44 }: { name: string; size?: number }) {
  const idx = name.charCodeAt(0) % COLORS.length;
  const { bg, text } = COLORS[idx];

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 44 44"
      aria-label={name}
      role="img"
      style={{ borderRadius: '50%', flexShrink: 0 }}
    >
      <circle cx="22" cy="22" r="22" fill={bg} />
      <text
        x="22"
        y="27"
        textAnchor="middle"
        fill={text}
        fontSize="15"
        fontFamily="Inter, system-ui, sans-serif"
        fontWeight="bold"
      >
        {initials(name)}
      </text>
    </svg>
  );
}
