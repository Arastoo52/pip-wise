import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';

const bouncySpring = {
  type: 'spring',
  stiffness: 280,
  damping: 17,
  mass: 0.75,
};

const DockNavLink = ({ link, mouseX }) => {
  const ref = useRef(null);

  const distance = useTransform(mouseX, (val) => {
    if (!ref.current || val === Infinity || typeof val !== 'number') return 1000;
    const bounds = ref.current.getBoundingClientRect();
    return val - (bounds.x + bounds.width / 2);
  });

  // macOS Dock magnification: hovered link scales to 1.25x, immediate neighbor to ~1.12x, farther to 1.0x
  const scaleSync = useTransform(distance, [-110, 0, 110], [1, 1.25, 1]);
  // Subtle lift matching macOS dock
  const ySync = useTransform(distance, [-110, 0, 110], [0, -3.5, 0]);

  const scale = useSpring(scaleSync, {
    mass: 0.1,
    stiffness: 240,
    damping: 16,
  });

  const y = useSpring(ySync, {
    mass: 0.1,
    stiffness: 240,
    damping: 16,
  });

  return (
    <motion.li
      ref={ref}
      className="nav-link-item"
      style={{
        scale,
        y,
        transformOrigin: 'center center',
      }}
    >
      <a href={link.href}>
        <span>{link.label}</span>
        <svg
          className="nav-chevron-icon"
          width="9"
          height="9"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </a>
    </motion.li>
  );
};

