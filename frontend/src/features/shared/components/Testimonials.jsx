import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import { Star, CheckCircle2, Heart } from 'lucide-react';
import {
  getSynchronousTestimonials,
  fetchActiveTestimonials,
} from '../../testimonials/services/testimonialStorage.js';

// Single Testimonial Card Component (Memoized to prevent redundant card re-renders)
const TestimonialCard = React.memo(({ item }) => (
  <div className="pw-testimonial-card">
    <div className="pw-testimonial-body">
      {/* Card Header: Avatar, Name & Role */}
      <div className="pw-testimonial-header">
        <div className="pw-testimonial-avatar-wrap">
          <img
            src={item.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
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
        <span className="pw-rating-score">{item.rating || '5.0'}</span>
        <div className="pw-stars-cluster" aria-label={`${item.rating || '5.0'} out of 5 stars`}>
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
));

const Testimonials = React.memo(() => {
  // Synchronous initial load guarantees instant render with ZERO re-render flash
  const [items, setItems] = useState(() => getSynchronousTestimonials());
  const itemsRef = useRef(items);
  itemsRef.current = items;

  useEffect(() => {
    let isMounted = true;

    // Check remote backend in background; ONLY update if data actually changed
    fetchActiveTestimonials().then((active) => {
      if (!isMounted || !Array.isArray(active)) return;
      const currentIds = itemsRef.current.map((t) => t._id || t.name).join(',');
      const newIds = active.map((t) => t._id || t.name).join(',');
      if (currentIds !== newIds) {
        setItems(active);
      }
    });

    // Real-time listener: instant synchronous update when admin deletes or resets
    const handleUpdate = () => {
      const fresh = getSynchronousTestimonials();
      setItems(fresh);
    };

    window.addEventListener('pipwise_testimonials_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      isMounted = false;
      window.removeEventListener('pipwise_testimonials_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const topRowReviews = useMemo(() => {
    const list = items.filter((t) => t.row === 'top');
    if (list.length > 0) return list;
    return items.slice(0, Math.ceil(items.length / 2));
  }, [items]);

  const bottomRowReviews = useMemo(() => {
    const list = items.filter((t) => t.row === 'bottom');
    if (list.length > 0) return list;
    return items.slice(Math.ceil(items.length / 2));
  }, [items]);

  // If both rows are empty because admin deleted everything
  if (items.length === 0) {
    return null;
  }

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
        {topRowReviews.length > 0 && (
          <div className="pw-marquee-row">
            <div className="pw-marquee-track pw-track-left">
              {topRowReviews.map((item, idx) => (
                <TestimonialCard key={`top-1-${item._id || item.name || idx}`} item={item} />
              ))}
            </div>
            <div className="pw-marquee-track pw-track-left" aria-hidden="true">
              {topRowReviews.map((item, idx) => (
                <TestimonialCard key={`top-2-${item._id || item.name || idx}`} item={item} />
              ))}
            </div>
          </div>
        )}

        {/* Row 2: Rightward Marquee (Continuous Loop) */}
        {bottomRowReviews.length > 0 && (
          <div className="pw-marquee-row">
            <div className="pw-marquee-track pw-track-right">
              {bottomRowReviews.map((item, idx) => (
                <TestimonialCard key={`bot-1-${item._id || item.name || idx}`} item={item} />
              ))}
            </div>
            <div className="pw-marquee-track pw-track-right" aria-hidden="true">
              {bottomRowReviews.map((item, idx) => (
                <TestimonialCard key={`bot-2-${item._id || item.name || idx}`} item={item} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
});

export default Testimonials;
