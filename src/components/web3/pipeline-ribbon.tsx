'use client';

import React, { useEffect, useRef } from 'react';
import { useReducedMotion } from '@/lib/use-reduced-motion';

export function PipelineRibbon({ className = '' }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 300);
    let animationFrameId: number;
    let time = 0;
    let isVisible = true;

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement?.clientHeight || 300;
    };

    const handleVisibility = () => {
      isVisible = !document.hidden;
    };

    window.addEventListener('resize', handleResize);
    document.addEventListener('visibilitychange', handleVisibility);

    const waves = [
      {
        y: height * 0.45,
        amp: 28,
        freq: 0.0035,
        speed: 0.012,
        colorStart: 'rgba(52, 211, 153, 0.45)', // Mint
        colorEnd: 'rgba(34, 211, 238, 0.1)',   // Cyan
        lineWidth: 2.5,
      },
      {
        y: height * 0.52,
        amp: 22,
        freq: 0.0048,
        speed: 0.016,
        colorStart: 'rgba(16, 185, 129, 0.4)',  // Emerald
        colorEnd: 'rgba(99, 102, 241, 0.1)',  // Indigo
        lineWidth: 2,
      },
    ];

    const render = () => {
      if (!isVisible) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, width, height);
      time += 1;

      waves.forEach((w) => {
        const gradient = ctx.createLinearGradient(0, 0, width, 0);
        gradient.addColorStop(0, 'rgba(16, 185, 129, 0)');
        gradient.addColorStop(0.2, w.colorStart);
        gradient.addColorStop(0.5, 'rgba(52, 211, 153, 0.5)');
        gradient.addColorStop(0.8, w.colorEnd);
        gradient.addColorStop(1, 'rgba(34, 211, 238, 0)');

        ctx.beginPath();
        const step = 8;
        let prevX = 0;
        let prevY = w.y;

        for (let x = 0; x <= width + step; x += step) {
          const y =
            w.y +
            Math.sin(x * w.freq + time * w.speed) * w.amp +
            Math.cos(x * w.freq * 0.5 + time * w.speed * 0.7) * (w.amp * 0.35);

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
        ctx.lineWidth = w.lineWidth;
        ctx.shadowColor = w.colorStart;
        ctx.shadowBlur = 10;
        ctx.stroke();
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
  }, [reducedMotion]);

  if (reducedMotion) return null;

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none select-none overflow-hidden ${className}`}
    >
      <canvas ref={canvasRef} className="h-full w-full block" />
    </div>
  );
}
