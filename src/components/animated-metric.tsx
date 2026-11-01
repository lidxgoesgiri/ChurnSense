'use client';

import { useEffect, useRef, useState } from 'react';

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

export function AnimatedMetric({
  value,
  prefix = '',
  suffix = '',
  decimals = 2,
  duration = 600,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  duration?: number;
}) {
  const [display, setDisplay] = useState(value);
  const raf = useRef<number>(0);

  useEffect(() => {
    // Respect reduced-motion: snap straight to the final value.
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced) {
      // Intentional: snap to final value for reduced-motion users.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDisplay(value);
      return;
    }

    const start = performance.now();

    function tick(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutCubic(progress);
      setDisplay(value * eased);

      if (progress < 1) {
        raf.current = requestAnimationFrame(tick);
      }
    }

    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [value, duration]);

  const finalFormatted = `${prefix}${value.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}${suffix}`;

  const currentFormatted = `${prefix}${display.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}${suffix}`;

  return (
    <span className="font-tabular">
      {/* Visual display during RAF */}
      <span aria-hidden="true">{currentFormatted}</span>
      {/* Screen-reader friendly semantic text */}
      <span className="sr-only">{finalFormatted}</span>
    </span>
  );
}
