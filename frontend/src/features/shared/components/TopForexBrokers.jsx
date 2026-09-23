import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// Official Color SVG Logos matching the screenshot
const ColorXM_Logo = () => (
  <svg viewBox="0 0 92 26" height="24" className="top-broker-svg" aria-label="XM">
    {/* Red Bull Silhouette Mark */}
    <path
      d="M2.5 19.5L7.2 4.5l4.8 5.8-2.2 2.4 3.8 5.8h-4.2l-2.1-3.5-2 3.5H2.5zm6.7-9.2L7.3 7 4.7 15.2h2.3l2.2-4.9z"
      fill="#e11d48"
    />
    {/* Black / White XM Wordmark */}
    <path
      d="M21 5h5.1l4.2 6.2 4.2-6.2h5.1l-6.8 9.5 7.1 9.9H35l-4.5-6.7-4.5 6.7H21l7.1-9.9L21 5z"
      fill="currentColor"
    />
    <path
      d="M42 5h5l5.3 9.1L57.6 5h5v19.4h-4.2v-13l-4.8 8h-2.6l-4.8-8v13H42V5z"
      fill="currentColor"
    />
  </svg>
);

const ColorExness_Logo = () => (
  <svg viewBox="0 0 115 26" height="22" className="top-broker-svg" aria-label="Exness">
    {/* Golden-Yellow Loop Symbol */}
    <g transform="translate(1, 3.5)">
      <path
        d="M13.2 2.8a5.2 5.2 0 0 0-4 1.9L4.6 9a5.2 5.2 0 0 0 0 7.4 5.2 5.2 0 0 0 7.4 0l3.6-4.1a5.2 5.2 0 0 0 0-7.4 5.2 5.2 0 0 0-2.4-2.1zm-3.6 8.4l3.6-4.1a2.3 2.3 0 0 1 3.3 3.3l-3.6 4.1a2.3 2.3 0 0 1-3.3-3.3z"
        fill="#f59e0b"
        opacity="0.9"
      />
      <path
        d="M18.8 15.8a5.2 5.2 0 0 0 4-1.9l4.6-4.3a5.2 5.2 0 0 0-7.4-7.4l-3.6 4.1a5.2 5.2 0 0 0 0 7.4 5.2 5.2 0 0 0 2.4 2.1zm3.6-8.4l-3.6 4.1a2.3 2.3 0 0 1-3.3-3.3l3.6-4.1a2.3 2.3 0 0 1 3.3 3.3z"
        fill="#eab308"
      />
    </g>
    {/* exness wordmark */}
    <text x="35" y="18.5" fontFamily="system-ui, -apple-system, sans-serif" fontSize="17" fontWeight="700" letterSpacing="-0.5px" fill="currentColor">
      exness
    </text>
  </svg>
);

const ColorICMarkets_Logo = () => (
  <svg viewBox="0 0 130 26" height="23" className="top-broker-svg" aria-label="IC Markets">
    {/* Vibrant Green Bars */}
    <rect x="1" y="13.5" width="3.5" height="9.5" rx="1.7" fill="#10b981" />
    <rect x="7" y="8" width="3.5" height="15" rx="1.7" fill="#10b981" />
    <rect x="13" y="3.5" width="3.5" height="19.5" rx="1.7" fill="#059669" />
    {/* IC Markets Wordmark */}
    <text x="23" y="18.5" fontFamily="system-ui, -apple-system, sans-serif" fontSize="16.5" fontWeight="800" letterSpacing="-0.4px" fill="currentColor">
      IC Markets
    </text>
  </svg>
);

const ColorPepperstone_Logo = () => (
  <svg viewBox="0 0 146 26" height="22" className="top-broker-svg" aria-label="Pepperstone">
    {/* Blue Curved Shield */}
    <path
      d="M3 8C3 4.8 5.6 2.2 8.8 2.2h4.2C17.6 2.2 20.5 6 20 10.4c-.4 4-3.5 8.9-7.8 12.1L5.9 18C4 16.1 3 11.6 3 8zm5.8 1.6v5.2h2.6c1.8 0 3.2-1.2 3.2-2.6s-1.4-2.6-3.2-2.6H8.8z"
      fill="#2563eb"
    />
    {/* pepperstone wordmark */}
    <text x="28" y="18.5" fontFamily="system-ui, -apple-system, sans-serif" fontSize="16.5" fontWeight="600" letterSpacing="-0.4px" fill="currentColor">
      pepperstone
    </text>
  </svg>
);

