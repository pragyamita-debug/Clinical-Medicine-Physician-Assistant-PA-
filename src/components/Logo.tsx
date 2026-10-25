/** Four petals around a bright core — a lotus-like mark for the nav, footer and upload screen. */
export function Logo({ size = 38, light = false }: { size?: number; light?: boolean }) {
  return (
    <svg className="logo" width={size} height={size} viewBox="0 0 40 40" aria-hidden>
      <defs>
        <linearGradient id="petal" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#c4b5ff" />
          <stop offset="1" stopColor="#7b5cf0" />
        </linearGradient>
      </defs>
      <g className="logo__petals" fill="url(#petal)" opacity={light ? 1 : 0.95}>
        <path d="M20 5c4 5 4 10 0 15-4-5-4-10 0-15Z" />
        <path d="M20 35c-4-5-4-10 0-15 4 5 4 10 0 15Z" />
        <path d="M5 20c5-4 10-4 15 0-5 4-10 4-15 0Z" />
        <path d="M35 20c-5 4-10 4-15 0 5-4 10-4 15 0Z" />
      </g>
      <g fill="none" stroke="#c4b5ff" strokeWidth="1" opacity="0.6">
        <path d="M9.5 9.5c5 1 8 4 10.5 10.5M30.5 9.5c-1 5-4 8-10.5 10.5M30.5 30.5c-5-1-8-4-10.5-10.5M9.5 30.5c1-5 4-8 10.5-10.5" />
      </g>
      <circle cx="20" cy="20" r="2.6" fill="#fff" />
    </svg>
  );
}
