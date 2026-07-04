'use client';

import { ThemeToggle } from './theme-toggle';
import { ModelSelector } from './model-selector';

interface Props {
  email: string;
  onModelChange: (model: string) => void;
  onExport?: () => void;
  showExport?: boolean;
  onLogout: () => void;
}

export function Navbar({ email, onModelChange, onExport, showExport, onLogout }: Props) {
  return (
    <header
      className="anim-fade-down sticky top-0 z-40"
      style={{
        background: 'color-mix(in srgb, var(--background) 72%, transparent)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--card-border)',
      }}
    >
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="gradient-bg flex h-9 w-9 items-center justify-center rounded-xl text-lg shadow-sm">
            📊
          </div>
          <span className="gradient-text text-lg font-bold">ChurnSense</span>
          <span
            className="rounded-full px-2 py-0.5 text-[10px] font-semibold"
            style={{
              background: 'color-mix(in srgb, var(--accent) 12%, transparent)',
              color: 'var(--accent)',
            }}
          >
            BETA
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-2">
          <ModelSelector onModelChange={onModelChange} />
          {showExport && onExport && (
            <button
              onClick={onExport}
              aria-label="Export saved projects as CSV"
              className="rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors hover:bg-black/5 dark:hover:bg-white/10"
              style={{ borderColor: 'var(--card-border)' }}
            >
              Export CSV
            </button>
          )}
          <ThemeToggle />
          <div className="mx-1 hidden h-5 w-px sm:block" style={{ background: 'var(--card-border)' }} />
          <div
            className="gradient-bg hidden h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white sm:flex"
            title={email}
            aria-hidden
          >
            {email.charAt(0).toUpperCase()}
          </div>
          <button
            onClick={onLogout}
            aria-label="Sign out"
            className="rounded-lg px-3 py-1.5 text-xs font-medium transition-opacity hover:opacity-80"
            style={{ background: 'rgba(239,68,68,0.08)', color: '#ef4444' }}
          >
            Sign out
          </button>
        </div>
      </div>
    </header>
  );
}
