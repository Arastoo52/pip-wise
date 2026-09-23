import React, { useState, useEffect, useRef } from 'react';
import './InteractiveRobot.css';

export default function InteractiveRobot({
  activeField = null,
  formStatus = 'idle',
  username = '',
  email = '',
  password = '',
  isTyping = false,
  typingField = null,
}) {
  const [sparkles, setSparkles] = useState([]);
  const containerRef = useRef(null);

  // Pure GPU CSS-variable mouse tracking with lazy rect & visibility culling - ZERO scroll lag
  useEffect(() => {
    let animationFrameId = null;
    let latestE = null;
    let rect = null;
    let isVisible = true;

    const el = containerRef.current;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        isVisible = entry ? entry.isIntersecting : true;
        if (!isVisible) {
          rect = null;
        }
      },
      { rootMargin: '100px 0px 100px 0px', threshold: 0 }
    );

    if (el) {
      observer.observe(el);
    }

    const invalidateRect = () => {
      rect = null;
    };

    window.addEventListener('resize', invalidateRect, { passive: true });
    window.addEventListener('scroll', invalidateRect, { passive: true });

    const handleMouseMove = (e) => {
      if (!isVisible) return;
      latestE = e;
      if (!animationFrameId) {
        animationFrameId = requestAnimationFrame(() => {
          animationFrameId = null;
          const currentEl = containerRef.current;
          if (!currentEl || !latestE || !isVisible) return;
          if (!rect) {
            rect = currentEl.getBoundingClientRect();
          }
          if (!rect || rect.width === 0) return;

          const centerX = rect.left + rect.width * 0.45;
          const centerY = rect.top + rect.height * 0.5;

          const deltaX = latestE.clientX - centerX;
          const deltaY = latestE.clientY - centerY;
          const distance = Math.hypot(deltaX, deltaY);
          const maxDistance = 380;

          const clampedDist = Math.min(distance / maxDistance, 1);
          const angle = Math.atan2(deltaY, deltaX);

          const targetX = Math.cos(angle) * clampedDist * 5.2;
          const targetY = Math.sin(angle) * clampedDist * 3.8;

          // Directly apply CSS variables to the DOM element - NO React virtual DOM diffing!
          currentEl.style.setProperty('--robot-look-x', `${targetX.toFixed(2)}px`);
          currentEl.style.setProperty('--robot-look-y', `${targetY.toFixed(2)}px`);
          currentEl.style.setProperty('--pink-look-x', `${(targetX * 0.85).toFixed(2)}px`);
          currentEl.style.setProperty('--pink-look-y', `${(targetY * 0.85).toFixed(2)}px`);
          currentEl.style.setProperty('--star-look-x', `${(targetX * 0.7).toFixed(2)}px`);
          currentEl.style.setProperty('--star-look-y', `${(targetY * 0.7).toFixed(2)}px`);
          currentEl.style.setProperty('--orange-look-x', `${(targetX * 0.65).toFixed(2)}px`);
          currentEl.style.setProperty('--orange-look-y', `${(targetY * 0.65).toFixed(2)}px`);
          currentEl.style.setProperty('--purple-look-x', `${(targetX * 0.6).toFixed(2)}px`);
          currentEl.style.setProperty('--purple-look-y', `${(targetY * 0.6).toFixed(2)}px`);
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', invalidateRect);
      window.removeEventListener('scroll', invalidateRect);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const [clickMessage, setClickMessage] = useState(null);
  const [bubbleVisible, setBubbleVisible] = useState(false);

  const forexQuotes = [
    "✨ PipWise Squad analyzing top forex brokers!",
    "🛡️ 100% Tier-1 Regulated & Verified Brokers below!",
    "📊 Zero paid rankings, real live spreads monitored!",
    "🎉 XM, Exness & IC Markets tested & approved!",
    "⚡ Compare spreads, leverage & withdrawal speeds!",
  ];

  // Click reaction sparkles
  const handleStageClick = () => {
    const randomQuote = forexQuotes[Math.floor(Math.random() * forexQuotes.length)];
    setClickMessage(randomQuote);
    setBubbleVisible(true);

    const newSparkles = Array.from({ length: 6 }).map((_, i) => ({
      id: Date.now() + i,
      x: 240 + (Math.random() - 0.5) * 240,
      y: 110 + (Math.random() - 0.5) * 100,
      size: 4 + Math.random() * 4,
    }));
    setSparkles(newSparkles);
    setTimeout(() => setSparkles([]), 800);
    setTimeout(() => setBubbleVisible(false), 3500);
  };

  // Interaction & Typing States
  const isPasswordFocused = activeField === 'password' || typingField === 'password';
  const isTypingUsername = isTyping && (typingField === 'username' || activeField === 'username');
  const isTypingEmail = isTyping && (typingField === 'email' || activeField === 'email');
  const isTypingCredentials = isTyping && (isTypingUsername || isTypingEmail);
  const isLookingAtForm = (activeField === 'username' || activeField === 'email') && !isTyping;

  const modeClass = isPasswordFocused
    ? 'password-mode'
    : isTypingCredentials
    ? 'typing-mode'
    : isLookingAtForm
    ? 'form-focused-mode'
    : '';

  return (
    <div
      className={`robot-stage ${modeClass}`}
      ref={containerRef}
      onClick={handleStageClick}
      title="Interactive companions squad"
    >
      {/* Speech / Reaction Bubble */}
      <div className={`robot-bubble ${bubbleVisible || activeField || isTyping || formStatus === 'success' ? 'visible' : ''}`}>
        {clickMessage ? (
          clickMessage
        ) : isPasswordFocused ? (
          "🙈 Squad privacy mode: Shhh, no peeking! 🔒"
        ) : !isPasswordFocused && isTyping ? (
          username ? `✨ Scanning ${username}... Squad analyzing!` : "✨ Squad analyzing top broker conditions!"
        ) : !isPasswordFocused && !isTyping && formStatus === 'success' ? (
          "🎉 Top verified brokers ready! Looking great!"
        ) : !isPasswordFocused && !isTyping && activeField === 'username' ? (
          "👋 Compare the best forex brokers below!"
        ) : (
          "👋 PipWise Squad: 100% verified broker rankings below! 👇"
        )}
      </div>

      {/* Main Vector SVG Scene with All 6 Characters (Zero heavy SVG filters for 60fps performance) */}
      <svg
        viewBox="0 -90 690 460"
        className="robot-svg"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Blue Robot Body Gradient */}
          <linearGradient id="robotBlueGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#3E83F6" />
            <stop offset="60%" stopColor="#2E6EEA" />
            <stop offset="100%" stopColor="#1E5AD6" />
          </linearGradient>

          {/* Robot Bevel Rim */}
          <linearGradient id="robotBevelGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1C4BB8" />
            <stop offset="100%" stopColor="#153E9E" />
          </linearGradient>

          {/* Pink Character Gradient */}
          <linearGradient id="pinkBodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FA67C7" />
            <stop offset="70%" stopColor="#F554BF" />
            <stop offset="100%" stopColor="#E03EA8" />
          </linearGradient>

          {/* Golden Star Body Gradient */}
          <linearGradient id="starGoldGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFE066" />
            <stop offset="45%" stopColor="#FFCA28" />
            <stop offset="100%" stopColor="#FFB300" />
          </linearGradient>

          {/* Star Lower Bevel */}
          <linearGradient id="starBevelGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFA000" />
            <stop offset="100%" stopColor="#E65100" />
          </linearGradient>

          {/* Teal Cube Gradient */}
          <linearGradient id="tealCubeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#30E8C3" />
            <stop offset="70%" stopColor="#22D3AB" />
            <stop offset="100%" stopColor="#13B892" />
          </linearGradient>

          {/* Teal Cube Bevel */}
          <linearGradient id="tealCubeBevel" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#109B7A" />
            <stop offset="100%" stopColor="#0B795F" />
          </linearGradient>

          {/* Orange Character Sphere 3D Gradients */}
          <radialGradient id="orangeSphereGrad" cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#FFA04D" />
            <stop offset="50%" stopColor="#FF7315" />
            <stop offset="100%" stopColor="#E65100" />
          </radialGradient>
          <radialGradient id="orangeHeadGrad" cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#FFAA5E" />
            <stop offset="50%" stopColor="#FF7A1F" />
            <stop offset="100%" stopColor="#E65100" />
          </radialGradient>

          {/* Purple Triangle Gradients */}
          <linearGradient id="purpleTriangleGrad" x1="20%" y1="0%" x2="80%" y2="100%">
            <stop offset="0%" stopColor="#A855F7" />
            <stop offset="50%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#6D28D9" />
          </linearGradient>

          {/* Visor Glare */}
          <linearGradient id="robotVisorReflection" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(255, 255, 255, 0.12)" />
            <stop offset="35%" stopColor="rgba(255, 255, 255, 0.02)" />
            <stop offset="100%" stopColor="rgba(0, 0, 0, 0)" />
          </linearGradient>
        </defs>

        {/* ===================================================
            FLOOR SHADOWS
            =================================================== */}
        <ellipse cx="92" cy="332" rx="40" ry="7" fill="rgba(0, 0, 0, 0.28)" />
        <ellipse cx="238" cy="332" rx="55" ry="8" fill="rgba(0, 0, 0, 0.32)" />
        <ellipse cx="388" cy="332" rx="58" ry="9" fill="rgba(0, 0, 0, 0.35)" />
        <ellipse cx="498" cy="332" rx="36" ry="7" fill="rgba(0, 0, 0, 0.28)" />
        <ellipse cx="597" cy="332" rx="45" ry="8" fill="rgba(0, 0, 0, 0.30)" />

        {/* ===================================================
            1. BLUE ROBOT (LEFT)
            =================================================== */}
        <g id="blue-robot-character" className={`blue-robot-wrapper ${isTypingCredentials ? 'squad-interact-robot-typing' : ''} ${isPasswordFocused ? 'squad-interact-robot-shy' : ''}`}>
          <rect x="76" y="262" width="7.5" height="42" rx="2" fill="#091E30" />
          <rect x="108" y="262" width="7.5" height="42" rx="2" fill="#091E30" />

          {/* Cyan Boots */}
          <g className="robot-left-boot">
            <rect x="73" y="282" width="13" height="17" rx="2.5" fill="#00DDB3" />
            <path
              d="M 86 284 L 86 300 A 3 3 0 0 1 83 303 L 62 303 A 5 5 0 0 1 62 298 L 57 295 A 5 5 0 0 1 62 290 L 73 290 L 73 284 Z"
              fill="#00DDB3"
            />
          </g>
          <g className="robot-right-boot">
            <rect x="105" y="282" width="13" height="17" rx="2.5" fill="#00DDB3" />
            <rect x="105" y="288" width="13" height="15" rx="6" fill="#00DDB3" />
          </g>

          {/* Head & Body Group */}
          <g className={`robot-head-body ${isTypingCredentials ? 'interact-tilt-pink' : isLookingAtForm ? 'focus-right' : 'idle-look-around'}`}>
            <path
              d="M 36 186 C 6 184, 2 230, 38 222"
              stroke="#091E30"
              strokeWidth="10.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            <path
              d="M 148 186 C 178 184, 182 230, 146 222"
              stroke="#091E30"
              strokeWidth="10.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />

            <rect x="42" y="196" width="100" height="74" rx="22" ry="22" fill="url(#robotBevelGrad)" />
            <rect x="42" y="193" width="100" height="72" rx="22" ry="22" fill="url(#robotBlueGrad)" />

            {/* Mint Antenna & Concentric Halo */}
            <line x1="92" y1="122" x2="92" y2="152" stroke="#2EE8C2" strokeWidth="4.5" strokeLinecap="round" />
            <circle cx="92" cy="116" r="11" fill="rgba(46, 232, 194, 0.22)" />
            <circle cx="92" cy="116" r="8" fill="#2EE8C2" id="robot-antenna-glow" />

            <rect x="36" y="148" width="112" height="66" rx="24" ry="24" fill="url(#robotBevelGrad)" />
            <rect x="36" y="145" width="112" height="64" rx="24" ry="24" fill="url(#robotBlueGrad)" />

            <rect x="50" y="156" width="84" height="50" rx="10" ry="10" fill="#06080F" />
            <rect x="50" y="156" width="84" height="50" rx="10" ry="10" fill="url(#robotVisorReflection)" />

            {/* Eyes: GPU-accelerated CSS blinking */}
            {!isPasswordFocused ? (
              <g className="robot-eye-blinker">
                <circle cx="72" cy="181" r="12.5" fill="#2EE8C2" />
                <circle cx="112" cy="181" r="12.5" fill="#2EE8C2" />
                <g className="robot-pupil-group">
                  <circle cx="72" cy="181" r="7" fill="#06080F" />
                  <circle cx="112" cy="181" r="7" fill="#06080F" />
                </g>
              </g>
            ) : (
              <g id="robot-eyes-shy">
                <path d="M 66 177 L 72 182 L 66 187" stroke="#2EE8C2" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                <path d="M 118 177 L 112 182 L 118 187" stroke="#2EE8C2" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                <circle cx="60" cy="189" r="3.5" fill="#FF5376" opacity="0.7" />
                <circle cx="124" cy="189" r="3.5" fill="#FF5376" opacity="0.7" />
              </g>
            )}

            <g id="robot-lower-console">
              <rect x="55" y="216" width="42" height="18" rx="4" fill="#0A1828" />
              <rect x="59" y="220" width="24" height="3" rx="1.5" fill="#2EE8C2" />
              <rect x="59" y="226" width="24" height="3" rx="1.5" fill="#2EE8C2" />
              <circle cx="90" cy="221.5" r="1.6" fill="#2EE8C2" />
              <circle cx="90" cy="227.5" r="1.6" fill="#2EE8C2" />

              <circle cx="106" cy="225" r="5.5" fill="#2EE8C2" className="interactive-btn" />
              <circle cx="120" cy="225" r="5.5" fill="#FF5722" className="interactive-btn" />
            </g>
          </g>
        </g>

        {/* ===================================================
            2. PINK COMPANION (CENTER)
            =================================================== */}
        <g id="pink-companion-character" className={`pink-character-group ${isTypingCredentials ? 'squad-interact-pink-typing' : ''} ${isPasswordFocused ? 'squad-interact-pink-shy' : ''}`}>
          <rect x="210" y="242" width="9" height="64" rx="2" fill="#083832" />
          <rect x="264" y="242" width="9" height="64" rx="2" fill="#083832" />

          <rect x="205" y="299" width="19" height="14" rx="2.5" fill="#FFB800" />
          <rect x="259" y="299" width="19" height="14" rx="2.5" fill="#FFB800" />

          <g className="pink-left-shoe">
            <rect x="205" y="309" width="19" height="15" rx="3" fill="#00E5BC" />
            <path
              d="M 224 311 L 224 324 A 4 4 0 0 1 220 328 L 193 328 A 6 6 0 0 1 187 322 L 187 318 A 6 6 0 0 1 193 312 L 205 312 L 205 311 Z"
              fill="#00E5BC"
            />
          </g>
          <g className="pink-right-shoe">
            <rect x="259" y="309" width="19" height="19" rx="7.5" fill="#00E5BC" />
          </g>

          <g className="pink-body-head">
            <g id="pink-hair" fill="#0A4138">
              <circle cx="190" cy="94" r="15" />
              <circle cx="210" cy="74" r="18" />
              <circle cx="236" cy="65" r="20" />
              <circle cx="264" cy="72" r="19" />
              <circle cx="286" cy="91" r="15" />
            </g>

            <path
              d="M 163 146 C 159 70, 313 70, 309 146"
              stroke="#4FE0C1"
              strokeWidth="14"
              fill="none"
              strokeLinecap="round"
            />

            <g id="sweatband">
              <clipPath id="sweatbandClip">
                <rect x="180" y="93" width="112" height="23" rx="7" />
              </clipPath>
              <g clipPath="url(#sweatbandClip)">
                <rect x="180" y="93" width="112" height="23" fill="#FFAE00" />
                <rect x="188" y="93" width="13" height="23" fill="#FF6D00" />
                <rect x="209" y="93" width="13" height="23" fill="#FF6D00" />
                <rect x="230" y="93" width="13" height="23" fill="#FF6D00" />
                <rect x="251" y="93" width="13" height="23" fill="#FF6D00" />
                <rect x="272" y="93" width="13" height="23" fill="#FF6D00" />
              </g>
            </g>

            <g className="earcup-group-left">
              <rect x="153" y="126" width="21" height="44" rx="10.5" fill="#4FE0C1" className="pink-earcup" />
            </g>
            <g className="earcup-group-right">
              <rect x="296" y="126" width="21" height="44" rx="10.5" fill="#4FE0C1" className="pink-earcup" />
            </g>

            <g className="floating-music-notes">
              <path d="M 326 122 A 4 3 0 1 1 322 126 L 327 106 L 336 109 L 328 111 Z" fill="#FF4081" className="music-note note-1" />
              <path d="M 136 120 A 3.5 2.8 0 1 1 133 124 L 137 106 L 150 103 L 150 119 A 3.5 2.8 0 1 1 146 123 L 150 108 L 137 111 Z" fill="#2EE8C2" className="music-note note-2" />
              <path d="M 312 90 A 3.8 3 0 1 1 308 94 L 313 77 L 322 81 L 314 83 Z" fill="#FFAE00" className="music-note note-3" />
            </g>

            <path
              d="M 183 116 C 183 106, 196 102, 215 102 L 257 102 C 276 102, 289 106, 289 116 L 308 218 C 312 234, 300 243, 285 243 L 187 243 C 172 243, 160 234, 164 218 Z"
              fill="url(#pinkBodyGrad)"
            />

            <path d="M 300 197 C 324 202, 324 235, 298 229" stroke="#083832" strokeWidth="10" strokeLinecap="round" fill="none" />

            {/* Eyes: GPU-accelerated CSS blinking */}
            {!isPasswordFocused ? (
              <g className="pink-eye-blinker">
                <g id="pink-left-eye">
                  <ellipse cx="208" cy="166" rx="17" ry="13.5" fill="#FFFFFF" />
                  <g className="pink-pupil-group">
                    <circle cx="208" cy="166" r="10" fill="#06080F" />
                    <circle cx="205" cy="163" r="3" fill="#FFFFFF" />
                  </g>
                  <path d="M 193 180 Q 208 184 223 180" stroke="#C20078" strokeWidth="3" strokeLinecap="round" fill="none" />
                </g>
                <g id="pink-right-eye">
                  <ellipse cx="265" cy="166" rx="17" ry="13.5" fill="#FFFFFF" />
                  <g className="pink-pupil-group">
                    <circle cx="265" cy="166" r="10" fill="#06080F" />
                    <circle cx="262" cy="163" r="3" fill="#FFFFFF" />
                  </g>
                  <path d="M 250 180 Q 265 184 280 180" stroke="#C20078" strokeWidth="3" strokeLinecap="round" fill="none" />
                </g>
              </g>
            ) : (
              <g id="pink-eyes-shy">
                <path d="M 195 168 Q 208 158 221 168" stroke="#06080F" strokeWidth="3.6" strokeLinecap="round" fill="none" />
                <path d="M 252 168 Q 265 158 278 168" stroke="#06080F" strokeWidth="3.6" strokeLinecap="round" fill="none" />
                <circle cx="200" cy="178" r="6" fill="#FF1744" opacity="0.6" />
                <circle cx="273" cy="178" r="6" fill="#FF1744" opacity="0.6" />
              </g>
            )}

            <path d="M 224 186 C 228 180, 234 182, 237 187 C 240 182, 246 180, 250 186 C 253 201, 221 201, 224 186 Z" fill="#06080F" />
            <path d="M 230 194 Q 237 189 244 194 Q 237 199 230 194 Z" fill="#FFA6D0" />
          </g>
        </g>

        {/* ===================================================
            3. GOLDEN STAR CHARACTER ON STILTS
            =================================================== */}
        <g id="golden-star-character" className={`golden-star-group ${isTypingCredentials ? 'squad-interact-star-typing' : ''} ${isPasswordFocused ? 'squad-interact-star-shy' : ''}`}>
          <rect x="372" y="56" width="9.5" height="240" rx="3" fill="#083832" className="star-stilt-left" />
          <rect x="395" y="56" width="9.5" height="240" rx="3" fill="#083832" className="star-stilt-right" />

          <g className="star-upper-wrapper" transform="translate(388, 60) scale(1.55) translate(-388, -138)">
            <g className="star-sway-body">
              <g className="star-left-arm">
                <path d="M 358 138 C 338 148, 332 192, 348 214" stroke="#083832" strokeWidth="9" strokeLinecap="round" fill="none" />
              </g>
              <g className="star-right-arm">
                <path d="M 420 138 C 442 148, 452 182, 464 204" stroke="#083832" strokeWidth="9" strokeLinecap="round" fill="none" />
              </g>

              <path
                d="M 388 52 L 403 91 L 444 96 L 413 124 L 424 164 L 388 143 L 352 164 L 363 124 L 332 96 L 373 91 Z"
                fill="url(#starBevelGrad)"
                transform="translate(0, 3)"
              />

              <path
                d="M 388 50 L 404 89 L 445 94 L 414 122 L 425 162 L 388 141 L 351 162 L 362 122 L 331 94 L 372 89 Z"
                fill="url(#starGoldGrad)"
                stroke="#FFAE00"
                strokeWidth="2.5"
                strokeLinejoin="round"
              />

              <g id="star-clinging-pet" className="clinging-pet">
                <circle cx="316" cy="102" r="14" fill="#0F2B38" />
                <path d="M 307 92 L 312 99 L 304 100 Z" fill="#0F2B38" />
                <path d="M 321 90 L 324 98 L 317 98 Z" fill="#0F2B38" />
                <circle cx="312" cy="102" r="2.4" fill="#FFFFFF" />
                <circle cx="319" cy="102" r="2.4" fill="#FFFFFF" />
                <circle cx="312.5" cy="102" r="1.2" fill="#000" />
                <circle cx="319.5" cy="102" r="1.2" fill="#000" />
                <ellipse cx="315.5" cy="106" rx="1.5" ry="1" fill="#2A4F5C" />
                <ellipse cx="327" cy="108" rx="4" ry="5" fill="#0F2B38" />
                <ellipse cx="318" cy="116" rx="4" ry="5" fill="#0F2B38" />
                <path d="M 302 108 C 296 106, 294 114, 300 112" stroke="#0F2B38" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              </g>

              {/* Eyes: GPU-accelerated CSS blinking */}
              <g id="star-face-features" transform="translate(388, 118) scale(1.25) translate(-388, -118)">
                {!isPasswordFocused ? (
                  <g className="star-eye-blinker">
                    <g id="star-left-eye">
                      <ellipse cx="371" cy="111" rx="10.2" ry="8.2" fill="#FFFFFF" />
                      <g className="star-pupil-group">
                        <circle cx="371" cy="111" r="5.8" fill="#081E28" />
                        <circle cx="369" cy="109" r="1.8" fill="#FFFFFF" />
                      </g>
                    </g>
                    <g id="star-right-eye">
                      <ellipse cx="405" cy="111" rx="10.2" ry="8.2" fill="#FFFFFF" />
                      <g className="star-pupil-group">
                        <circle cx="405" cy="111" r="5.8" fill="#081E28" />
                        <circle cx="403" cy="109" r="1.8" fill="#FFFFFF" />
                      </g>
                    </g>
                  </g>
                ) : (
                  <g id="star-eyes-shy">
                    <path d="M 363 113 Q 371 106 379 113" stroke="#081E28" strokeWidth="2.6" strokeLinecap="round" fill="none" />
                    <path d="M 397 113 Q 405 106 413 113" stroke="#081E28" strokeWidth="2.6" strokeLinecap="round" fill="none" />
                  </g>
                )}

                <g id="star-mouth" className="star-mouth-realistic">
                  <path d="M 374 126 C 380 128.5, 396 128.5, 402 126 C 405 142, 371 142, 374 126 Z" fill="#081E28" />
                  <g className="star-mouth-inner">
                    <rect x="384.5" y="125" width="7" height="4.5" rx="1.5" fill="#FFFFFF" />
                    <ellipse cx="388" cy="136" rx="7" ry="4" fill="#FF4081" />
                    <ellipse cx="388" cy="137.5" rx="5" ry="2.5" fill="#FF80AB" />
                  </g>
                  <path d="M 373 126 C 379 128.5, 397 128.5, 403 126" stroke="#081E28" strokeWidth="2.8" strokeLinecap="round" fill="none" />
                </g>
              </g>
            </g>
          </g>
        </g>

        {/* ===================================================
            4. TEAL CUBE CHARACTER
            =================================================== */}
        <g id="teal-cube-character" className={`teal-cube-group ${isTypingCredentials ? 'squad-interact-cube-typing' : ''} ${isPasswordFocused ? 'squad-interact-cube-shy' : ''}`}>
          <g className="cube-left-foot">
            <rect x="354" y="312" width="18" height="17" rx="7" fill="#00DDB3" />
          </g>
          <g className="cube-right-foot">
            <rect x="406" y="312" width="18" height="17" rx="7" fill="#00DDB3" />
            <path d="M 424 314 L 424 326 A 4 4 0 0 1 420 330 L 406 330 A 4 4 0 0 1 402 326 L 402 314 Z" fill="#00DDB3" />
          </g>

          <g className="teal-cube-body">
            <rect x="335" y="235" width="106" height="96" rx="28" ry="28" fill="url(#tealCubeBevel)" />
            <rect x="335" y="231" width="106" height="94" rx="28" ry="28" fill="url(#tealCubeGrad)" />

            <g className="cube-left-arm">
              <path d="M 338 274 C 314 284, 312 312, 332 318" stroke="#083832" strokeWidth="9.5" strokeLinecap="round" fill="none" />
            </g>
            <g className="cube-right-arm">
              <path d="M 438 274 C 460 284, 464 310, 444 318" stroke="#083832" strokeWidth="9.5" strokeLinecap="round" fill="none" />
            </g>

            <g id="cube-eyes" className="cube-eyes-group">
              <path d="M 360 256 Q 369 247 378 256" stroke="#061824" strokeWidth="4" strokeLinecap="round" fill="none" />
              <path d="M 398 256 Q 407 247 416 256" stroke="#061824" strokeWidth="4" strokeLinecap="round" fill="none" />
            </g>

            <g className="cube-mouth-group">
              <path d="M 380 270 C 383 266, 393 266, 396 270 C 399 284, 377 284, 380 270 Z" fill="#061824" />
              <path d="M 384 276 Q 388 272 392 276 Q 388 281 384 276 Z" fill="#FFA6D0" />
            </g>
          </g>
        </g>

        {/* ===================================================
            5. ORANGE FIGURE-8 CHARACTER
            =================================================== */}
        <g id="orange-character" className={`orange-group ${isTypingCredentials ? 'squad-interact-orange-typing' : ''} ${isPasswordFocused ? 'squad-interact-orange-shy' : ''}`} transform="translate(30, 0)">
          <rect x="456" y="260" width="8.5" height="66" rx="2" fill="#083832" />
          <rect x="480" y="260" width="8.5" height="66" rx="2" fill="#083832" />

          <g className="orange-left-boot">
            <rect x="454" y="318" width="13" height="6" rx="1.5" fill="#FFEAA7" />
            <rect x="448" y="322" width="20" height="12" rx="4" fill="#00DDB3" />
          </g>
          <g className="orange-right-boot">
            <rect x="478" y="318" width="13" height="6" rx="1.5" fill="#FFEAA7" />
            <rect x="474" y="322" width="20" height="12" rx="4" fill="#00DDB3" />
          </g>

          <g className="orange-body-sway">
            <path
              d="M 436 218 C 420 226, 420 256, 434 266"
              stroke="#083832"
              strokeWidth="9"
              strokeLinecap="round"
              fill="none"
              className="orange-left-arm"
            />
            <path
              d="M 500 216 C 522 224, 520 248, 502 254"
              stroke="#083832"
              strokeWidth="9"
              strokeLinecap="round"
              fill="none"
              className="orange-right-arm"
            />

            <circle cx="468" cy="225" r="42" fill="url(#orangeSphereGrad)" />

            <g id="orange-bottom-eye" className="orange-eye-blink">
              <rect x="456" y="209" width="24" height="13" rx="6.5" fill="#FFFFFF" />
              <rect x="456" y="209" width="24" height="13" rx="6.5" fill="#06121E" />
              <g className="orange-pupil-group">
                <circle cx="468" cy="215.5" r="4.2" fill="#FFFFFF" />
                <circle cx="469" cy="214.5" r="1.5" fill="#FFFFFF" />
              </g>
            </g>

            <circle cx="445" cy="220" r="1.2" fill="#7C2D12" />
            <circle cx="449" cy="223" r="1.3" fill="#7C2D12" />
            <circle cx="453" cy="221" r="1.2" fill="#7C2D12" />

            <circle cx="483" cy="220" r="1.2" fill="#7C2D12" />
            <circle cx="487" cy="223" r="1.3" fill="#7C2D12" />
            <circle cx="491" cy="221" r="1.2" fill="#7C2D12" />

            <g id="orange-bottom-mouth" className="orange-mouth-realistic">
              <path d="M 458 231 C 462 227, 474 227, 478 231 C 481 243, 455 243, 458 231 Z" fill="#06121E" />
              <g className="orange-mouth-inner">
                <rect x="465.5" y="229" width="5" height="4" rx="1.2" fill="#FFFFFF" />
                <ellipse cx="468" cy="239" rx="5" ry="2.8" fill="#FF4081" />
                <ellipse cx="468" cy="239.8" rx="3.8" ry="1.8" fill="#FF80AB" />
              </g>
              <path d="M 457.5 231 C 461.5 227, 474.5 227, 478.5 231" stroke="#06121E" strokeWidth="2.4" strokeLinecap="round" fill="none" />
            </g>

            <g className="orange-head-bob">
              <circle cx="468" cy="148" r="34" fill="url(#orangeHeadGrad)" />

              <g id="orange-top-eye">
                <rect x="442" y="141" width="18" height="11" rx="5.5" fill="#FFFFFF" />
                <rect x="442" y="141" width="18" height="11" rx="5.5" fill="#06121E" />
                <g className="orange-top-pupil-group">
                  <circle cx="448" cy="146.5" r="3.8" fill="#FFFFFF" />
                </g>
              </g>

              <g id="orange-top-mouth" className="orange-top-mouth-animated">
                <path d="M 442 157 C 445 153, 454 153, 457 157 C 459 166, 440 166, 442 157 Z" fill="#06121E" />
                <rect x="446" y="155" width="4.5" height="3" rx="1" fill="#FFFFFF" />
              </g>
            </g>
          </g>
        </g>

        {/* ===================================================
            6. PURPLE TRIANGLE CHARACTER
            =================================================== */}
        <g id="purple-triangle-character" className={`purple-group ${isTypingCredentials ? 'squad-interact-purple-typing' : ''} ${isPasswordFocused ? 'squad-interact-purple-shy' : ''}`} transform="translate(30, 0)">
          <rect x="552" y="274" width="8.5" height="52" rx="2" fill="#083832" />
          <rect x="578" y="274" width="8.5" height="52" rx="2" fill="#083832" />

          <g className="purple-left-boot">
            <rect x="548" y="318" width="14" height="6" rx="1.5" fill="#FFEAA7" />
            <rect x="540" y="322" width="22" height="12" rx="4" fill="#00DDB3" />
          </g>
          <g className="purple-right-boot">
            <rect x="576" y="318" width="14" height="6" rx="1.5" fill="#FFEAA7" />
            <rect x="574" y="322" width="20" height="12" rx="4" fill="#00DDB3" />
          </g>

          {/* Hula Hoop Neon Halo & Stroke */}
          <path
            d="M 522 254 C 522 240, 612 240, 612 254"
            stroke="rgba(0, 245, 212, 0.25)"
            strokeWidth="8"
            fill="none"
          />
          <path
            d="M 522 254 C 522 240, 612 240, 612 254"
            stroke="#00F5D4"
            strokeWidth="4"
            strokeDasharray="9 6"
            fill="none"
            className="hula-hoop-spin"
          />

          <g className="purple-body-sway">
            <path
              d="M 567 172 C 573 172, 614 260, 617 266 C 620 273, 615 277, 606 277 L 528 277 C 519 277, 514 273, 517 266 C 520 260, 561 172, 567 172 Z"
              fill="url(#purpleTriangleGrad)"
              stroke="#6D28D9"
              strokeWidth="2"
            />

            <path d="M 528 244 C 516 248, 515 258, 524 260" stroke="#083832" strokeWidth="9" strokeLinecap="round" fill="none" className="purple-left-arm" />
            <path d="M 605 244 C 618 248, 620 258, 610 260" stroke="#083832" strokeWidth="9" strokeLinecap="round" fill="none" className="purple-right-arm" />

            {/* Eyes: GPU-accelerated CSS blinking */}
            {!isPasswordFocused ? (
              <g className="purple-eye-blinker">
                <g id="purple-left-eye">
                  <ellipse cx="548" cy="226" rx="10.2" ry="8.2" fill="#FFFFFF" />
                  <g className="purple-pupil-group">
                    <circle cx="548" cy="226" r="5.8" fill="#06121E" />
                    <circle cx="546" cy="224" r="1.8" fill="#FFFFFF" />
                  </g>
                  <path d="M 539 234.5 Q 548 237 557 234.5" stroke="#E11D48" strokeWidth="2.0" strokeLinecap="round" fill="none" />
                </g>
                <g id="purple-right-eye">
                  <ellipse cx="584" cy="226" rx="10.2" ry="8.2" fill="#FFFFFF" />
                  <g className="purple-pupil-group">
                    <circle cx="584" cy="226" r="5.8" fill="#06121E" />
                    <circle cx="582" cy="224" r="1.8" fill="#FFFFFF" />
                  </g>
                  <path d="M 575 234.5 Q 584 237 593 234.5" stroke="#E11D48" strokeWidth="2.0" strokeLinecap="round" fill="none" />
                </g>
              </g>
            ) : (
              <g id="purple-eyes-shy">
                <path d="M 540 227 Q 548 221 556 227" stroke="#06121E" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                <path d="M 576 227 Q 584 221 592 227" stroke="#06121E" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              </g>
            )}

            <rect x="535" y="243" width="12" height="6" rx="3" fill="#FF66C4" className="purple-blush" />
            <rect x="586" y="243" width="12" height="6" rx="3" fill="#FF66C4" className="purple-blush" />

            <g id="purple-mouth" className="purple-mouth-smile">
              <path d="M 561 245 C 563 241, 571 241, 573 245 C 575 253, 559 253, 561 245 Z" fill="#06121E" />
              <ellipse cx="567" cy="250" rx="4" ry="2" fill="#FF80AB" />
            </g>

            {/* Front Hula Hoop with Halo */}
            <path
              d="M 522 254 C 522 268, 612 268, 612 254"
              stroke="rgba(0, 245, 212, 0.25)"
              strokeWidth="8"
              fill="none"
            />
            <path
              d="M 522 254 C 522 268, 612 268, 612 254"
              stroke="#00F5D4"
              strokeWidth="4.5"
              strokeDasharray="9 6"
              fill="none"
              className="hula-hoop-spin"
            />
          </g>
        </g>

        {/* Click Sparkles */}
        {sparkles.map((sp) => (
          <circle
            key={sp.id}
            cx={sp.x}
            cy={sp.y}
            r={sp.size}
            fill="#FFCA28"
            className="sparkle-particle"
          />
        ))}
      </svg>
    </div>
  );
}
