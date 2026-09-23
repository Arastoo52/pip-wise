import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  CheckCircle2,
  TrendingUp,
  Activity,
  ShieldCheck,
  Zap,
  Globe,
  BarChart3,
  Award,
  SlidersHorizontal,
  Wifi,
  BatteryCharging
} from 'lucide-react';

// Official SVG Logos for the 3 Brokers
const CompXM_Logo = () => (
  <svg viewBox="0 0 92 26" height="15" className="mac-broker-logo-svg" aria-label="XM">
    <path
      d="M2.5 19.5L7.2 4.5l4.8 5.8-2.2 2.4 3.8 5.8h-4.2l-2.1-3.5-2 3.5H2.5zm6.7-9.2L7.3 7 4.7 15.2h2.3l2.2-4.9z"
      fill="#e11d48"
    />
    <path
      d="M21 5h5.1l4.2 6.2 4.2-6.2h5.1l-6.8 9.5 7.1 9.9H35l-4.5-6.7-4.5 6.7H21l7.1-9.9L21 5z"
      fill="#ffffff"
    />
    <path
      d="M42 5h5l5.3 9.1L57.6 5h5v19.4h-4.2v-13l-4.8 8h-2.6l-4.8-8v13H42V5z"
      fill="#ffffff"
    />
  </svg>
);

const CompExness_Logo = () => (
  <svg viewBox="0 0 115 26" height="14" className="mac-broker-logo-svg" aria-label="Exness">
    <g transform="translate(1, 3.5)">
      <path
        d="M13.2 2.8a5.2 5.2 0 0 0-4 1.9L4.6 9a5.2 5.2 0 0 0 0 7.4 5.2 5.2 0 0 0 7.4 0l3.6-4.1a5.2 5.2 0 0 0 0-7.4 5.2 5.2 0 0 0-2.4-2.1zm-3.6 8.4l3.6-4.1a2.3 2.3 0 0 1 3.3 3.3l-3.6 4.1a2.3 2.3 0 0 1-3.3-3.3z"
        fill="#f59e0b"
        opacity="0.95"
      />
      <path
        d="M18.8 15.8a5.2 5.2 0 0 0 4-1.9l4.6-4.3a5.2 5.2 0 0 0-7.4-7.4l-3.6 4.1a5.2 5.2 0 0 0 0 7.4 5.2 5.2 0 0 0 2.4 2.1zm3.6-8.4l-3.6 4.1a2.3 2.3 0 0 1-3.3-3.3l3.6-4.1a2.3 2.3 0 0 1 3.3 3.3z"
        fill="#eab308"
      />
    </g>
    <text x="35" y="18.5" fontFamily="system-ui, -apple-system, sans-serif" fontSize="16" fontWeight="700" letterSpacing="-0.5px" fill="#ffffff">
      exness
    </text>
  </svg>
);

const CompICMarkets_Logo = () => (
  <svg viewBox="0 0 130 26" height="15" className="mac-broker-logo-svg" aria-label="IC Markets">
    <rect x="1" y="13.5" width="3.5" height="9.5" rx="1.7" fill="#10b981" />
    <rect x="7" y="8" width="3.5" height="15" rx="1.7" fill="#10b981" />
    <rect x="13" y="3.5" width="3.5" height="19.5" rx="1.7" fill="#059669" />
    <text x="23" y="18.5" fontFamily="system-ui, -apple-system, sans-serif" fontSize="15" fontWeight="800" letterSpacing="-0.4px" fill="#ffffff">
      IC Markets
    </text>
  </svg>
);

const criteriaList = [
  { label: 'Min Deposit', icon: Zap },
  { label: 'EUR/USD Spread', icon: Activity },
  { label: 'Max Leverage', icon: TrendingUp },
  { label: 'Regulation', icon: ShieldCheck },
];

