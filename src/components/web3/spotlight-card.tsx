'use client';

import React, { useRef, useState } from 'react';
import { useReducedMotion } from '@/lib/use-reduced-motion';

interface SpotlightCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  glowColor?: string;
  enableTilt?: boolean;
  className?: string;
}

export function SpotlightCard({
  children,
  glowColor = 'rgba(16, 185, 129, 0.18)',
  enableTilt = true,
  className = '',
  ...props
}: SpotlightCardProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const reducedMotion = useReducedMotion();

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setMousePos({ x, y });

    if (enableTilt && !reducedMotion) {
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rx = ((y - centerY) / centerY) * -4.5;
      const ry = ((x - centerX) / centerX) * 4.5;
      setTilt({ rx, ry });
    }
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ rx: 0, ry: 0 });
  };

  const transformStyle =
    enableTilt && !reducedMotion
      ? {
          transform: isHovered
            ? `perspective(1000px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) translateZ(4px)`
            : 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)',
          transition: isHovered
            ? 'transform 0.1s ease-out'
            : 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        }
      : undefined;

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={transformStyle}
      className={`group relative overflow-hidden rounded-2xl border border-[var(--cs-border)] bg-[var(--cs-surface)]/90 backdrop-blur-xl transition-all duration-300 hover:border-emerald-500/35 hover:shadow-[0_10px_35px_-5px_rgba(0,0,0,0.5),0_0_20px_-3px_rgba(16,185,129,0.15)] ${className}`}
      {...props}
    >
      {/* 1. Dynamic Cursor Spotlight Light Effect */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, ${glowColor}, transparent 65%)`,
        }}
      />

      {/* 2. Sleek Hairline Gradient Border Accent on Hover */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-2xl border border-transparent [mask-clip:padding-box,border-box] [mask-composite:intersect] [mask-image:linear-gradient(transparent,transparent),linear-gradient(#000,#000)] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(350px circle at ${mousePos.x}px ${mousePos.y}px, rgba(16, 185, 129, 0.6), transparent 70%)`,
        }}
      />

      {/* 3. Card Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
