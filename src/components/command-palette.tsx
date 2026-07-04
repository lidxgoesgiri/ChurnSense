'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

interface Action {
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

  const filtered = actions.filter((a) =>
    a.label.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleKey = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelected((s) => Math.min(s + 1, filtered.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelected((s) => Math.max(s - 1, 0));
      } else if (e.key === 'Enter' && filtered[selected]) {
        filtered[selected].onSelect();
        onClose();
      } else if (e.key === 'Escape') {
        onClose();
      }
    },
    [filtered, selected, onClose]
  );

  return (
    <div
      className="anim-fade fixed inset-0 z-50 flex items-start justify-center pt-[15vh]"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        background: 'rgba(0,0,0,0.35)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
      }}
    >
      <div
        className="anim-scale w-full max-w-lg glass-card overflow-hidden"
        style={{ boxShadow: '0 8px 40px rgba(0,0,0,0.25)' }}
      >
        <div className="border-b border-black/10 p-3 dark:border-white/15">
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelected(0); // reset highlight when the query changes
            }}
            onKeyDown={handleKey}
            placeholder="Search actions..."
            aria-label="Command palette search"
            className="w-full bg-transparent text-sm outline-none placeholder:text-gray-400"
          />
        </div>
        <div className="max-h-64 overflow-y-auto p-2">
          {filtered.length === 0 && (
            <p className="p-2 text-sm text-gray-400">No results.</p>
          )}
          {filtered.map((a, i) => (
            <button
              key={a.id}
              onClick={() => { a.onSelect(); onClose(); }}
              className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                i === selected ? 'bg-black/10 dark:bg-white/10' : 'hover:bg-black/5 dark:hover:bg-white/5'
              }`}
            >
              <span>{a.label}</span>
              {a.shortcut && (
                <span className="text-xs text-gray-400">{a.shortcut}</span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Hook: call `useCommandPalette(actions)` to get `{ open, setOpen, bindKey }`.
 * Renders the CommandPalette when open is true. Your component must call
 * `bindKey` in a useEffect.
 */
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
