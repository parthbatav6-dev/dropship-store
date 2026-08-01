export default function Logo() {
  return (
    <>
      <svg width="34" height="34" viewBox="0 0 70 70" aria-hidden="true">
        <rect x="0" y="0" width="70" height="70" fill="var(--ink)" rx="10" />
        <circle cx="10" cy="10" r="3" fill="var(--accent)" />
        <circle cx="60" cy="10" r="3" fill="var(--accent)" />
        <circle cx="10" cy="60" r="3" fill="var(--accent)" />
        <circle cx="60" cy="60" r="3" fill="var(--accent)" />
        {/* Geometric paw mark — 4 toe pads + heel, outline style */}
        <g fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinejoin="round">
          <polygon points="20,21 26,17 32,21 32,28 26,32 20,28" />
          <polygon points="31,15 37,11 43,15 43,22 37,26 31,22" />
          <polygon points="42,15 48,11 54,15 54,22 48,26 42,22" />
          <polygon points="53,21 59,17 65,21 65,28 59,32 53,28" />
          <path d="M27,38 L51,38 L57,47 Q42,60 22,47 Z" />
        </g>
      </svg>
      <span className="brand-name">PAWRIG</span>
    </>
  );
}
