import React from 'react';
import { motion } from 'framer-motion';
import { Star, CheckCircle2, Heart } from 'lucide-react';

const topRowReviews = [
  {
    name: 'Mohd Siraj',
    role: 'Funded Scalper & Active Trader',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    rating: '5.0',
    review: 'PipWise made choosing a broker effortless. The raw spread comparison between IC Markets and Exness saved me over $400 a month in trading commissions. Indispensable tool!'
  },
  {
    name: 'Dr. Mukti Prasad Dash',
    role: 'Portfolio Manager & Swing Trader',
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80',
    rating: '4.9',
    review: 'The regulatory license verification and overnight swap fee transparency on PipWise are incredible. It gives me complete confidence knowing my capital is with Tier-1 regulated brokers.'
  },
  {
    name: 'Pradum Kumar',
    role: 'Day Trader (EUR/USD, XAU/USD)',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    rating: '4.8',
    review: 'I used to trade with an offshore broker suffering massive slippage. PipWise’s live execution speed benchmarks directed me to Pepperstone. Night and day difference!'
  },
  {
    name: 'Ananya Deshmukh',
    role: 'Algorithmic & EA Strategy Trader',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    rating: '5.0',
    review: 'Ultra-low MT5 VPS execution latency was non-negotiable for my algorithmic bots. PipWise’s latency testing data was 100% accurate. Saved me months of costly trial and error.'
  },
  {
    name: 'Vikramaditya Sen',
    role: 'Prop Desk Trading Lead',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    rating: '4.9',
    review: 'Our trading desk cross-checks every broker with PipWise before allocating live funds. Timely withdrawal records, FCA/CySEC audit notes, and honest ratings make them our go-to.'
  },
  {
    name: 'Sneha Roy',
    role: 'Retail Forex Trader',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    rating: '5.0',
    review: 'Clean side-by-side comparison, real trader reviews, and zero deceptive marketing. Finding a broker with $10 minimum deposit and instant local deposits was smooth and hassle-free.'
  }
];

const bottomRowReviews = [
  {
    name: 'Akash Warade',
    role: 'High-Frequency FX Trader',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    rating: '4.9',
    review: 'Whenever someone asks about broker withdrawal speeds, PipWise is the first portal I send them. They test the exact metrics brokers usually hide. Pure respect for their team!'
  },
  {
    name: 'Pragati Nayak',
    role: 'Price Action Mentor & Trader',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    rating: '5.0',
    review: 'I advise every beginner in my trading mentorship group to first compare broker spreads on PipWise. Genuine transparency and safety save you from catastrophic blow-ups.'
  },
  {
    name: 'Samarth Jain',
    role: 'Forex Community Lead',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80',
    rating: '4.8',
    review: '100% transparent and reliable. Comparing spread costs during high-impact news like CPI and NFP gave me realistic expectations. Knowing your broker is safe brings true peace of mind.'
  },
  {
    name: 'Ritu & Sanjay Joshi',
    role: 'Private Wealth & Multi-Asset Investors',
    avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150&auto=format&fit=crop&q=80',
    rating: '5.0',
    review: 'We evaluate multi-asset brokers with PipWise. The side-by-side view showing leverage limits, Tier-1 regulation (FCA, ASIC), and client fund segregation is brilliantly implemented.'
  },
  {
    name: 'Karan Malhotra',
    role: 'Macro & News Trader',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    rating: '4.9',
    review: 'During emergency volatility spikes, execution speed and slippage protection are everything. PipWise’s detailed broker breakdowns give you the honest, unedited truth.'
  },
  {
    name: 'Meera Iyer',
    role: 'Automated Strategy Specialist',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    rating: '5.0',
    review: 'A genuinely honest review platform doing groundbreaking work. Their comprehensive broker fee calculator and raw spread analyses are unmatched anywhere in the industry.'
  }
];

