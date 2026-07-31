export default function Logo() {
  return (
    <>
      <svg width="34" height="34" viewBox="0 0 70 70" aria-hidden="true">
        <rect x="0" y="0" width="70" height="70" fill="var(--ink)" rx="4" />
        <rect x="0" y="0" width="4" height="4" fill="var(--paper)" />
        <rect x="66" y="0" width="4" height="4" fill="var(--paper)" />
        <rect x="0" y="66" width="4" height="4" fill="var(--paper)" />
        <rect x="66" y="66" width="4" height="4" fill="var(--paper)" />
        <rect x="6" y="6" width="58" height="58" fill="none" stroke="var(--brass)" strokeWidth="2" />
        <circle cx="10" cy="10" r="2" fill="var(--brass)" />
        <circle cx="60" cy="10" r="2" fill="var(--brass)" />
        <circle cx="10" cy="60" r="2" fill="var(--brass)" />
        <circle cx="60" cy="60" r="2" fill="var(--brass)" />
        <text x="35" y="48" fontFamily="'IBM Plex Mono', monospace" fontWeight="700" fontSize="36" fill="var(--paper)" textAnchor="middle">B</text>
      </svg>
      <span className="brand-name">BASEPLATE</span>
    </>
  );
}
