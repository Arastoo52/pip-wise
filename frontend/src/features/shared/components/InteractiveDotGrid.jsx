import React, { useEffect, useRef } from 'react';

const InteractiveDotGrid = ({ theme = 'dark' }) => {
  const canvasRef = useRef(null);
  const dotsRef = useRef([]);
  const mouseRef = useRef({ x: -1000, y: -1000, isHovering: false });
  const animFrameIdRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = window.devicePixelRatio || 1;

    // Dot grid configuration
    const SPACING = 22; // Distance between dots in px
    const BASE_RADIUS = 1.75; // Resting dot radius (slightly fuller/thicker)
    const HOVER_RADIUS = 100; // Interaction radius around cursor
    const REPEL_FORCE = 18; // Spring displacement distance in px
    const SPRING_STIFFNESS = 0.085; // Hooke's law stiffness
    const SPRING_DAMPING = 0.82; // Elastic velocity damping

    const isDark = theme ? theme === 'dark' : document.documentElement.getAttribute('data-theme') === 'dark';
    const dotColorRGB = isDark ? '252, 93, 33' : '235, 82, 24'; // Coral orange
    const maxRestOpacity = isDark ? 0.28 : 0.35;

    const buildGrid = (w, h) => {
      const dots = [];
      const cols = Math.floor(w / SPACING);
      const rows = Math.floor(h / SPACING);

      const offsetX = (w - (cols - 1) * SPACING) / 2;
      const offsetY = (h - (rows - 1) * SPACING) / 2;

      // Thresholds: how far inwards from left and right the dots reach towards center
      const leftBoundary = Math.min(w * 0.44, 620);
      const rightBoundary = Math.max(w * 0.56, w - 620);

      for (let r = 0; r < rows; r++) {
        const y = offsetY + r * SPACING;

        // Vertical fade factor near top & bottom
        const vDist = Math.min(y, h - y);
        const vFade = Math.min(1, Math.max(0, vDist / 80));

        for (let c = 0; c < cols; c++) {
          const x = offsetX + c * SPACING;

          let isLeft = x <= leftBoundary;
          let isRight = x >= rightBoundary;

          // Only keep dots on left and right sides
          if (!isLeft && !isRight) continue;

          // Horizontal fade factor towards the center
          let hFade = 0;
          if (isLeft) {
            // Full opacity near edge (x < 120), smoothly fades towards center (up to leftBoundary)
            if (x < 120) {
              hFade = 1;
            } else {
              const progress = (x - 120) / (leftBoundary - 120);
              hFade = Math.max(0, 1 - progress * progress);
            }
          } else {
            // Right side: fades towards center
            const rightEdge = w - 120;
            if (x > rightEdge) {
              hFade = 1;
            } else {
              const progress = (rightEdge - x) / (rightEdge - rightBoundary);
              hFade = Math.max(0, 1 - progress * progress);
            }
          }

          const baseOpacity = maxRestOpacity * hFade * vFade;
          if (baseOpacity < 0.02) continue; // Skip practically invisible dots

          dots.push({
            originX: x,
            originY: y,
            x: x,
            y: y,
            vx: 0,
            vy: 0,
            baseRadius: BASE_RADIUS,
            currentRadius: BASE_RADIUS,
            targetRadius: BASE_RADIUS,
            baseOpacity: baseOpacity,
            currentOpacity: baseOpacity,
            targetOpacity: baseOpacity,
          });
        }
      }

      dotsRef.current = dots;
    };

    // Static draw function: paints all dots at their exact resting positions with zero animation
    const drawStatic = () => {
      ctx.clearRect(0, 0, width * dpr, height * dpr);
      ctx.save();
      ctx.scale(dpr, dpr);

      const dots = dotsRef.current;
      const total = dots.length;
      for (let i = 0; i < total; i++) {
        const dot = dots[i];
        dot.x = dot.originX;
        dot.y = dot.originY;
        dot.vx = 0;
        dot.vy = 0;
        dot.currentRadius = dot.baseRadius;
        dot.currentOpacity = dot.baseOpacity;

        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.baseRadius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${dotColorRGB}, ${dot.baseOpacity.toFixed(3)})`;
        ctx.fill();
      }
      ctx.restore();
    };

    const handleResize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect() || { width: window.innerWidth, height: window.innerHeight };
      width = rect.width;
      height = rect.height;
      dpr = window.devicePixelRatio || 1;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      buildGrid(width, height);
      drawStatic();
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    // Mouse movement listeners on the hero section container
    const heroSection = canvas.closest('.pipwise-hero') || window;
    let isLoopRunning = false;

    // Physics Animation Loop - Only runs when mouse is actively interacting
    const render = () => {
      ctx.clearRect(0, 0, width * dpr, height * dpr);
      ctx.save();
      ctx.scale(dpr, dpr);

      const mouseX = mouseRef.current.x;
      const mouseY = mouseRef.current.y;
      const isHovering = mouseRef.current.isHovering;
      const dots = dotsRef.current;
      const total = dots.length;

      let hasActiveMotion = false;

      for (let i = 0; i < total; i++) {
        const dot = dots[i];

        let targetX = dot.originX;
        let targetY = dot.originY;
        let targetRadius = dot.baseRadius;
        let targetOpacity = dot.baseOpacity;

        if (isHovering) {
          const dx = dot.originX - mouseX;
          const dy = dot.originY - mouseY;
          const distSq = dx * dx + dy * dy;
          const radiusSq = HOVER_RADIUS * HOVER_RADIUS;

          if (distSq < radiusSq && distSq > 0) {
            const dist = Math.sqrt(distSq);
            const factor = Math.pow(1 - dist / HOVER_RADIUS, 1.6);

            targetX = dot.originX + (dx / dist) * factor * REPEL_FORCE;
            targetY = dot.originY + (dy / dist) * factor * REPEL_FORCE;

            targetRadius = dot.baseRadius + factor * 1.5;
            targetOpacity = Math.min(0.85, dot.baseOpacity + factor * 0.6);
          }
        }

        // Spring acceleration & velocity integration
        const ax = (targetX - dot.x) * SPRING_STIFFNESS;
        const ay = (targetY - dot.y) * SPRING_STIFFNESS;

        dot.vx = (dot.vx + ax) * SPRING_DAMPING;
        dot.vy = (dot.vy + ay) * SPRING_DAMPING;

        dot.x += dot.vx;
        dot.y += dot.vy;

        dot.currentRadius += (targetRadius - dot.currentRadius) * 0.2;
        dot.currentOpacity += (targetOpacity - dot.currentOpacity) * 0.2;

        // Check if any dot is still moving
        if (
          Math.abs(dot.x - dot.originX) > 0.08 ||
          Math.abs(dot.y - dot.originY) > 0.08 ||
          Math.abs(dot.vx) > 0.02 ||
          Math.abs(dot.vy) > 0.02
        ) {
          hasActiveMotion = true;
        }

        // Draw dot
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, Math.max(0.4, dot.currentRadius), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${dotColorRGB}, ${dot.currentOpacity.toFixed(3)})`;
        ctx.fill();
      }

      ctx.restore();

      // If hovering or dots are still moving, continue RAF loop; otherwise stop to save 100% CPU/GPU
      if (isHovering || hasActiveMotion) {
        animFrameIdRef.current = requestAnimationFrame(render);
      } else {
        isLoopRunning = false;
        drawStatic(); // Clean final static snapshot
      }
    };

    const startAnimationLoop = () => {
      if (!isLoopRunning) {
        isLoopRunning = true;
        animFrameIdRef.current = requestAnimationFrame(render);
      }
    };

    let cachedRect = null;
    const updateCachedRect = () => {
      if (canvas) {
        cachedRect = canvas.getBoundingClientRect();
      }
    };
    updateCachedRect();

    const handlePointerMove = (e) => {
      if (!cachedRect) updateCachedRect();
      if (!cachedRect) return;
      mouseRef.current.x = e.clientX - cachedRect.left;
      mouseRef.current.y = e.clientY - cachedRect.top;
      mouseRef.current.isHovering = true;
      startAnimationLoop();
    };

    const handlePointerLeave = () => {
      mouseRef.current.x = -1000;
      mouseRef.current.y = -1000;
      mouseRef.current.isHovering = false;
    };

    heroSection.addEventListener('pointermove', handlePointerMove, { passive: true });
    heroSection.addEventListener('pointerleave', handlePointerLeave, { passive: true });
    window.addEventListener('scroll', updateCachedRect, { passive: true });

    // Initial paint is purely static - ZERO reload lag, zero scatter animation
    drawStatic();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', updateCachedRect);
      heroSection.removeEventListener('pointermove', handlePointerMove);
      heroSection.removeEventListener('pointerleave', handlePointerLeave);
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      className="pipwise-interactive-dots-canvas"
      aria-hidden="true"
    />
  );
};

export default React.memo(InteractiveDotGrid);