const ColorFXTM_Logo = () => (
  <svg viewBox="0 0 108 26" height="23" className="top-broker-svg" aria-label="FXTM">
    {/* Orange Globe Symbol */}
    <circle cx="11" cy="13" r="9.5" fill="#f97316" />
    <path d="M4.5 7C7.8 9.8 14.2 16.2 17.5 19M17.5 7C14.2 9.8 7.8 16.2 4.5 19" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
    {/* FXTM Wordmark */}
    <text x="29" y="18.5" fontFamily="system-ui, -apple-system, sans-serif" fontSize="16.5" fontWeight="800" letterSpacing="0.6px" fill="currentColor">
      FXTM
    </text>
  </svg>
);

const ColorAvaTrade_Logo = () => (
  <svg viewBox="0 0 130 26" height="22" className="top-broker-svg" aria-label="AvaTrade">
    <path d="M2.5 20.5L9.5 5.5l4.8 10.8-2.6 1.3-2.2-4.9-3.9 7.8H2.5zm14-15l7 15h-3l-4-7.8-2.2 4.8 2.2 3H13.5l3-15z" fill="#0284c7" />
    <text x="28" y="18.5" fontFamily="system-ui, -apple-system, sans-serif" fontSize="16" fontWeight="800" letterSpacing="0.7px" fill="currentColor">
      AVATRADE
    </text>
  </svg>
);

const ColorOANDA_Logo = () => (
  <svg viewBox="0 0 112 26" height="23" className="top-broker-svg" aria-label="OANDA">
    <circle cx="11" cy="13" r="9.2" fill="none" stroke="#0d9488" strokeWidth="2.8" />
    <path d="M6.5 19.5L15.5 6.5" stroke="#0d9488" strokeWidth="3" strokeLinecap="round" />
    <text x="27" y="18.5" fontFamily="system-ui, -apple-system, sans-serif" fontSize="16.5" fontWeight="700" letterSpacing="0.8px" fill="currentColor">
      OANDA
    </text>
  </svg>
);

const ColorTickmill_Logo = () => (
  <svg viewBox="0 0 120 26" height="23" className="top-broker-svg" aria-label="Tickmill">
    <path d="M10.5 2.5l7 4v8l-7 4-7-4v-8l7-4zm0 3.5l-4.4 2.5v5l4.4 2.5 4.4-2.5v-5L10.5 6z" fill="#e11d48" />
    <text x="25" y="18.5" fontFamily="system-ui, -apple-system, sans-serif" fontSize="16.5" fontWeight="700" letterSpacing="-0.3px" fill="currentColor">
      Tickmill
    </text>
  </svg>
);

const TOP_BROKERS_DATA = [
  {
    id: 'xm',
    rank: '#1',
    rankNum: 1,
    isFirst: true,
    Logo: ColorXM_Logo,
    name: 'XM',
    rating: '4.8',
    reviewsCount: '2.1K reviews',
    highlightBadge: 'Best Overall',
    badgeTheme: 'coral',
    minDeposit: '$5',
    spread: 'From 0.6 pips',
    regulation: 'FCA, CySEC, ASIC',
    platforms: 'MT4, MT5',
  },
  {
    id: 'exness',
    rank: '#2',
    rankNum: 2,
    isFirst: false,
    Logo: ColorExness_Logo,
    name: 'Exness',
    rating: '4.6',
    reviewsCount: '1.8K reviews',
    highlightBadge: 'Lowest Spreads',
    badgeTheme: 'emerald',
    minDeposit: '$10',
    spread: 'From 0.0 pips',
    regulation: 'FCA, CySEC',
    platforms: 'MT4, MT5',
  },
  {
    id: 'icmarkets',
    rank: '#3',
    rankNum: 3,
    isFirst: false,
    Logo: ColorICMarkets_Logo,
    name: 'IC Markets',
    rating: '4.7',
    reviewsCount: '1.9K reviews',
    highlightBadge: 'Best for Scalping',
    badgeTheme: 'cyan',
    minDeposit: '$200',
    spread: 'From 0.0 pips',
    regulation: 'ASIC, CySEC',
    platforms: 'MT4, cTrader',
  },
  {
    id: 'pepperstone',
    rank: '#4',
    rankNum: 4,
    isFirst: false,
    Logo: ColorPepperstone_Logo,
    name: 'Pepperstone',
    rating: '4.5',
    reviewsCount: '1.4K reviews',
    highlightBadge: 'Fast Execution',
    badgeTheme: 'purple',
    minDeposit: '$200',
    spread: 'From 0.0 pips',
    regulation: 'ASIC, FCA',
    platforms: 'MT4, MT5',
  },
  {
    id: 'fxtm',
    rank: '#5',
    rankNum: 5,
    isFirst: false,
    Logo: ColorFXTM_Logo,
    name: 'FXTM',
    rating: '4.4',
    reviewsCount: '1.2K reviews',
    highlightBadge: 'Wide Range',
    badgeTheme: 'amber',
    minDeposit: '$10',
    spread: 'From 0.1 pips',
    regulation: 'FCA, CySEC',
    platforms: 'MT4, MT5',
  },
  {
    id: 'avatrade',
    rank: '#6',
    rankNum: 6,
    isFirst: false,
    Logo: ColorAvaTrade_Logo,
    name: 'AvaTrade',
    rating: '4.6',
    reviewsCount: '1.5K reviews',
    highlightBadge: 'Best for Beginners',
    badgeTheme: 'blue',
    minDeposit: '$100',
    spread: 'From 0.9 pips',
    regulation: 'CBI, ASIC, FSA',
    platforms: 'MT4, MT5, Web',
  },
  {
    id: 'oanda',
    rank: '#7',
    rankNum: 7,
    isFirst: false,
    Logo: ColorOANDA_Logo,
    name: 'OANDA',
    rating: '4.5',
    reviewsCount: '1.1K reviews',
    highlightBadge: 'Advanced Tools',
    badgeTheme: 'teal',
    minDeposit: '$0',
    spread: 'From 0.8 pips',
    regulation: 'CFTC, NFA, FCA',
    platforms: 'TradingView, MT4',
  },
  {
    id: 'tickmill',
    rank: '#8',
    rankNum: 8,
    isFirst: false,
    Logo: ColorTickmill_Logo,
    name: 'Tickmill',
    rating: '4.4',
    reviewsCount: '950 reviews',
    highlightBadge: 'Low Commissions',
    badgeTheme: 'rose',
    minDeposit: '$100',
    spread: 'From 0.0 pips',
    regulation: 'FCA, CySEC, FSA',
    platforms: 'MT4, MT5',
  },
];

