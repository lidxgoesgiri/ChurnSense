'use client';

import { useEffect, useRef, useState } from 'react';
import {
  AVAILABLE_MODELS,
  getStoredModel,
  storeModel,
  type ModelTier,
} from '@/lib/models';

interface Props {
  onModelChange: (model: string) => void;
}

const TIER_LABEL: Record<ModelTier, string> = {
  premium: 'Premium',
  strong: 'Standard',
  fast: 'Fast',
};

const TIER_ORDER: ModelTier[] = ['premium', 'strong', 'fast'];

export function ModelSelector({ onModelChange }: Props) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(getStoredModel());
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const current = AVAILABLE_MODELS.find((m) => m.id === selected) ?? AVAILABLE_MODELS[0];

  function pick(modelId: string) {
    setSelected(modelId);
    storeModel(modelId);
    onModelChange(modelId);
    setOpen(false);
    triggerRef.current?.focus();
  }

  // Handle Escape key and outside click
  useEffect(() => {
    if (!open) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setOpen(false);
        triggerRef.current?.focus();
      }
    }

    function handleClickOutside(e: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  return (
    <div className="relative">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(!open)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`AI model: ${current.label} (${current.provider})`}
        className="inline-flex min-h-[36px] items-center gap-2 rounded-lg border border-[var(--cs-control-border)] bg-[var(--cs-surface)] px-2.5 py-1 text-xs font-medium text-[var(--cs-text)] transition-colors hover:border-[var(--cs-focus)]"
      >
        <span
          className="h-2 w-2 rounded-full"
          style={{
            backgroundColor:
              current.tier === 'premium'
                ? 'var(--cs-primary)'
                : current.tier === 'strong'
                  ? 'var(--cs-accent)'
                  : 'var(--cs-muted)',
          }}
        />
        <span className="max-w-[110px] truncate sm:max-w-[150px]">{current.label}</span>
        <svg
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill="none"
          aria-hidden="true"
          className={`text-[var(--cs-muted)] transition-transform ${open ? 'rotate-180' : ''}`}
        >
          <path d="M2.5 3.75L5 6.25L7.5 3.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div
          ref={menuRef}
          role="listbox"
          aria-label="Available AI models"
          className="absolute right-0 z-50 mt-1 max-h-[70vh] w-64 overflow-y-auto rounded-xl border border-[var(--cs-border)] bg-[var(--cs-surface)] p-1 text-[var(--cs-text)] shadow-xl outline-none"
        >
          {TIER_ORDER.map((tier) => {
            const models = AVAILABLE_MODELS.filter((m) => m.tier === tier);
            if (models.length === 0) return null;
            return (
              <div key={tier} className="mb-1">
                <div className="px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-[var(--cs-muted)]">
                  {TIER_LABEL[tier]}
                </div>
                {models.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    role="option"
                    aria-selected={m.id === selected}
                    onClick={() => pick(m.id)}
                    className={`flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left text-xs transition-colors hover:bg-[var(--cs-bg)] ${
                      m.id === selected ? 'bg-[var(--cs-accent-surface)] font-semibold text-[var(--cs-primary)]' : ''
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="truncate text-xs font-medium text-[var(--cs-text)]">
                        {m.label}
                      </div>
                      <div className="text-[10px] text-[var(--cs-muted)]">{m.provider}</div>
                    </div>
                    {m.id === selected && (
                      <span className="text-xs text-[var(--cs-primary)] font-bold">✓</span>
                    )}
                  </button>
                ))}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