const Nav = ({ theme, toggleTheme, heroComplete = false }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isNavHovered, setIsNavHovered] = useState(false);
  const linksMouseX = useMotionValue(Infinity);
  const navRef = useRef(null);
  const searchInputRef = useRef(null);

  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && searchOpen) {
        setSearchOpen(false);
      }
    };
    const handleClickOutside = (e) => {
      if (searchOpen && navRef.current && !navRef.current.contains(e.target)) {
        setSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [searchOpen]);

  const handleMouseMove = (e) => {
    if (!navRef.current) return;
    const rect = navRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    navRef.current.style.setProperty('--mouse-x', `${x}px`);
    navRef.current.style.setProperty('--mouse-y', `${y}px`);
  };

  const handleMouseEnter = (e) => {
    setIsNavHovered(true);
    if (!navRef.current) return;
    const rect = navRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    navRef.current.style.setProperty('--mouse-x', `${x}px`);
    navRef.current.style.setProperty('--mouse-y', `${y}px`);
    navRef.current.style.setProperty('--spotlight-opacity', '1');
  };

  const handleMouseLeave = () => {
    setIsNavHovered(false);
    if (!navRef.current) return;
    navRef.current.style.setProperty('--spotlight-opacity', '0');
  };

  const [isScrolled, setIsScrolled] = useState(false);
  const lastScrollYRef = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = Math.max(0, window.scrollY);
      const diff = currentScrollY - lastScrollYRef.current;

      // At top of page: always full size
      if (currentScrollY <= 30) {
        setIsScrolled(false);
      } else if (diff > 4) {
        // Scrolling DOWN -> shrink smoothly
        setIsScrolled(true);
      } else if (diff < -4) {
        // Scrolling UP (even slightly!) -> expand back to full original shape
        setIsScrolled(false);
      }

      lastScrollYRef.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const [waveKey, setWaveKey] = useState(0);

  const triggerLoginWave = () => {
    setWaveKey((prev) => prev + 1);
  };

  const navLinks = [
    { label: 'Brokers', href: '#brokers' },
    { label: 'Reviews', href: '#reviews' },
    { label: 'Comparisons', href: '#comparisons' },
    { label: 'About', href: '#about' },
  ];

  const baseMaxWidth = isScrolled ? 835 : 945;
  const hoveredMaxWidth = isScrolled ? 895 : 1015;
  const searchMaxWidth = isScrolled ? 990 : 1080;
  const searchHoverMaxWidth = isScrolled ? 1030 : 1110;

  const targetMaxWidth = searchOpen
    ? (isNavHovered ? searchHoverMaxWidth : searchMaxWidth)
    : (isNavHovered ? hoveredMaxWidth : baseMaxWidth);

  return (
    <header className={`pipwise-nav-floating-wrapper ${isScrolled ? 'is-scrolled' : ''}`}>
      <motion.nav
        ref={navRef}
        className={`pipwise-nav-floating-bar ${searchOpen ? 'is-search-expanded' : ''} ${isScrolled ? 'is-scrolled' : ''}`}
        aria-label="Main Navigation"
        initial={{
          clipPath: 'inset(0 50% 0 50% round 14px)',
          opacity: 0,
          y: -10,
          maxWidth: 945,
        }}
        animate={
          heroComplete
            ? {
              clipPath: 'inset(0 0% 0 0% round 14px)',
              opacity: 1,
              y: 0,
              maxWidth: targetMaxWidth,
            }
            : {
              clipPath: 'inset(0 50% 0 50% round 14px)',
              opacity: 0,
              y: -10,
              maxWidth: 945,
            }
        }
        transition={{
          maxWidth: {
            type: 'spring',
            stiffness: 240,
            damping: 24,
            mass: 0.6,
          },
          clipPath: {
            duration: 0.85,
            ease: [0.16, 1, 0.3, 1],
          },
          opacity: { duration: 0.5 },
          y: { duration: 0.5 },
        }}
        onAnimationComplete={() => {
          if (heroComplete && navRef.current) {
            navRef.current.style.clipPath = 'none';
          }
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Sharp Shiny Border Line Following Mouse */}
        <div className="pipwise-nav-shiny-top-line" aria-hidden="true" />
        <div className="pipwise-nav-shiny-border-line" aria-hidden="true" />

        {/* PipWise Custom Brand: 3 Candlestick bars + PipWise Text */}
        <motion.a
          href="/"
          className="pipwise-logo-brand"
          aria-label="PipWise Home"
          initial={{ opacity: 0, x: -16 }}
          animate={heroComplete ? { opacity: 1, x: 0 } : { opacity: 0, x: -16 }}
          transition={{ duration: 0.55, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="pipwise-candles" aria-hidden="true">
            <span className="candle-bar candle-bar-1" />
            <span className="candle-bar candle-bar-2" />
            <span className="candle-bar candle-bar-3" />
          </div>
          <span className="pipwise-logo-text">PipWise</span>
        </motion.a>

        {/* Center Nav Links with macOS Dock Magnification using Framer Motion */}
        <motion.ul
          className="pipwise-nav-links"
          onMouseMove={(e) => linksMouseX.set(e.clientX)}
          onMouseLeave={() => linksMouseX.set(Infinity)}
          initial={{ opacity: 0, y: -6 }}
          animate={heroComplete ? { opacity: 1, y: 0 } : { opacity: 0, y: -6 }}
          transition={{ duration: 0.5, delay: 0.26, ease: [0.16, 1, 0.3, 1] }}
        >
          {navLinks.map((link) => (
            <DockNavLink key={link.label} link={link} mouseX={linksMouseX} />
          ))}
        </motion.ul>

        {/* Right Section: Search Icon, Theme Toggle, Login, Get Started */}
        <motion.div
          className="pipwise-nav-right"
          initial={{ opacity: 0, x: 16 }}
          animate={heroComplete ? { opacity: 1, x: 0 } : { opacity: 0, x: 16 }}
          transition={{ duration: 0.55, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Expanding Inline Search Bar extending to the Left with Bouncy Spring Animation */}
          {/* Unified Expanding Search Bar - 0ms instant trigger & simultaneous spring with navbar */}
          <div className="pipwise-search-pill-wrapper">
            <motion.div
              className={`pipwise-inline-search-pill ${searchOpen ? 'is-open' : 'is-closed'}`}
              animate={{
                width: searchOpen ? 256 : 36,
              }}
              transition={bouncySpring}
              whileTap={!searchOpen ? { scale: 0.92 } : undefined}
              onClick={() => {
                if (!searchOpen) setSearchOpen(true);
              }}
            >
              <button
                type="button"
                className="search-pill-icon-btn"
                onClick={() => {
                  if (!searchOpen) setSearchOpen(true);
                }}
                aria-label="Search"
                title={searchOpen ? '' : 'Search (Click to open)'}
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
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </button>

              <motion.div
                className="search-pill-expand-content"
                initial={false}
                animate={{
                  opacity: searchOpen ? 1 : 0,
                  x: searchOpen ? 0 : 8,
                }}
                transition={{
                  duration: searchOpen ? 0.22 : 0.1,
                  ease: 'easeOut',
                }}
                style={{
                  pointerEvents: searchOpen ? 'auto' : 'none',
                }}
              >
                <input
                  ref={searchInputRef}
                  type="text"
                  className="pipwise-inline-search-input"
                  placeholder="Search brokers, reviews..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  tabIndex={searchOpen ? 0 : -1}
                />

                <div className="search-pill-actions">
                  {searchQuery ? (
                    <button
                      type="button"
                      className="inline-search-clear-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSearchQuery('');
                        searchInputRef.current?.focus();
                      }}
                      aria-label="Clear query"
                      title="Clear query"
                    >
                      <svg
                        width="9"
                        height="9"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  ) : (
                    <span className="search-pill-kbd-badge" title="Press Escape to close">
                      ESC
                    </span>
                  )}

                  <button
                    type="button"
                    className="inline-search-close-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSearchOpen(false);
                      setSearchQuery('');
                    }}
                    aria-label="Close search"
                    title="Close search"
                  >
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Theme Toggle Button */}
          <button
            type="button"
            className="pipwise-icon-btn pipwise-theme-btn"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
          >
            {theme === 'dark' ? (
              /* Sun icon */
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            ) : (
              /* Sun/Ray icon */
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="4" r="4" />
                <path d="M12 2v2" />
                <path d="M12 20v2" />
                <path d="m4.93 4.93 1.41 1.41" />
                <path d="m17.66 17.66 1.41 1.41" />
                <path d="M2 12h2" />
                <path d="M20 12h2" />
                <path d="m6.34 17.66-1.41 1.41" />
                <path d="m19.07 4.93-1.41 1.41" />
              </svg>
            )}
          </button>

          {/* Login Button: Dark rounded container with letter wave on click */}
          <button
            type="button"
            className="pipwise-floating-login-btn"
            onClick={triggerLoginWave}
            aria-label="Log in"
          >
            <span key={waveKey} className="login-wave-text">
              {'Log in'.split('').map((char, index) => (
                <span
                  key={index}
                  className={`wave-letter ${waveKey > 0 ? 'is-animating' : ''}`}
                  style={{ animationDelay: `${index * 0.035}s` }}
                >
                  {char === ' ' ? '\u00A0' : char}
                </span>
              ))}
            </span>
          </button>

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            className="mobile-nav-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {mobileMenuOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              ) : (
                <>
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </>
              )}
            </svg>
          </button>
        </motion.div>
      </motion.nav>


      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="pipwise-floating-mobile-menu">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="mobile-nav-link"
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <div className="mobile-nav-btns">
            <button
              type="button"
              className="pipwise-floating-login-btn"
              style={{ width: '100%' }}
              onClick={triggerLoginWave}
            >
              <span key={`mobile-${waveKey}`} className="login-wave-text">
                {'Log in'.split('').map((char, index) => (
                  <span
                    key={index}
                    className={`wave-letter ${waveKey > 0 ? 'is-animating' : ''}`}
                    style={{ animationDelay: `${index * 0.035}s` }}
                  >
                    {char === ' ' ? '\u00A0' : char}
                  </span>
                ))}
              </span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Nav;
