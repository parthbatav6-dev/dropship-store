export default function TrustBadges() {
  const badges = [
    { icon: '🚚', label: 'Free shipping over ₹999' },
    { icon: '🔒', label: 'Secure checkout via Razorpay' },
    { icon: '↩', label: '7-day easy returns' },
  ];

  return (
    <div className="trust-badges">
      {badges.map((b) => (
        <div className="trust-badge" key={b.label}>
          <span className="trust-badge-icon" aria-hidden="true">{b.icon}</span>
          <span>{b.label}</span>
        </div>
      ))}
    </div>
  );
}