const TopForexBrokers = ({ onSelectBroker }) => {
  const carouselRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScrollLimits = () => {
    if (!carouselRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;
    checkScrollLimits();
    el.addEventListener('scroll', checkScrollLimits, { passive: true });
    window.addEventListener('resize', checkScrollLimits);
    return () => {
      el.removeEventListener('scroll', checkScrollLimits);
      window.removeEventListener('resize', checkScrollLimits);
    };
  }, []);

  const handlePrev = () => {
    if (!carouselRef.current) return;
    carouselRef.current.scrollBy({ left: -310, behavior: 'smooth' });
  };

  const handleNext = () => {
    if (!carouselRef.current) return;
    carouselRef.current.scrollBy({ left: 310, behavior: 'smooth' });
  };

  return (
    <section className="top-brokers-section" aria-label="Top Forex Brokers">
      <div className="top-brokers-container">
        {/* Header with Title, Subtitle, and Carousel Controls */}
        <div className="top-brokers-header">
          <motion.div
            className="top-brokers-title-wrap"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.35 }}
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.1,
                },
              },
            }}
          >
            <h2 className="top-brokers-title">
              <motion.span
                className="top-brokers-boxed"
                variants={{
                  hidden: { opacity: 0, y: 14, scale: 0.98 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] },
                  },
                }}
              >
                {/* 4 Connected Animated Border Lines (Guaranteed 100% full rectangle trace) */}
                <span className="boxed-border-lines" aria-hidden="true">
                  {/* Top Line: Left to Right */}
                  <motion.span
                    className="border-line-segment line-top"
                    variants={{
                      hidden: { scaleX: 0 },
                      visible: {
                        scaleX: 1,
                        transition: { duration: 0.22, ease: 'easeOut', delay: 0.1 },
                      },
                    }}
                  />
                  {/* Right Line: Top to Bottom */}
                  <motion.span
                    className="border-line-segment line-right"
                    variants={{
                      hidden: { scaleY: 0 },
                      visible: {
                        scaleY: 1,
                        transition: { duration: 0.22, ease: 'easeOut', delay: 0.32 },
                      },
                    }}
                  />
                  {/* Bottom Line: Right to Left */}
                  <motion.span
                    className="border-line-segment line-bottom"
                    variants={{
                      hidden: { scaleX: 0 },
                      visible: {
                        scaleX: 1,
                        transition: { duration: 0.22, ease: 'easeOut', delay: 0.54 },
                      },
                    }}
                  />
                  {/* Left Line: Bottom to Top */}
                  <motion.span
                    className="border-line-segment line-left"
                    variants={{
                      hidden: { scaleY: 0 },
                      visible: {
                        scaleY: 1,
                        transition: { duration: 0.22, ease: 'easeOut', delay: 0.76 },
                      },
                    }}
                  />
                </span>

                {/* Animated Inner Ambient Glow */}
                <motion.span
                  className="top-brokers-boxed-glow"
                  variants={{
                    hidden: { opacity: 0 },
                    visible: {
                      opacity: 1,
                      transition: { duration: 0.5, delay: 0.75 },
                    },
                  }}
                  aria-hidden="true"
                />

                {/* Animated Text */}
                <motion.span
                  className="top-brokers-text"
                  variants={{
                    hidden: { opacity: 0, y: 8 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: 0.08 },
                    },
                  }}
                >
                  Top Forex Brokers
                </motion.span>

                {/* 4 Animated Corner Handle Dots (Synchronized to line arrivals) */}
                <span className="corner-handles" aria-hidden="true">
                  <motion.span
                    className="handle-dot handle-tl"
                    variants={{
                      hidden: { scale: 0, opacity: 0 },
                      visible: {
                        scale: 1,
                        opacity: 1,
                        transition: { type: 'spring', stiffness: 450, damping: 18, delay: 0.1 },
                      },
                    }}
                  />
                  <motion.span
                    className="handle-dot handle-tr"
                    variants={{
                      hidden: { scale: 0, opacity: 0 },
                      visible: {
                        scale: 1,
                        opacity: 1,
                        transition: { type: 'spring', stiffness: 450, damping: 18, delay: 0.32 },
                      },
                    }}
                  />
                  <motion.span
                    className="handle-dot handle-br"
                    variants={{
                      hidden: { scale: 0, opacity: 0 },
                      visible: {
                        scale: 1,
                        opacity: 1,
                        transition: { type: 'spring', stiffness: 450, damping: 18, delay: 0.54 },
                      },
                    }}
                  />
                  <motion.span
                    className="handle-dot handle-bl"
                    variants={{
                      hidden: { scale: 0, opacity: 0 },
                      visible: {
                        scale: 1,
                        opacity: 1,
                        transition: { type: 'spring', stiffness: 450, damping: 18, delay: 0.76 },
                      },
                    }}
                  />
                </span>
              </motion.span>
            </h2>

            <motion.p
              className="top-brokers-subtitle"
              variants={{
                hidden: { opacity: 0, y: 10 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.35 },
                },
              }}
            >
              Compare real trading conditions, fees, platforms, and user reviews.
            </motion.p>
          </motion.div>

          <div className="top-brokers-nav-btns" aria-label="Carousel navigation">
            <button
              type="button"
              className={`carousel-nav-btn ${!canScrollLeft ? 'is-disabled' : ''}`}
              onClick={handlePrev}
              disabled={!canScrollLeft}
              aria-label="Previous brokers"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>

            <button
              type="button"
              className={`carousel-nav-btn ${!canScrollRight ? 'is-disabled' : ''}`}
              onClick={handleNext}
              disabled={!canScrollRight}
              aria-label="Next brokers"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        </div>

        {/* Carousel Cards Track */}
        <motion.div
          className="top-brokers-carousel-viewport"
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.15 }}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        >
          <div className="top-brokers-carousel-track" ref={carouselRef}>
            {TOP_BROKERS_DATA.map((broker) => (
              <div key={broker.id} className="broker-card">
                {/* Top Row: Rank Tag and Logo */}
                <div className="broker-card-top">
                  <span
                    className={`broker-rank-badge rank-badge-${
                      broker.rankNum <= 3 ? broker.rankNum : 'other'
                    }`}
                  >
                    {broker.rank}
                  </span>

                  <div className="broker-card-logo-wrap">
                    <broker.Logo />
                  </div>
                </div>

                {/* Rating & Review Count */}
                <div className="broker-card-rating-row">
                  <span className="broker-star-icon" aria-hidden="true">★</span>
                  <span className="broker-rating-num">{broker.rating}</span>
                  <span className="broker-reviews-count">({broker.reviewsCount})</span>
                </div>

                {/* Highlight Badge Pill */}
                <div className="broker-card-badge-wrap">
                  <span className={`broker-highlight-pill pill-theme-${broker.badgeTheme || 'emerald'}`}>
                    {broker.highlightBadge}
                  </span>
                </div>

                {/* Specs List Grid */}
                <div className="broker-card-specs">
                  <div className="spec-row">
                    <span className="spec-label">Min. Deposit</span>
                    <span className="spec-value spec-value-deposit spec-value-strong">{broker.minDeposit}</span>
                  </div>

                  <div className="spec-row">
                    <span className="spec-label">Spread</span>
                    <span className="spec-value spec-value-spread">{broker.spread}</span>
                  </div>

                  <div className="spec-row">
                    <span className="spec-label">Regulation</span>
                    <span className="spec-value spec-value-regulation">{broker.regulation}</span>
                  </div>

                  <div className="spec-row">
                    <span className="spec-label">Platforms</span>
                    <span className="spec-value spec-value-platforms">{broker.platforms}</span>
                  </div>
                </div>

                {/* Dark CTA Button */}
                <button
                  type="button"
                  className="broker-card-cta-btn"
                  onClick={() => onSelectBroker && onSelectBroker(broker)}
                  aria-label={`View review for ${broker.name}`}
                >
                  <span>View Review</span>
                  <svg
                    className="broker-btn-arrow"
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TopForexBrokers;
