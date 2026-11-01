'use client';

import React, { useEffect, useRef } from 'react';
import { useReducedMotion } from '@/lib/use-reduced-motion';

interface CyberBackgroundProps {
  intensity?: 'subtle' | 'vibrant';
  showGrid?: boolean;
  showParticles?: boolean;
  showAurora?: boolean;
  showSpotlight?: boolean;
}

export function CyberBackground({
  intensity = 'subtle',
  showGrid = true,
  showParticles = true,
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

  // Dynamic particle constellation canvas
  useEffect(() => {
    if (!showParticles || reducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    let animationFrameId: number;
    let isVisible = true;

    // Handle resize
    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    // Handle visibility to save battery/resources
    const handleVisibilityChange = () => {
      isVisible = !document.hidden;
    };

    window.addEventListener('resize', handleResize);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Particle nodes definition
    const particleCount = intensity === 'vibrant' ? 45 : 28;
    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      baseAlpha: number;
      pulseSpeed: number;
      pulseAngle: number;
      color: string;
    }

    const particles: Particle[] = [];
    const colors = [
      'rgba(16, 185, 129,', // Emerald
      'rgba(6, 182, 212,',  // Cyan
      'rgba(99, 102, 241,', // Indigo
      'rgba(244, 63, 94,',  // Rose subtle
    ];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        radius: Math.random() * 1.5 + 0.8,
        baseAlpha: Math.random() * 0.4 + 0.15,
        pulseSpeed: Math.random() * 0.02 + 0.01,
        pulseAngle: Math.random() * Math.PI * 2,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    let mouseX = -1000;
    let mouseY = -1000;

    const handleCanvasMouse = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    window.addEventListener('mousemove', handleCanvasMouse, { passive: true });

    // Render loop
    const render = () => {
      if (!isVisible) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      // Draw particles & links
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Move
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around boundaries
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // Gentle mouse interaction
        const dx = mouseX - p.x;
        const dy = mouseY - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120 && dist > 0) {
          const force = (120 - dist) / 120;
          p.x -= (dx / dist) * force * 1.2;
          p.y -= (dy / dist) * force * 1.2;
        }

        // Pulse alpha
        p.pulseAngle += p.pulseSpeed;
        const currentAlpha = p.baseAlpha + Math.sin(p.pulseAngle) * 0.15;

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color} ${Math.max(0.05, currentAlpha)})`;
        ctx.fill();

        // Connect nearby particles with subtle filament
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist2 = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist2 < 110) {
            const lineAlpha = (1 - dist2 / 110) * 0.12;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(16, 185, 129, ${lineAlpha})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('mousemove', handleCanvasMouse);
      cancelAnimationFrame(animationFrameId);
    };
  }, [showParticles, intensity, reducedMotion]);

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
          className="absolute inset-0 bg-cyber-grid bg-[length:40px_40px] opacity-[0.035] dark:opacity-[0.07] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_40%,#000_30%,transparent_100%)]"
        />
      )}

      {/* 3. Interactive Mouse Spotlight Glow */}
      {showSpotlight && !reducedMotion && (
        <div
          ref={spotlightRef}
          className="will-change-transform absolute -top-0 -left-0 h-[700px] w-[700px] rounded-full pointer-events-none opacity-25 dark:opacity-30 blur-[90px] bg-[radial-gradient(circle,rgba(16,185,129,0.35)_0%,rgba(6,182,212,0.15)_45%,transparent_70%)] transition-opacity duration-300"
        />
      )}

      {/* 4. Dynamic Particle Constellation Canvas */}
      {showParticles && !reducedMotion && (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full opacity-60 dark:opacity-80"
        />
      )}

      {/* Subtle Noise Texture */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff04_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-40 dark:opacity-60" />
    </div>
  );
}
