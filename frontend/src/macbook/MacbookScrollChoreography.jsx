import React from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import MacbookBase from './MacbookBase';
import MacbookLid from './MacbookLid';
import BrokerComparisonDashboard from './BrokerComparisonDashboard';
import './Macbook3D.css';

const DoodleArrow = () => (
  <svg viewBox="0 0 48 34" fill="none" className="comp-doodle-arrow" aria-hidden="true">
    <path
      d="M44 26C34 10 18 8 6 18M6 18L13 13M6 18L11 23"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function MacbookScrollChoreography({ scrollContainerRef }) {
  // Track scroll position of the Broker Comparison Banner section
  const { scrollYProgress } = useScroll({
    target: scrollContainerRef,
    offset: ['start end', 'center 45%'],
  });

  // Silky smooth spring physics for 60fps Apple-style mechanical lid feel
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 95,
    damping: 24,
    restDelta: 0.001,
  });

  // Phase 1 (0.05 - 0.88): Smooth 3D Lid Opening
  // Starts flat/closed (-145deg), lifts up smoothly, and stops at -12deg upright facing the user
  const lidAngle = useTransform(smoothProgress, [0.08, 0.85], [-145, -12]);

  // Phase 1.5A (0.0 - 0.22): Front Trackpad Neon Lip Glow
  const trackpadGlow = useTransform(smoothProgress, [0, 0.08, 0.25], [0.65, 1, 0]);

  // Phase 1.5B (0.15 - 0.55): Keyboard Well Underglow
  const keyboardGlow = useTransform(smoothProgress, [0.15, 0.32, 0.65], [0, 1, 0]);

  // Phase 2 (0.2 - 0.6): Screen Power On (Wallpaper & OLED glow)
  const screenPower = useTransform(smoothProgress, [0.2, 0.58], [0, 1]);

  // Phase 3 (0.3 - 0.75): Broker Comparison UI Reveal
  const uiOpacity = useTransform(smoothProgress, [0.28, 0.72], [0, 1]);
  const uiTranslateY = useTransform(smoothProgress, [0.28, 0.72], [22, 0]);

  return (
    <div className="macbook-scroll-wrapper">
      {/* 3D MacBook Assembly */}
      <div className="macbook-assembly">
        {/* Animated 3D Lid & Active Retina Screen */}
        <MacbookLid
          lidAngle={lidAngle}
          screenPower={screenPower}
          uiOpacity={uiOpacity}
          uiTranslateY={uiTranslateY}
        >
          {/* Live Broker Comparison Retina Desktop inside MacBook Screen */}
          <BrokerComparisonDashboard />
        </MacbookLid>

        {/* Midnight Aluminum Keyboard Chassis Base with Trackpad */}
        <MacbookBase
          trackpadGlow={trackpadGlow}
          keyboardGlow={keyboardGlow}
        />
      </div>

      {/* Floating Handwritten Annotation next to MacBook */}
      <div
        style={{
          position: 'absolute',
          top: '20px',
          right: '5px',
          zIndex: 30,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          pointerEvents: 'none',
        }}
      >
        <DoodleArrow />
        <span
          style={{
            fontFamily: 'var(--font-script, cursive)',
            fontSize: '1.2rem',
            color: '#ffffff',
            transform: 'rotate(-4deg)',
            lineHeight: 1.15,
            textAlign: 'center',
            textShadow: '0 1px 4px rgba(0,0,0,0.3)',
          }}
        >
          Make a<br />smarter choice
        </span>
      </div>
    </div>
  );
}
