'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '@/lib/use-reduced-motion';

interface RevealAnimationProps {
  children: React.ReactNode;
  delayMs?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  className?: string;
}

export function RevealAnimation({
  children,
  delayMs = 0,
  direction = 'up',
  className = '',
}: RevealAnimationProps) {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement | null>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (elementRef.current) observer.unobserve(elementRef.current);
        }
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    const el = elementRef.current;
    if (el) observer.observe(el);

    return () => {
      if (el) observer.unobserve(el);
    };
  }, [reducedMotion]);

  if (reducedMotion) {
    return <div className={className}>{children}</div>;
  }

  const getTransform = () => {
    if (isVisible) return 'translate3d(0, 0, 0) scale(1)';
    switch (direction) {
      case 'up':
        return 'translate3d(0, 28px, 0) scale(0.98)';
      case 'down':
        return 'translate3d(0, -28px, 0) scale(0.98)';
      case 'left':
        return 'translate3d(28px, 0, 0) scale(0.98)';
      case 'right':
        return 'translate3d(-28px, 0, 0) scale(0.98)';
      default:
        return 'translate3d(0, 0, 0) scale(0.98)';
    }
  };

  return (
    <div
      ref={elementRef}
      style={{
        transform: getTransform(),
        opacity: isVisible ? 1 : 0,
        filter: isVisible ? 'blur(0px)' : 'blur(4px)',
        transition: `transform 0.75s cubic-bezier(0.16, 1, 0.3, 1) ${delayMs}ms, opacity 0.75s cubic-bezier(0.16, 1, 0.3, 1) ${delayMs}ms, filter 0.75s cubic-bezier(0.16, 1, 0.3, 1) ${delayMs}ms`,
      }}
      className={className}
    >
      {children}
    </div>
  );
}
