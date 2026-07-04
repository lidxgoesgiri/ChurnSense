'use client';

import { useTheme } from './theme-provider';

export function ThemeToggle() {
  const { theme, toggle } = useTheme();

  return (
    <button
      onClick={toggle}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      className="flex h-9 w-9 items-center justify-center rounded-xl transition-transform duration-300 hover:scale-110"
      style={{
        background: 'color-mix(in srgb, var(--muted) 10%, transparent)',
        border: '1px solid var(--card-border)',
      }}
    >
      <span
        className="text-base transition-transform duration-500"
        style={{ transform: theme === 'dark' ? 'rotate(360deg)' : 'rotate(0deg)' }}
      >
        {theme === 'light' ? '🌙' : '☀️'}
      </span>
    </button>
  );
}
