'use client';

import { useTheme } from './theme-provider';

export function ThemeToggle() {
  const { theme, toggle } = useTheme();

  return (
    <button
      onClick={toggle}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      className="rounded-lg border border-black/15 p-2 text-sm transition-colors hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/10"
    >
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  );
}