export default function BrokerComparisonDashboard() {
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [activeBroker, setActiveBroker] = useState('Exness');

  return (
    <div className="mac-screen-container">
      {/* 1. macOS Top Menu Bar */}
      <div className="mac-menubar">
        <div className="mac-menubar-left">
          <div className="mac-traffic-lights">
            <span className="traffic-light red" />
            <span className="traffic-light yellow" />
            <span className="traffic-light green" />
          </div>
          <span className="mac-app-name"> PipWise Broker Suite</span>
          <span className="mac-menu-item hidden sm:inline">Compare</span>
          <span className="mac-menu-item hidden md:inline">Spreads</span>
          <span className="mac-menu-item hidden md:inline">Audit</span>
        </div>

        <div className="mac-menubar-right">
          <div className="mac-live-pill">
            <span className="live-pulse-dot" />
            <span>LIVE 60 FPS</span>
          </div>
          <Wifi size={11} className="text-white/70" />
          <div className="flex items-center gap-1">
            <span>100%</span>
            <BatteryCharging size={11} className="text-emerald-400" />
          </div>
          <span className="font-semibold text-white/90">10:14 AM</span>
        </div>
      </div>

      {/* 2. Main Screen Workspace */}
      <div className="mac-screen-body">
        {/* Top Header Strip with Filters */}
        <div className="mac-board-header">
          <div className="mac-board-title">
            <span>Live Side-by-Side Comparison</span>
            <span className="mac-badge-verified">Verified 2026</span>
          </div>

          <div className="mac-filter-pills">
            {['All', 'Raw Spread', 'Lowest Deposit'].map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setSelectedFilter(f)}
                className={`mac-filter-pill ${selectedFilter === f ? 'active' : ''}`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* 3. The 4-Column Comparison Matrix (Criteria + 3 Brokers) */}
        <div className="mac-comparison-matrix">
          {/* Criteria Column */}
          <div className="mac-matrix-labels">
            <div className="mac-matrix-spacer" />
            {criteriaList.map((crit) => (
              <div key={crit.label} className="mac-matrix-label-cell">
                <span>{crit.label}</span>
              </div>
            ))}
          </div>

          {/* Broker 1: XM */}
          <div
            className={`mac-matrix-broker ${activeBroker === 'XM' ? 'highlighted' : ''}`}
            onClick={() => setActiveBroker('XM')}
          >
            <div className="mac-broker-head">
              <CompXM_Logo />
              <div className="mac-broker-stars">
                <span>★</span>
                <span>4.8</span>
              </div>
            </div>
            <div className="mac-matrix-val-cell val-cyan">$5</div>
            <div className="mac-matrix-val-cell">0.6 pips</div>
            <div className="mac-matrix-val-cell">1:1000</div>
            <div className="mac-matrix-val-cell val-reg">FCA, ASIC</div>
          </div>

          {/* Broker 2: Exness (Featured Recommended) */}
          <div
            className={`mac-matrix-broker ${activeBroker === 'Exness' ? 'highlighted' : ''}`}
            onClick={() => setActiveBroker('Exness')}
          >
            <div className="mac-broker-head">
              <CompExness_Logo />
              <div className="mac-broker-stars">
                <span>★</span>
                <span>4.6</span>
              </div>
            </div>
            <div className="mac-matrix-val-cell val-cyan">$10</div>
            <div className="mac-matrix-val-cell val-green">0.0 pips</div>
            <div className="mac-matrix-val-cell val-green">1:Unlimited</div>
            <div className="mac-matrix-val-cell val-reg">CySEC, FCA</div>
          </div>

          {/* Broker 3: IC Markets */}
          <div
            className={`mac-matrix-broker ${activeBroker === 'IC Markets' ? 'highlighted' : ''}`}
            onClick={() => setActiveBroker('IC Markets')}
          >
            <div className="mac-broker-head">
              <CompICMarkets_Logo />
              <div className="mac-broker-stars">
                <span>★</span>
                <span>4.7</span>
              </div>
            </div>
            <div className="mac-matrix-val-cell">$200</div>
            <div className="mac-matrix-val-cell val-green">0.0 pips</div>
            <div className="mac-matrix-val-cell">1:500</div>
            <div className="mac-matrix-val-cell val-reg">MT4, cTrader</div>
          </div>
        </div>

        {/* Live Sparkline Feed Banner inside Screen */}
        <div className="mac-mini-ticker-bar" style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '8px',
          padding: '4px 8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '8px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ color: '#fc5d21', fontWeight: 800 }}>● EUR/USD</span>
            <span style={{ color: '#ffffff', fontWeight: 700 }}>1.0894</span>
            <span style={{ color: '#00d674' }}>+0.32%</span>
          </div>
          <div style={{ color: 'rgba(255,255,255,0.6)', fontStyle: 'italic' }}>
            Zero-Spread Execution Verified
          </div>
        </div>
      </div>

      {/* 4. Bottom macOS Floating Dock */}
      <div className="mac-dock-wrapper">
        <div className="mac-dock">
          <div
            className="mac-dock-item"
            style={{ background: 'linear-gradient(135deg, #fc5d21, #db4004)' }}
            title="Broker Comparison Matrix"
          >
            <BarChart3 size={13} />
            <span className="dock-dot" />
          </div>

          <div
            className="mac-dock-item"
            style={{ background: 'linear-gradient(135deg, #0284c7, #0369a1)' }}
            title="Live Spreads"
          >
            <Activity size={13} />
          </div>

          <div
            className="mac-dock-item"
            style={{ background: 'linear-gradient(135deg, #059669, #047857)' }}
            title="Regulation Check"
          >
            <ShieldCheck size={13} />
          </div>

          <div
            className="mac-dock-item"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)' }}
            title="Global Directory"
          >
            <Globe size={13} />
          </div>
        </div>
      </div>
    </div>
  );
}
