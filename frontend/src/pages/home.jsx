import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import InteractiveDotGrid from '../features/shared/components/InteractiveDotGrid';
import TrustedBrokersMarquee from '../features/shared/components/TrustedBrokersMarquee';
import InteractiveRobot from '../features/shared/components/InteractiveRobot';
import TopForexBrokers from '../features/shared/components/TopForexBrokers';
import BrokerComparisonBanner from '../features/shared/components/BrokerComparisonBanner';
import Testimonials from '../features/shared/components/Testimonials';
import Footer from '../features/shared/components/Footer';

// Geometric Frame Circuit Lines Component
const GeometricFrameLines = () => {
  return (
    <div className="pipwise-circuit-bg-container" aria-hidden="true">
      <svg
        className="pipwise-hero-circuit-bg"
        width="100%"
        height="100%"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="pipwiseGridPattern" width="48" height="48" patternUnits="userSpaceOnUse">
            <path d="M 48 0 L 0 0 0 48" fill="none" stroke="var(--circuit-line-dim)" strokeWidth="0.75" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#pipwiseGridPattern)" opacity="0.35" />

        {/* Outer Frame Lines */}
        <line x1="28" y1="20" x2="98%" y2="20" className="circuit-edge-line" />
        <line x1="28" y1="calc(100% - 20px)" x2="98%" y2="calc(100% - 20px)" className="circuit-edge-line" />
        <line x1="28" y1="20" x2="28" y2="calc(100% - 20px)" className="circuit-edge-line" />
        <line x1="98%" y1="20" x2="98%" y2="calc(100% - 20px)" className="circuit-edge-line" />

        {/* Top-Left Corner Bracket */}
        <path d="M 20 38 L 20 20 L 38 20" className="circuit-chevron-line" />
        {/* Top-Right Corner Bracket */}
        <path d="M calc(98% - 18px) 20 L 98% 20 L 98% 38" className="circuit-chevron-line" />
        {/* Bottom-Left Corner Bracket */}
        <path d="M 20 calc(100% - 38px) L 20 calc(100% - 20px) L 38 calc(100% - 20px)" className="circuit-chevron-line" />
        {/* Bottom-Right Corner Bracket */}
        <path d="M calc(98% - 18px) calc(100% - 20px) L 98% calc(100% - 20px) L 98% calc(100% - 38px)" className="circuit-chevron-line" />
      </svg>
    </div>
  );
};

const titleLines = [
  { words: ['Find', 'the', 'Best'] },
  { words: ['Forex', 'Broker'] },
  { words: ['for', 'a', 'Smarter', 'Tomorrow'], accentIndexStart: 2 },
];

const descText = 'Unbiased broker reviews, real spread monitoring, and tier-1 regulatory verification to safeguard your trading capital.';