// Single Testimonial Card Component
const TestimonialCard = ({ item }) => (
  <div className="pw-testimonial-card">
    <div className="pw-testimonial-body">
      {/* Card Header: Avatar, Name & Role */}
      <div className="pw-testimonial-header">
        <div className="pw-testimonial-avatar-wrap">
          <img
            src={item.avatar}
            alt={item.name}
            loading="lazy"
            className="pw-testimonial-avatar"
          />
          <div className="pw-testimonial-check-badge">
            <CheckCircle2 size={12} className="pw-check-icon" />
          </div>
        </div>
        <div className="pw-testimonial-user-meta">
          <h4 className="pw-testimonial-user-name">{item.name}</h4>
          <span className="pw-testimonial-user-role">{item.role}</span>
        </div>
      </div>

      {/* Star Rating */}
      <div className="pw-testimonial-rating-row">
        <span className="pw-rating-score">{item.rating}</span>
        <div className="pw-stars-cluster" aria-label={`${item.rating} out of 5 stars`}>
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={13} className="pw-star-icon" />
          ))}
        </div>
      </div>

      {/* Review Quote Text */}
      <p className="pw-testimonial-quote-text">
        "{item.review}"
      </p>
    </div>

    {/* Footer Verified Badge */}
    <div className="pw-testimonial-footer">
      <span className="pw-verified-tag">
        <Heart size={11} className="pw-heart-icon" /> Verified Trader
      </span>
      <span className="pw-supporter-tag">PipWise Community</span>
    </div>
  </div>
);

const Testimonials = () => {
  return (
    <section id="testimonials" className="pw-testimonials-section" aria-label="Trader Testimonials">
      {/* Header Content */}
      <div className="pw-testimonials-header-container">
        {/* Figma Selection Style Badge with Green Border & 4 Corner Resize Handles */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="pw-figma-badge"
        >
          {/* 4 Corner White Resize Handle Squares */}
          <span className="pw-handle-dot pw-h-tl" aria-hidden="true" />
          <span className="pw-handle-dot pw-h-tr" aria-hidden="true" />
          <span className="pw-handle-dot pw-h-bl" aria-hidden="true" />
          <span className="pw-handle-dot pw-h-br" aria-hidden="true" />

          <span className="pw-figma-badge-text">
            HEAR FROM OUR TRADERS & INVESTORS
          </span>
        </motion.div>

        {/* Main Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="pw-testimonials-heading"
        >
          Trade With True Confidence. <br className="pw-br-desktop" />
          Powered By 50,000+ Real Forex Traders.
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="pw-testimonials-subheading"
        >
          Read real experiences from active scalpers, day traders, and fund managers who empower their trading edge with PipWise broker comparisons.
        </motion.p>
      </div>

      {/* Seamless Continuous Dual Marquee */}
      <div className="pw-marquee-wrapper">
        {/* Left and Right Fade Gradient Masks */}
        <div className="pw-marquee-mask pw-mask-left" aria-hidden="true" />
        <div className="pw-marquee-mask pw-mask-right" aria-hidden="true" />

        {/* Row 1: Leftward Marquee (Continuous Loop) */}
        <div className="pw-marquee-row">
          <div className="pw-marquee-track pw-track-left">
            {topRowReviews.map((item, idx) => (
              <TestimonialCard key={`top-1-${idx}`} item={item} />
            ))}
          </div>
          <div className="pw-marquee-track pw-track-left" aria-hidden="true">
            {topRowReviews.map((item, idx) => (
              <TestimonialCard key={`top-2-${idx}`} item={item} />
            ))}
          </div>
        </div>

        {/* Row 2: Rightward Marquee (Continuous Loop) */}
        <div className="pw-marquee-row">
          <div className="pw-marquee-track pw-track-right">
            {bottomRowReviews.map((item, idx) => (
              <TestimonialCard key={`bot-1-${idx}`} item={item} />
            ))}
          </div>
          <div className="pw-marquee-track pw-track-right" aria-hidden="true">
            {bottomRowReviews.map((item, idx) => (
              <TestimonialCard key={`bot-2-${idx}`} item={item} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
