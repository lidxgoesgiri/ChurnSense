'use client';

import Image from 'next/image';
import { ThemeToggle } from './theme-toggle';
import { ModelSelector } from './model-selector';
import { FileSpreadsheetIcon } from './ui/icons';

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
    <header className="sticky top-0 z-40 border-b border-[var(--cs-border)] bg-[var(--cs-surface)]/80 backdrop-blur-2xl">
      <div className="mx-auto flex min-h-[64px] max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-2.5 sm:px-6 lg:px-8">
        {/* Brand & Telemetry Badge */}
        <div className="flex items-center gap-3.5">
          <div className="relative group">
            <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 opacity-30 blur-sm group-hover:opacity-70 transition-opacity" />
            <Image
              src="/churn.jpg"
              alt="ChurnSense logo"
              width={36}
              height={36}
              priority
              className="relative rounded-xl border border-white/20 shadow-md object-cover"
            />
            <span
              className="absolute -bottom-0.5 -right-0.5 flex h-2.5 w-2.5"
              title="Protocol Engine Online"
            >
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-sm font-extrabold tracking-tight text-[var(--cs-text)]">
                CHURNSENSE
              </span>
              <span className="hidden rounded border border-emerald-500/30 bg-emerald-500/10 px-1.5 py-0.5 text-[9px] font-mono font-semibold text-emerald-400 sm:inline">
                MAINNET V2.4
              </span>
            </div>
            <div className="flex items-center gap-2 font-mono text-[10px] text-[var(--cs-muted)]">
              <span>WORKBENCH CONSOLE</span>
              <span className="hidden text-emerald-500/60 sm:inline">· 12ms</span>
            </div>
          </div>
        </div>

        {/* Section Quick Nav */}
        <nav aria-label="Dashboard sections" className="hidden items-center gap-1.5 lg:flex">
          <a
            href="#analyze-section"
            className="rounded-lg px-3 py-1.5 text-xs font-mono font-medium text-[var(--cs-muted)] transition-all hover:bg-emerald-500/10 hover:text-emerald-400"
          >
            {'// ANALYZE'}
          </a>
          <a
            href="#results-section"
            className="rounded-lg px-3 py-1.5 text-xs font-mono font-medium text-[var(--cs-muted)] transition-all hover:bg-emerald-500/10 hover:text-emerald-400"
          >
            {'// METRICS'}
          </a>
          <a
            href="#snapshots-section"
            className="rounded-lg px-3 py-1.5 text-xs font-mono font-medium text-[var(--cs-muted)] transition-all hover:bg-emerald-500/10 hover:text-emerald-400"
          >
            {'// SNAPSHOTS'}
          </a>
          <a
            href="#ai-section"
            className="rounded-lg px-3 py-1.5 text-xs font-mono font-medium text-[var(--cs-muted)] transition-all hover:bg-emerald-500/10 hover:text-emerald-400"
          >
            {'// AI AGENT'}
          </a>
        </nav>

        {/* Actions & Context */}
        <div className="flex flex-wrap items-center justify-end gap-2.5">
          {onOpenCommands && (
            <button
              type="button"
              onClick={onOpenCommands}
              aria-label="Open command palette"
              className="inline-flex min-h-[36px] items-center gap-2 rounded-xl border border-[var(--cs-border)] bg-[var(--cs-surface)]/80 px-3 py-1 text-xs font-mono text-[var(--cs-muted)] transition-all hover:border-emerald-500/40 hover:text-[var(--cs-text)] shadow-sm"
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
              className="inline-flex min-h-[36px] items-center gap-1.5 rounded-xl border border-[var(--cs-border)] bg-[var(--cs-surface)]/80 px-3 py-1 text-xs font-mono font-medium text-[var(--cs-text)] transition-all hover:border-emerald-500/40 hover:bg-[var(--cs-elevated)]"
            >
              <FileSpreadsheetIcon className="h-3.5 w-3.5 text-emerald-400" />
              <span>Export CSV</span>
            </button>
          )}

          <ThemeToggle />

          <div className="hidden h-5 w-px bg-[var(--cs-border)] sm:block" />

          {/* Account Identity & Logout */}
          <div className="flex items-center gap-2.5">
            <div
              className="hidden max-w-[140px] truncate rounded-lg border border-[var(--cs-border)] bg-[var(--cs-bg)] px-2.5 py-1 font-mono text-[11px] text-[var(--cs-muted)] sm:inline"
              title={email}
            >
              {email}
            </div>
            <button
              type="button"
              onClick={onLogout}
              aria-label="Sign out"
              className="inline-flex min-h-[36px] items-center rounded-xl border border-rose-500/25 bg-rose-500/5 px-3 py-1 font-mono text-xs font-semibold text-rose-400 transition-all hover:bg-rose-500/15 hover:border-rose-500/40"
            >
              Disconnect
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
