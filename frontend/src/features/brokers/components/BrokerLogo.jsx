import React from 'react';

export const BrokerLogo = ({ broker, className = '' }) => {
  if (!broker) return null;

  // 1. If high-fidelity SVG component exists
  if (typeof broker.Logo === 'function') {
    const Component = broker.Logo;
    return <Component />;
  }

  // 2. If custom image URL is provided
  if (broker.logoUrl && broker.logoUrl.trim()) {
    return (
      <img
        src={broker.logoUrl}
        alt={`${broker.name} logo`}
        className={`top-broker-svg custom-broker-img ${className}`}
        style={{
          maxHeight: 24,
          maxWidth: 120,
          objectFit: 'contain',
          verticalAlign: 'middle',
        }}
        onError={(e) => {
          // Fallback to initials if image fails to load
          e.currentTarget.style.display = 'none';
          const fallback = e.currentTarget.nextElementSibling;
          if (fallback) fallback.style.display = 'inline-flex';
        }}
      />
    );
  }

  // 3. Ultra-modern Stylized Brand Badge (Monogram + Name)
  const initials = broker.name
    ? broker.name
        .split(' ')
        .map((w) => w[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'FX';

  const brandColor = broker.brandColor || '#0284c7';

  return (
    <div
      className={`broker-custom-brand-badge ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '7px',
        verticalAlign: 'middle',
      }}
    >
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 22,
          height: 22,
          borderRadius: 6,
          background: brandColor,
          color: '#ffffff',
          fontSize: '11px',
          fontWeight: 900,
          letterSpacing: '-0.3px',
          boxShadow: `0 2px 8px ${brandColor}44`,
          flexShrink: 0,
        }}
      >
        {initials}
      </span>
      <span
        style={{
          fontFamily: 'system-ui, -apple-system, sans-serif',
          fontSize: '16px',
          fontWeight: 800,
          letterSpacing: '-0.3px',
          color: 'var(--text-primary, #ffffff)',
          lineHeight: 1,
        }}
      >
        {broker.name}
      </span>
    </div>
  );
};

export default BrokerLogo;
