'use client';

import { useEffect, useState } from 'react';
import type { AIInsightResult } from '@/types';

type Insight = AIInsightResult & { source?: 'ai' | 'mock' };

interface Props {
  insight: Insight | null;
  loading: boolean;
  onGenerate: () => void;
  disabled: boolean;
}

// Reveal text progressively for a subtle "streaming" feel while reading.
function useTypewriter(text: string, speedMs = 12) {
  const [shown, setShown] = useState('');
  useEffect(() => {
    // Intentional: reset + interval-driven reveal is a legitimate animation.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setShown('');
    if (!text) return;
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setShown(text.slice(0, i));
      if (i >= text.length) clearInterval(id);
    }, speedMs);
    return () => clearInterval(id);
  }, [text, speedMs]);
  return shown;
}

export function AIInsightCard({ insight, loading, onGenerate, disabled }: Props) {
  const streamedSummary = useTypewriter(insight?.summary ?? '');

  return (
    <div className="glass-card anim-fade-up delay-5 overflow-hidden">
      <div
        className="flex items-center justify-between px-6 py-4"
        style={{ borderBottom: '1px solid var(--card-border)' }}
      >
        <div className="flex items-center gap-2">
          <div className="gradient-bg flex h-7 w-7 items-center justify-center rounded-lg text-xs">🤖</div>
          <div className="flex items-baseline gap-2">
            <span className="text-xs font-bold uppercase tracking-wide">AI insight</span>
            {insight?.source === 'mock' && (
              <span className="text-[10px]" style={{ color: 'var(--muted)' }}>
                Rule-based
              </span>
            )}
          </div>
        </div>
        <button onClick={onGenerate} disabled={disabled || loading} className="btn-primary px-4 py-2 text-xs">
          {loading ? (
            <span className="flex items-center gap-2">
              <span
                className="inline-block h-3 w-3 rounded-full border-2 border-white/30 border-t-white"
                style={{ animation: 'spin-slow 0.8s linear infinite' }}
              />
              Analyzing…
            </span>
          ) : insight ? (
            '🔄 Regenerate'
          ) : (
            '✨ Generate'
          )}
        </button>
      </div>

      {loading && (
        <div style={{ background: 'color-mix(in srgb, var(--muted) 10%, transparent)' }}>
          <div className="progress-bar" />
        </div>
      )}

      {!loading && insight && (
        <div className="anim-fade space-y-4 p-6">
          <div>
            <h4 className="mb-2 text-[10px] font-semibold uppercase tracking-widest" style={{ color: 'var(--muted)' }}>
              Summary
            </h4>
            <p className="text-sm leading-relaxed">
              {streamedSummary}
              <span
                className="ml-0.5 inline-block h-4 w-0.5 animate-pulse align-text-bottom"
                style={{ background: 'var(--accent)' }}
              />
            </p>
          </div>

          <div
            className="rounded-xl p-4"
            style={{
              background: 'color-mix(in srgb, var(--accent) 6%, transparent)',
              border: '1px solid color-mix(in srgb, var(--accent) 15%, transparent)',
            }}
          >
            <h4 className="mb-2 text-[10px] font-semibold uppercase tracking-widest" style={{ color: 'var(--accent)' }}>
              💡 Recommendation
            </h4>
            <p className="text-sm leading-relaxed">{insight.recommendation}</p>
          </div>
        </div>
      )}

      {!loading && !insight && (
        <div className="flex flex-col items-center p-10 text-center">
          <div className="anim-float mb-3 text-4xl">🔮</div>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            Calculate metrics first, then generate an AI insight on what to do next.
          </p>
        </div>
      )}
    </div>
  );
}
