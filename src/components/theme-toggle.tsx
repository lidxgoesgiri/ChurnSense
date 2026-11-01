'use client';

import { useTheme } from './theme-provider';
import { SunIcon, MoonIcon } from './ui/icons';

export function ThemeToggle() {
  const { theme, toggle } = useTheme();

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--cs-border)] bg-[var(--cs-surface)] text-[var(--cs-muted)] transition-colors hover:border-[var(--cs-control-border)] hover:text-[var(--cs-text)]"
    >
      {theme === 'light' ? (
        <MoonIcon size={16} className="text-[var(--cs-muted)]" />
      ) : (
        <SunIcon size={16} className="text-amber-400" />
      )}
    </button>
  );
}
