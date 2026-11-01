'use client';

import Image from 'next/image';
import { ThemeToggle } from './theme-toggle';
import { ModelSelector } from './model-selector';

interface Props {
  email: string;
  onModelChange: (model: string) => void;
  onExport?: () => void;
  showExport?: boolean;
  onOpenCommands?: () => void;
  onLogout: () => void;
}

export function Navbar({
  email,
  onModelChange,
  onExport,
  showExport,
  onOpenCommands,
  onLogout,
}: Props) {
  return (
    <header
      className="sticky top-0 z-40 border-b border-[var(--cs-border)] bg-[var(--cs-surface)]/95 backdrop-blur-md"
    >
      <div className="mx-auto flex min-h-[60px] max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-2 sm:px-6">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <Image
            src="/churn.jpg"
            alt="ChurnSense logo"
            width={32}
            height={32}
            priority
            className="rounded-lg border border-[var(--cs-border)]"
          />
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-tight text-[var(--cs-text)]">
              ChurnSense
            </span>
            <span className="hidden text-[10px] text-[var(--cs-muted)] sm:inline">
              Retention Workbench
            </span>
          </div>
        </div>

        {/* Section Quick Nav */}
        <nav aria-label="Dashboard sections" className="hidden items-center gap-1 md:flex">
          <a
            href="#analyze-section"
            className="rounded-md px-2.5 py-1 text-xs font-medium text-[var(--cs-muted)] hover:bg-[var(--cs-bg)] hover:text-[var(--cs-text)]"
          >
            Analyze
          </a>
          <a
            href="#results-section"
            className="rounded-md px-2.5 py-1 text-xs font-medium text-[var(--cs-muted)] hover:bg-[var(--cs-bg)] hover:text-[var(--cs-text)]"
          >
            Metrics
          </a>
          <a
            href="#snapshots-section"
            className="rounded-md px-2.5 py-1 text-xs font-medium text-[var(--cs-muted)] hover:bg-[var(--cs-bg)] hover:text-[var(--cs-text)]"
          >
            Snapshots
          </a>
          <a
            href="#ai-section"
            className="rounded-md px-2.5 py-1 text-xs font-medium text-[var(--cs-muted)] hover:bg-[var(--cs-bg)] hover:text-[var(--cs-text)]"
          >
            AI Assistant
          </a>
        </nav>

        {/* Actions & Context */}
        <div className="flex flex-wrap items-center justify-end gap-2">
          {onOpenCommands && (
            <button
              type="button"
              onClick={onOpenCommands}
              aria-label="Open command palette"
              className="inline-flex min-h-[36px] items-center gap-2 rounded-lg border border-[var(--cs-control-border)] bg-[var(--cs-surface)] px-2.5 py-1 text-xs font-medium text-[var(--cs-muted)] transition-colors hover:border-[var(--cs-focus)] hover:text-[var(--cs-text)]"
            >
              <span className="hidden sm:inline">Commands</span>
              <kbd className="rounded border border-[var(--cs-border)] bg-[var(--cs-bg)] px-1.5 py-0.5 text-[10px] font-mono text-[var(--cs-text)]">
                ⌘K
              </kbd>
            </button>
          )}

          <ModelSelector onModelChange={onModelChange} />

          {showExport && onExport && (
            <button
              type="button"
              onClick={onExport}
              aria-label="Export loaded snapshots as CSV"
              className="inline-flex min-h-[36px] items-center gap-1.5 rounded-lg border border-[var(--cs-control-border)] bg-[var(--cs-surface)] px-2.5 py-1 text-xs font-medium text-[var(--cs-text)] transition-colors hover:bg-[var(--cs-bg)]"
            >
              <span>Export</span>
            </button>
          )}

          <ThemeToggle />

          <div className="hidden h-4 w-px bg-[var(--cs-border)] sm:block" />

          {/* Account email & logout */}
          <div className="flex items-center gap-2">
            <span
              className="hidden max-w-[130px] truncate text-xs text-[var(--cs-muted)] sm:inline"
              title={email}
            >
              {email}
            </span>
            <button
              type="button"
              onClick={onLogout}
              aria-label="Sign out"
              className="inline-flex min-h-[36px] items-center rounded-lg border border-[var(--cs-border)] px-2.5 py-1 text-xs font-medium text-[var(--cs-danger)] transition-colors hover:bg-red-500/10"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
