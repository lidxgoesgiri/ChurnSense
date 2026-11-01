'use client';

import React, { useEffect, useRef } from 'react';
import { useReducedMotion } from '@/lib/use-reduced-motion';

interface CyberBackgroundProps {
  intensity?: 'subtle' | 'vibrant';
  showGrid?: boolean;
  showRetentionStreams?: boolean;
  showGrowthLoops?: boolean;
  showAurora?: boolean;
  showSpotlight?: boolean;
}

export function CyberBackground({
  intensity = 'subtle',
  showGrid = true,
  showRetentionStreams = true,
  showGrowthLoops = true,
  showAurora = true,
  showSpotlight = true,
}: CyberBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const spotlightRef = useRef<HTMLDivElement | null>(null);
  const reducedMotion = useReducedMotion();

  // Smooth mouse spotlight tracking
  useEffect(() => {
    if (!showSpotlight || reducedMotion) return;

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let currentX = targetX;
    let currentY = targetY;
    let animationFrameId: number;

    const handleMouseMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
    };

    const updatePosition = () => {
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;

      if (spotlightRef.current) {
        spotlightRef.current.style.transform = `translate3d(${currentX - 350}px, ${currentY - 350}px, 0)`;
      }

      animationFrameId = requestAnimationFrame(updatePosition);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    animationFrameId = requestAnimationFrame(updatePosition);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [showSpotlight, reducedMotion]);

  // Retention Streams & Growth Loops Dynamic Canvas (Replacing generic stars)
  useEffect(() => {
    if ((!showRetentionStreams && !showGrowthLoops) || reducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    let animationFrameId: number;
    let time = 0;
    let isVisible = true;

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleVisibilityChange = () => {
      isVisible = !document.hidden;
    };

    window.addEventListener('resize', handleResize);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Retention Currents (Smooth multi-harmonic flow streams)
    const streamCount = intensity === 'vibrant' ? 6 : 4;
    const streams = Array.from({ length: streamCount }, (_, i) => ({
      baseY: (height / (streamCount + 1)) * (i + 1),
      amplitude: 35 + i * 8,
      frequency: 0.0016 + i * 0.0003,
      speed: 0.006 + i * 0.002,
      phase: i * 1.8,
      color: i % 2 === 0 ? 'rgba(16, 185, 129,' : 'rgba(6, 182, 212,',
    }));

    // Bioluminescent Growth Spores that flow along the retention loop currents
    const sporeCount = intensity === 'vibrant' ? 24 : 16;
    const spores = Array.from({ length: sporeCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      speedX: 0.3 + Math.random() * 0.45,
      radius: 1.2 + Math.random() * 1.6,
      alpha: 0.2 + Math.random() * 0.4,
      streamIndex: Math.floor(Math.random() * streamCount),
      color: Math.random() > 0.4 ? 'rgba(52, 211, 153,' : 'rgba(34, 211, 238,',
    }));

    // Concentric Growth Radar Loops (centered around strategic positions)
    let loopRadius = 0;
    const maxLoopRadius = Math.max(width, height) * 0.45;

    const render = () => {
      if (!isVisible) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, width, height);
      time += 1;

      // 1. Draw Flowing Retention Stream Fields
      if (showRetentionStreams) {
        streams.forEach((st) => {
          ctx.beginPath();
          const step = 14;
          for (let x = 0; x <= width + step; x += step) {
            const y =
              st.baseY +
              Math.sin(x * st.frequency + time * st.speed + st.phase) * st.amplitude +
              Math.cos(x * st.frequency * 0.6 + time * st.speed * 0.5) * (st.amplitude * 0.4);

            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }

          const grad = ctx.createLinearGradient(0, 0, width, 0);
          grad.addColorStop(0, `${st.color} 0)`);
          grad.addColorStop(0.3, `${st.color} 0.12)`);
          grad.addColorStop(0.7, `${st.color} 0.08)`);
          grad.addColorStop(1, `${st.color} 0)`);

          ctx.strokeStyle = grad;
          ctx.lineWidth = 1.4;
          ctx.stroke();
        });
      }

      // 2. Draw Concentric Retention Radar Loops
      if (showGrowthLoops) {
        loopRadius = (loopRadius + 0.3) % maxLoopRadius;
        const centerX = width * 0.72;
        const centerY = height * 0.42;

        for (let ring = 0; ring < 3; ring++) {
          const r = (loopRadius + ring * 120) % maxLoopRadius;
          const alpha = (1 - r / maxLoopRadius) * 0.1;

          ctx.beginPath();
          ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(16, 185, 129, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.setLineDash([4, 10]);
          ctx.stroke();
          ctx.setLineDash([]);
        }
      }

      // 3. Draw Bioluminescent Growth Spores moving along retention flow
      spores.forEach((sp) => {
        sp.x += sp.speedX;
        if (sp.x > width + 20) {
          sp.x = -20;
          sp.y = Math.random() * height;
        }

        // Float gently near the stream curve
        const st = streams[sp.streamIndex];
        const targetY =
          st.baseY + Math.sin(sp.x * st.frequency + time * st.speed) * st.amplitude;
        sp.y += (targetY - sp.y) * 0.03;

        ctx.beginPath();
        ctx.arc(sp.x, sp.y, sp.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${sp.color} ${sp.alpha})`;
        ctx.shadowColor = sp.color.includes('52, 211, 153') ? '#34D399' : '#22D3EE';
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      cancelAnimationFrame(animationFrameId);
    };
  }, [showRetentionStreams, showGrowthLoops, intensity, reducedMotion]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none"
    >
      {/* 1. Cyber Aurora Gradients */}
      {showAurora && (
        <div className="absolute inset-0 opacity-40 dark:opacity-50 transition-opacity duration-1000">
          <div className="absolute -top-32 right-1/4 h-[550px] w-[550px] rounded-full bg-emerald-500/20 blur-[130px] animate-aurora-slow" />
          <div className="absolute top-1/3 -left-36 h-[600px] w-[600px] rounded-full bg-cyan-500/15 blur-[140px] animate-aurora-reverse" />
          <div className="absolute -bottom-48 right-1/3 h-[650px] w-[650px] rounded-full bg-indigo-500/15 blur-[160px] animate-aurora-slow" />
        </div>
      )}

      {/* 2. Cybernetic Perspective Grid with Vignette Mask */}
      {showGrid && (
        <div
          className="absolute inset-0 bg-cyber-grid bg-[length:40px_40px] opacity-[0.03] dark:opacity-[0.06] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_40%,#000_30%,transparent_100%)]"
        />
      )}

      {/* 3. Interactive Mouse Spotlight Glow */}
      {showSpotlight && !reducedMotion && (
        <div
          ref={spotlightRef}
          className="will-change-transform absolute -top-0 -left-0 h-[700px] w-[700px] rounded-full pointer-events-none opacity-25 dark:opacity-30 blur-[90px] bg-[radial-gradient(circle,rgba(16,185,129,0.35)_0%,rgba(6,182,212,0.15)_45%,transparent_70%)] transition-opacity duration-300"
        />
      )}

      {/* 4. Dynamic Retention Flow & Growth Loops Canvas */}
      {(showRetentionStreams || showGrowthLoops) && !reducedMotion && (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full opacity-70 dark:opacity-85"
        />
      )}

      {/* Subtle Texture */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff03_1px,transparent_1px)] [background-size:28px_28px] pointer-events-none opacity-40 dark:opacity-60" />
    </div>
  );
}
