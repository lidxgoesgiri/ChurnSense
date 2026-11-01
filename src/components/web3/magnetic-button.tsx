'use client';

import React, { useRef, useState } from 'react';
import { useReducedMotion } from '@/lib/use-reduced-motion';

interface MagneticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  strength?: number;
  variant?: 'primary' | 'secondary' | 'ghost' | 'glow';
  className?: string;
  as?: 'button' | 'a';
  href?: string;
}

export function MagneticButton({
  children,
  strength = 0.28,
  variant = 'primary',
  className = '',
  as = 'button',
  href,
  onClick,
  ...props
}: MagneticButtonProps) {
  const buttonRef = useRef<HTMLButtonElement | HTMLAnchorElement | null>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const reducedMotion = useReducedMotion();

  const handleMouseMove = (e: React.MouseEvent) => {
    if (reducedMotion || !buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = (e.clientX - centerX) * strength;
    const deltaY = (e.clientY - centerY) * strength;

    setPosition({ x: deltaX, y: deltaY });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setPosition({ x: 0, y: 0 });
  };

  const baseStyles =
    'relative inline-flex items-center justify-center font-mono font-semibold tracking-wider uppercase transition-transform ease-out duration-200 select-none cursor-pointer';

  const variantStyles = {
    primary:
      'bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 text-black shadow-[0_0_24px_rgba(16,185,129,0.35)] hover:shadow-[0_0_36px_rgba(16,185,129,0.6)] border border-emerald-400/30 rounded-xl px-6 py-3 text-xs',
    glow:
      'bg-[var(--cs-surface)] text-[var(--cs-text)] border border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:border-emerald-400 hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] rounded-xl px-6 py-3 text-xs backdrop-blur-xl',
    secondary:
      'bg-[var(--cs-surface)]/80 text-[var(--cs-text)] border border-[var(--cs-border)] hover:border-emerald-500/30 hover:bg-[var(--cs-elevated)] rounded-xl px-5 py-3 text-xs backdrop-blur-md',
    ghost:
      'bg-transparent text-[var(--cs-muted)] hover:text-[var(--cs-text)] hover:bg-white/5 rounded-lg px-4 py-2 text-xs',
  };

  const transformStyle = !reducedMotion
    ? {
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
        transition: isHovered
          ? 'transform 0.1s cubic-bezier(0.25, 1, 0.5, 1)'
          : 'transform 0.45s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      }
    : undefined;

  const content = (
    <>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]"
      >
        <span
          className={`absolute -inset-full h-full w-[200%] bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 ${
            isHovered ? 'translate-x-full' : '-translate-x-full'
          }`}
        />
      </span>
      <span
        className="relative z-10 flex items-center justify-center gap-2"
        style={
          !reducedMotion && isHovered
            ? {
                transform: `translate3d(${position.x * 0.35}px, ${position.y * 0.35}px, 0)`,
                transition: 'transform 0.1s ease-out',
              }
            : undefined
        }
      >
        {children}
      </span>
    </>
  );

  if (as === 'a' && href) {
    return (
      <a
        ref={buttonRef as React.Ref<HTMLAnchorElement>}
        href={href}
        style={transformStyle}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      ref={buttonRef as React.Ref<HTMLButtonElement>}
      type={props.type || 'button'}
      style={transformStyle}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {content}
    </button>
  );
}
