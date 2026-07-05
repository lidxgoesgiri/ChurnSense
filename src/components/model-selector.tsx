'use client';

import { useState } from 'react';
import {
  AVAILABLE_MODELS,
  getStoredModel,
  storeModel,
  TIER_GLOW,
  type ModelTier,
} from '@/lib/models';

interface Props {
  onModelChange: (model: string) => void;
}

const TIER_LABEL: Record<ModelTier, string> = {
  premium: 'Premium · smartest',
  strong: 'Strong · general',
  fast: 'Fast · lightweight',
};

const TIER_ORDER: ModelTier[] = ['premium', 'strong', 'fast'];

export function ModelSelector({ onModelChange }: Props) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(getStoredModel());

  const current = AVAILABLE_MODELS.find((m) => m.id === selected) ?? AVAILABLE_MODELS[0];
  const glow = TIER_GLOW[current.tier];

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
        className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition-all"
        style={{
          border: `1px solid ${glow}`,
          // Subtle cinematic border-glow tinted by the model's tier.
          boxShadow: `0 0 10px -1px ${glow}66, inset 0 0 6px -3px ${glow}`,
          background: `color-mix(in srgb, ${glow} 8%, transparent)`,
        }}
      >
        <span className="h-2 w-2 rounded-full" style={{ background: glow, boxShadow: `0 0 6px ${glow}` }} />
        <span className="hidden max-w-[9rem] truncate sm:inline">{current.label}</span>
        <span className="sm:hidden">AI</span>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className={`transition-transform ${open ? 'rotate-180' : ''}`}>
          <path d="M3 5L6 8L9 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div
            className="glass-card anim-scale absolute right-0 z-50 mt-1 max-h-[70vh] w-64 overflow-y-auto py-1"
            style={{ boxShadow: '0 8px 40px rgba(0,0,0,0.25)' }}
          >
            {TIER_ORDER.map((tier) => {
              const models = AVAILABLE_MODELS.filter((m) => m.tier === tier);
              if (models.length === 0) return null;
              const tierGlow = TIER_GLOW[tier];
              return (
                <div key={tier}>
                  <div
                    className="flex items-center gap-1.5 px-3 pt-2 pb-1 text-[10px] font-semibold uppercase tracking-widest"
                    style={{ color: tierGlow }}
                  >
                    <span className="h-1.5 w-1.5 rounded-full" style={{ background: tierGlow }} />
                    {TIER_LABEL[tier]}
                  </div>
                  {models.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => pick(m.id)}
                      className={`flex w-full items-center justify-between px-3 py-2 text-left text-xs transition-colors hover:bg-black/5 dark:hover:bg-white/10 ${
                        m.id === selected ? 'bg-black/[0.04] font-semibold dark:bg-white/[0.06]' : ''
                      }`}
                    >
                      <span className="min-w-0">
                        <span className="block truncate text-sm">{m.label}</span>
                        <span className="block text-gray-400">{m.provider}</span>
                      </span>
                      {m.id === selected && (
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ color: tierGlow }}>
                          <path d="M3 7.5L5.5 10L11 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
