'use client';

import { useState } from 'react';
import { AVAILABLE_MODELS, getStoredModel, storeModel } from '@/lib/models';

interface Props {
  onModelChange: (model: string) => void;
}

export function ModelSelector({ onModelChange }: Props) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(getStoredModel());

  const current = AVAILABLE_MODELS.find((m) => m.id === selected) ?? AVAILABLE_MODELS[0];

  function pick(modelId: string) {
    setSelected(modelId);
    storeModel(modelId);
    onModelChange(modelId);
    setOpen(false);
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        aria-label="Select AI model"
        className="flex items-center gap-2 rounded-lg border border-black/15 px-3 py-1.5 text-xs font-medium transition-colors hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/10"
      >
        <span className="hidden sm:inline">{current.label}</span>
        <span className="sm:hidden">AI</span>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className={`transition-transform ${open ? 'rotate-180' : ''}`}>
          <path d="M3 5L6 8L9 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 z-50 mt-1 w-56 rounded-xl border border-black/15 bg-background py-1 shadow-xl dark:border-white/20">
            <div className="border-b border-black/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-gray-400 dark:border-white/15">
              AI Models
            </div>
            {AVAILABLE_MODELS.map((m) => (
              <button
                key={m.id}
                onClick={() => pick(m.id)}
                className={`flex w-full items-center justify-between px-3 py-2 text-left text-xs transition-colors hover:bg-black/5 dark:hover:bg-white/5 ${
                  m.id === selected ? 'bg-black/[0.03] font-semibold dark:bg-white/[0.03]' : ''
                }`}
              >
                <div>
                  <div className="text-sm">{m.label}</div>
                  <div className="text-gray-400">{m.provider}</div>
                </div>
                {m.id === selected && (
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M3 7.5L5.5 10L11 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