const Home = ({ theme = 'dark', heroComplete = false, onTitleComplete }) => {
  const [complete, setComplete] = useState(heroComplete);

  useEffect(() => {
    const timer = setTimeout(() => {
      setComplete(true);
      if (onTitleComplete) onTitleComplete();
    }, 900);
    return () => clearTimeout(timer);
  }, [onTitleComplete]);

  let runningChar = 0;
  let runningDescChar = 0;

  return (
    <main className="pipwise-home-page">
      {/* Hero Section */}
      <section className="pipwise-hero">
        {/* Radial Ambient Glow */}
        <div className="pipwise-hero-bg-glow" aria-hidden="true" />

        {/* Interactive Spring Physics Dot Grid Layer */}
        <div className="pipwise-dots-bg-container" aria-hidden="true">
          <InteractiveDotGrid theme={theme} />
        </div>

        {/* Sheryians-Style Geometric Frame Lines Layer */}
        <GeometricFrameLines />

        {/* Main Content Container */}
        <div className="pipwise-hero-container">
          <div className="pipwise-hero-grid">
            {/* Left Column: Headline, Description, CTAs, Stats */}
            <div className="pipwise-hero-left">
              <span className="pipwise-hero-eyebrow">VERIFIED BROKER DIRECTORY</span>

              <h1 className="pipwise-hero-title">
                {titleLines.map((line, lIdx) => (
                  <span key={lIdx} className="pipwise-hero-title-line">
                    {line.words.map((word, wIdx) => {
                      const isAccent = line.accentIndexStart !== undefined && wIdx >= line.accentIndexStart;
                      const letters = word.split('').map((char, cIdx) => {
                        const idx = runningChar++;
                        return (
                          <span
                            key={cIdx}
                            className="hero-wave-letter"
                            style={{ animationDelay: `${idx * 0.03}s` }}
                          >
                            {char}
                          </span>
                        );
                      });

                      return (
                        <span
                          key={wIdx}
                          className={`pipwise-hero-word ${isAccent ? 'accent-green' : ''}`}
                        >
                          {letters}
                        </span>
                      );
                    })}
                  </span>
                ))}
              </h1>

              <p className="pipwise-hero-desc">
                {descText.split(' ').map((word, wIdx) => (
                  <span key={wIdx} className="desc-wave-word">
                    {word.split('').map((char, cIdx) => {
                      const idx = runningDescChar++;
                      return (
                        <span
                          key={cIdx}
                          className="desc-wave-letter"
                          style={{
                            opacity: complete ? undefined : 0,
                            animationDelay: `${idx * 0.012}s`,
                          }}
                        >
                          {char}
                        </span>
                      );
                    })}
                  </span>
                ))}
              </p>

              {/* Action Buttons */}
              <div className="pipwise-cta-group">
                <button className="pipwise-btn-primary">
                  <span className="login-wave-text">
                    {'Explore Brokers'.split('').map((c, i) => (
                      <span key={i} className="wave-letter" style={{ animationDelay: `${i * 0.02}s` }}>
                        {c === ' ' ? '\u00A0' : c}
                      </span>
                    ))}
                  </span>
                  <svg
                    className="btn-arrow-icon"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </button>

                <button className="pipwise-btn-secondary">
                  <span className="login-wave-text">
                    {'Compare All'.split('').map((c, i) => (
                      <span key={i} className="wave-letter" style={{ animationDelay: `${i * 0.02}s` }}>
                        {c === ' ' ? '\u00A0' : c}
                      </span>
                    ))}
                  </span>
                </button>
              </div>

              {/* Stats Row with Transparent Icon Backgrounds */}
              <div className="pipwise-stats-row">
                <div className="stat-item">
                  <div className="stat-icon-wrapper">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="8" />
                      <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                  </div>
                  <div className="stat-content">
                    <span className="stat-value">450+</span>
                    <span className="stat-label">Brokers Reviewed</span>
                  </div>
                </div>

                <div className="stat-item">
                  <div className="stat-icon-wrapper">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                  </div>
                  <div className="stat-content">
                    <span className="stat-value">100%</span>
                    <span className="stat-label">Free & Unbiased</span>
                  </div>
                </div>

                <div className="stat-item">
                  <div className="stat-icon-wrapper">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  </div>
                  <div className="stat-content">
                    <span className="stat-value">4.9/5</span>
                    <span className="stat-label">User Rating</span>
                  </div>
                </div>

                <div className="stat-item">
                  <div className="stat-icon-wrapper">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                    </svg>
                  </div>
                  <div className="stat-content">
                    <span className="stat-value">24/7</span>
                    <span className="stat-label">Live Spreads</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Center Column: 3D Globe with Floating Cards & Badges */}
            <div className="pipwise-hero-center">
              <div className="globe-wrapper">
                <div className="globe-ambient-glow" />

                {/* Globe Image with Pure GPU 60fps Entrance */}
                <img
                  src="/forex_globe_web_300kb.webp"
                  alt="Interactive Forex Globe"
                  className="globe-image"
                  fetchPriority="high"
                  loading="eager"
                  decoding="async"
                />

                {/* Handwritten Annotation & Arrow */}
                <div className="handwritten-annotation">
                  <span className="handwritten-text">
                    Trusted by 50,000+ traders
                    <span className="handwriting-cursor" />
                  </span>
                  <svg
                    className="handwritten-arrow-svg"
                    viewBox="0 0 54 48"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M 6 6 Q 22 28 42 32 M 30 26 L 42 32 L 38 42" />
                  </svg>
                </div>

                {/* Floating Market Card - EUR/USD */}
                <div className="market-card-eurusd">
                  <div className="market-card-header">
                    <span className="market-pair-title">EUR / USD</span>
                    <span className="market-arrow-btn">↗</span>
                  </div>
                  <div className="market-price-val">1.0894</div>
                  <div className="market-change-badge">+0.32% Today</div>
                  <svg className="sparkline-svg" viewBox="0 0 160 38" fill="none">
                    <path
                      d="M 0 32 Q 35 12 70 24 T 120 10 T 160 6"
                      stroke="var(--brand-green)"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>

                {/* Floating Market Card - Gold */}
                <div className="market-card-gold">
                  <div className="market-card-header">
                    <span className="market-pair-title">XAU / USD · Gold</span>
                    <span className="market-arrow-btn">↗</span>
                  </div>
                  <div className="market-price-val">2,384.50</div>
                  <div className="market-change-badge">+1.18% Today</div>
                  <svg className="sparkline-svg" viewBox="0 0 180 38" fill="none">
                    <path
                      d="M 0 34 Q 40 26 80 16 T 140 18 T 180 4"
                      stroke="var(--brand-green)"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>

                {/* Location Badges on Globe */}
                <div className="globe-location-badge badge-london">
                  <span className="location-pin-icon">●</span>
                  <div className="location-info">
                    <span className="location-city">London</span>
                    <span className="location-desc">LSE Active</span>
                  </div>
                </div>

                <div className="globe-location-badge badge-tokyo">
                  <span className="location-pin-icon">●</span>
                  <div className="location-info">
                    <span className="location-city">Tokyo</span>
                    <span className="location-desc">TSE Active</span>
                  </div>
                </div>

                <div className="globe-location-badge badge-sydney">
                  <span className="location-pin-icon">●</span>
                  <div className="location-info">
                    <span className="location-city">Sydney</span>
                    <span className="location-desc">ASX Active</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Transparency Card & Social Proof */}
            <div className="pipwise-hero-right">
              <div className="transparency-card">
                <h3 className="transparency-title">100% Transparent Review System</h3>
                <div className="green-accent-line" />

                <div className="transparency-points">
                  <div className="transparency-point">
                    <span style={{ color: 'var(--brand-green)', fontWeight: 700 }}>✓</span>
                    <span>Zero Paid Broker Rankings</span>
                  </div>
                  <div className="transparency-point">
                    <span style={{ color: 'var(--brand-green)', fontWeight: 700 }}>✓</span>
                    <span>Verified Withdrawal Proof</span>
                  </div>
                  <div className="transparency-point">
                    <span style={{ color: 'var(--brand-green)', fontWeight: 700 }}>✓</span>
                    <span>Tier-1 Regulation Checked</span>
                  </div>
                  <div className="transparency-point">
                    <span style={{ color: 'var(--brand-green)', fontWeight: 700 }}>✓</span>
                    <span>Live Execution Spreads</span>
                  </div>
                </div>

                {/* Social Proof Avatars */}
                <div className="social-proof-section">
                  <div className="avatar-stack-group">
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                      alt="Trader"
                      className="trader-avatar"
                    />
                    <img
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
                      alt="Trader"
                      className="trader-avatar"
                    />
                    <img
                      src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80"
                      alt="Trader"
                      className="trader-avatar"
                    />
                    <span className="avatar-badge-count">+45k</span>
                  </div>
                  <span className="social-proof-text">Traders joined this month</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Trusted Brokers Infinite Marquee Strip */}
      <TrustedBrokersMarquee />

      {/* Interactive Robot Companions Squad */}
      <section className="pipwise-robot-squad-section" aria-label="Interactive Companions Squad">
        <div className="pipwise-robot-squad-container">
          <InteractiveRobot />
        </div>
      </section>

      {/* 3. Top Forex Brokers Cards Carousel */}
      <TopForexBrokers />

      {/* 4. Broker Comparison Banner */}
      <BrokerComparisonBanner />

      {/* 5. Dual Marquee Testimonials */}
      <Testimonials />

      {/* 6. PipWise Footer */}
      <Footer />
    </main>
  );
};

export default Home;
