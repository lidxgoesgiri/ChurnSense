'use client';

import React, { useEffect, useRef } from 'react';

interface AnimatedRibbonProps {
  className?: string;
  opacity?: number;
}

export function AnimatedRibbon({ className = '', opacity = 0.65 }: AnimatedRibbonProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 450);
    let animationFrameId: number;
    let time = 0;
    let isVisible = true;

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement?.clientHeight || 450;
    };

    const handleVisibility = () => {
      isVisible = !document.hidden;
    };

    window.addEventListener('resize', handleResize);
    document.addEventListener('visibilitychange', handleVisibility);

    // Multiple layered ribbon strands
    const strands = [
      {
        freq1: 0.0022,
        freq2: 0.0048,
        speed: 0.007,
        amp1: 42,
        amp2: 24,
        yOffset: 0.48,
        colorStart: 'rgba(16, 185, 129, 0.45)', // Emerald
        colorEnd: 'rgba(6, 182, 212, 0.1)',    // Cyan
        lineWidth: 2.2,
      },
      {
        freq1: 0.0031,
        freq2: 0.0055,
        speed: 0.009,
        amp1: 36,
        amp2: 20,
        yOffset: 0.52,
        colorStart: 'rgba(6, 182, 212, 0.4)',  // Cyan
        colorEnd: 'rgba(99, 102, 241, 0.15)', // Indigo
        lineWidth: 1.8,
      },
      {
        freq1: 0.0018,
        freq2: 0.0039,
        speed: 0.005,
        amp1: 48,
        amp2: 28,
        yOffset: 0.44,
        colorStart: 'rgba(52, 211, 153, 0.35)', // Mint
        colorEnd: 'rgba(16, 185, 129, 0.05)',  // Emerald
        lineWidth: 2.0,
      },
    ];

    const render = () => {
      if (!isVisible) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, width, height);
      time += 1;

      // Draw each fluid strand
      strands.forEach((strand) => {
        const centerY = height * strand.yOffset;
        const gradient = ctx.createLinearGradient(0, 0, width, 0);
        gradient.addColorStop(0, 'rgba(16, 185, 129, 0)');
        gradient.addColorStop(0.2, strand.colorStart);
        gradient.addColorStop(0.8, strand.colorEnd);
        gradient.addColorStop(1, 'rgba(6, 182, 212, 0)');

        ctx.beginPath();
        const step = 6;
        let prevX = 0;
        let prevY = centerY;

        for (let x = 0; x <= width + step; x += step) {
          // Harmonic wave calculation creating organic flowing ribbon motion
          const wave1 = Math.sin(x * strand.freq1 + time * strand.speed) * strand.amp1;
          const wave2 = Math.cos(x * strand.freq2 + time * strand.speed * 0.7) * strand.amp2;
          const y = centerY + wave1 + wave2;

          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            const xc = (prevX + x) / 2;
            const yc = (prevY + y) / 2;
            ctx.quadraticCurveTo(prevX, prevY, xc, yc);
          }

          prevX = x;
          prevY = y;
        }

        ctx.strokeStyle = gradient;
        ctx.lineWidth = strand.lineWidth;
        ctx.shadowColor = strand.colorStart;
        ctx.shadowBlur = 12;
        ctx.stroke();

        // Reset shadow for performance
        ctx.shadowBlur = 0;
      });

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibility);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      style={{ opacity }}
      className={`pointer-events-none select-none overflow-hidden ${className}`}
    >
      <canvas ref={canvasRef} className="h-full w-full block" />
    </div>
  );
}
