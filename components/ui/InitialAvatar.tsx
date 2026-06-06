const COLORS = [
  { bg: '#9e5e6e', text: '#fff' },
  { bg: '#7d4a57', text: '#fff' },
  { bg: '#c9a36a', text: '#2a2228' },
  { bg: '#57464f', text: '#fff' },
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
