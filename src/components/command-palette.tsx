'use client';

import { useCallback, useEffect, useRef, useState, useId } from 'react';

export interface Action {
  id: string;
  label: string;
  shortcut?: string;
  onSelect: () => void;
}

interface Props {
  actions: Action[];
  onClose: () => void;
}

export function CommandPalette({ actions, onClose }: Props) {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);
  const listboxId = useId();

  const filtered = actions.filter((a) =>
    a.label.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    previouslyFocusedRef.current = document.activeElement as HTMLElement | null;
    inputRef.current?.focus();

    return () => {
      previouslyFocusedRef.current?.focus?.();
    };
  }, []);

  const handleKey = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelected((s) => (filtered.length === 0 ? 0 : Math.min(s + 1, filtered.length - 1)));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelected((s) => Math.max(s - 1, 0));
      } else if (e.key === 'Enter' && filtered[selected]) {
        e.preventDefault();
        filtered[selected].onSelect();
        onClose();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    },
    [filtered, selected, onClose]
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-[12vh] sm:pt-[15vh]"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      style={{
        background: 'rgba(10, 15, 12, 0.72)',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        className="w-full max-w-lg overflow-hidden rounded-xl border border-[var(--cs-border)] bg-[var(--cs-surface)] text-[var(--cs-text)] shadow-2xl"
      >
        <div className="flex items-center border-b border-[var(--cs-border)] px-3 py-2.5">
          <span className="mr-2.5 text-xs text-[var(--cs-muted)] font-mono">⌘</span>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelected(0);
            }}
            onKeyDown={handleKey}
            placeholder="Type a command or search actions..."
            aria-label="Command search"
            aria-autocomplete="list"
            aria-controls={listboxId}
            className="w-full bg-transparent text-sm outline-none placeholder:text-[var(--cs-muted)]"
          />
          <kbd className="rounded border border-[var(--cs-border)] bg-[var(--cs-bg)] px-1.5 py-0.5 text-[10px] font-mono text-[var(--cs-muted)]">
            ESC
          </kbd>
        </div>

        <div
          id={listboxId}
          role="listbox"
          aria-label="Commands"
          className="max-h-64 overflow-y-auto p-1.5"
        >
          {filtered.length === 0 ? (
            <p className="p-3 text-center text-xs text-[var(--cs-muted)]">
              No matching actions found.
            </p>
          ) : (
            filtered.map((a, i) => {
              const isSelected = i === selected;
              return (
                <button
                  key={a.id}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => {
                    a.onSelect();
                    onClose();
                  }}
                  className={`flex min-h-[40px] w-full items-center justify-between rounded-lg px-3 py-2 text-left text-xs transition-colors ${
                    isSelected
                      ? 'bg-[var(--cs-accent-surface)] font-medium text-[var(--cs-primary)]'
                      : 'text-[var(--cs-text)] hover:bg-[var(--cs-bg)]'
                  }`}
                >
                  <span>{a.label}</span>
                  {a.shortcut && (
                    <span className="text-[10px] text-[var(--cs-muted)] font-mono">
                      {a.shortcut}
                    </span>
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

export function useCommandPalette(actions: Action[]) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen((o) => !o);
      }
    }
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const palette = open ? (
    <CommandPalette actions={actions} onClose={() => setOpen(false)} />
  ) : null;

  return { open, setOpen, palette };
}
