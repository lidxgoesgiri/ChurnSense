'use client';

import { useEffect, useRef, useState } from 'react';
import type { AnalyticsResult, ProjectInput } from '@/types';
import { SendIcon, TrendingDownIcon } from './ui/icons';
import { SpotlightCard } from './web3/spotlight-card';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface Props {
  project: ProjectInput | null;
  metrics: AnalyticsResult | null;
  model?: string;
  userEmail: string;
}

const GREETING: ChatMessage = {
  role: 'assistant',
  content:
    'Ask me anything about your retention metrics — benchmark interpretation, churn reduction vectors, ARPU dynamics, or MRR optimization strategies.',
};

function storageKey(userEmail: string, projectName: string | undefined): string {
  return `churnsense-chat:${userEmail}:${projectName ?? '__none__'}`;
}

function loadHistory(key: string): ChatMessage[] {
  if (typeof window === 'undefined') return [GREETING];
  try {
    const stored = localStorage.getItem(key);
    const parsed = stored ? (JSON.parse(stored) as ChatMessage[]) : null;
    return parsed && parsed.length > 0 ? parsed : [GREETING];
  } catch {
    return [GREETING];
  }
}

export function AIChat({ project, metrics, model, userEmail }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([GREETING]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const [userScrolledUp, setUserScrolledUp] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const activeProjectRef = useRef<string | undefined>(project?.projectName);
  const abortControllerRef = useRef<AbortController | null>(null);

  const storeKey = storageKey(userEmail, project?.projectName);

  // Sync active project ref and abort ongoing request if project changes
  useEffect(() => {
    if (activeProjectRef.current !== project?.projectName) {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
      activeProjectRef.current = project?.projectName;
      setLoading(false);
      setStreaming(false);
    }
  }, [project?.projectName]);

  // Load history when scoped storeKey changes
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMessages(loadHistory(storeKey));
  }, [storeKey]);

  // Persist history
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(storeKey, JSON.stringify(messages.slice(-50)));
    } catch {
      /* storage quota exceeded or disabled — non-fatal */
    }
  }, [messages, storeKey]);

  // Detect if user has scrolled away from bottom
  function handleScroll() {
    if (!listRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = listRef.current;
    const distanceFromBottom = scrollHeight - (scrollTop + clientHeight);
    setUserScrolledUp(distanceFromBottom > 48);
  }

  function scrollToBottom(behavior: ScrollBehavior = 'smooth') {
    if (!listRef.current) return;
    listRef.current.scrollTo({
      top: listRef.current.scrollHeight,
      behavior,
    });
    setUserScrolledUp(false);
  }

  function clearHistory() {
    if (streaming || loading) return;
    setMessages([GREETING]);
    try {
      localStorage.removeItem(storeKey);
    } catch {
      /* ignore */
    }
  }

  function replaceLast(content: string) {
    setMessages((prev) => {
      const copy = [...prev];
      copy[copy.length - 1] = { role: 'assistant', content };
      return copy;
    });
  }

  async function send(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading || streaming || !project) return;

    setMessages((prev) => [...prev, { role: 'user', content: text }]);
    setInput('');
    setLoading(true);
    setUserScrolledUp(false);

    const controller = new AbortController();
    abortControllerRef.current = controller;
    const expectedProject = project.projectName;

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'ChurnSense',
        },
        signal: controller.signal,
        body: JSON.stringify({
          message: text,
          context: metrics
            ? {
                projectName: project.projectName,
                totalUsers: project.totalUsers,
                activeUsers: project.activeUsers,
                churnedUsers: project.churnedUsers,
                monthlyRevenue: project.monthlyRevenue,
                churnRate: metrics.churnRate,
                retentionRate: metrics.retentionRate,
                arpu: metrics.arpu,
                riskStatus: metrics.riskStatus,
              }
            : null,
          model,
          stream: true,
        }),
      });

      // Ignore if user switched projects while waiting
      if (activeProjectRef.current !== expectedProject) return;

      const contentType = res.headers.get('content-type') ?? '';
      if (res.ok && res.body && contentType.includes('text/plain')) {
        setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);
        setLoading(false);
        setStreaming(true);

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let acc = '';

        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          if (activeProjectRef.current !== expectedProject) break;
          acc += decoder.decode(value, { stream: true });
          replaceLast(acc);
          if (!userScrolledUp) {
            scrollToBottom('auto');
          }
        }

        if (activeProjectRef.current === expectedProject) {
          replaceLast(acc || 'No response received.');
        }
        setStreaming(false);
      } else {
        const data = await res.json().catch(() => ({}));
        if (activeProjectRef.current === expectedProject) {
          setMessages((prev) => [
            ...prev,
            { role: 'assistant', content: data.reply || data.error || 'No response.' },
          ]);
        }
        setLoading(false);
      }
    } catch (err: unknown) {
      if ((err as Error)?.name === 'AbortError') return;
      if (activeProjectRef.current === expectedProject) {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: 'Connection interrupted. Please try again.' },
        ]);
        setLoading(false);
        setStreaming(false);
      }
    } finally {
      if (activeProjectRef.current === expectedProject && !userScrolledUp) {
        scrollToBottom();
      }
      abortControllerRef.current = null;
    }
  }

  return (
    <SpotlightCard
      glowColor="rgba(6, 182, 212, 0.22)"
      className="p-6 sm:p-7 space-y-4"
      role="region"
      aria-label="AI retention assistant chat"
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--cs-border)] pb-3.5">
        <div>
          <span className="font-mono text-[10px] uppercase font-bold tracking-wider text-cyan-400">
            {'// AUTONOMOUS AGENT · CONTEXTUAL TERMINAL'}
          </span>
          <div className="flex items-center gap-2.5 pt-0.5">
            <h3 className="text-base font-extrabold text-[var(--cs-text)]">Agent Console</h3>
            <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 font-mono text-[10px] font-semibold text-emerald-400 border border-emerald-500/25 flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              ONLINE
            </span>
          </div>
          <p className="font-mono text-[11px] text-[var(--cs-muted)]">
            {project ? `SCOPE // ${project.projectName}` : 'Calculate a project to establish contextual session'}
          </p>
        </div>

        {messages.length > 1 && (
          <button
            type="button"
            onClick={clearHistory}
            disabled={loading || streaming}
            aria-label="Clear chat messages"
            className="rounded-lg border border-[var(--cs-border)] bg-[var(--cs-bg)] px-2.5 py-1 font-mono text-xs text-[var(--cs-muted)] hover:text-rose-400 hover:border-rose-500/30 disabled:opacity-40 transition-all"
          >
            [PURGE LOG]
          </button>
        )}
      </div>

      {/* Message Log Container */}
      <div className="relative">
        <div
          ref={listRef}
          onScroll={handleScroll}
          role="log"
          aria-live="polite"
          aria-label="Chat messages"
          className="flex h-60 flex-col gap-3.5 overflow-y-auto rounded-xl border border-[var(--cs-border)] bg-[var(--cs-bg)]/80 p-4 font-mono text-xs"
        >
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex flex-col gap-1 max-w-[88%] ${
                m.role === 'user' ? 'ml-auto items-end' : 'items-start'
              }`}
            >
              <span className="font-mono text-[10px] uppercase text-[var(--cs-muted)]">
                {m.role === 'user' ? 'OPERATOR // SESSION' : 'AGENT // CHURNSENSE_LLM'}
              </span>
              <div
                className={`rounded-2xl px-4 py-2.5 leading-relaxed whitespace-pre-wrap ${
                  m.role === 'user'
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-br-none shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                    : 'bg-[var(--cs-surface)] text-[var(--cs-text)] border border-[var(--cs-border)] rounded-bl-none shadow-md backdrop-blur-md'
                }`}
              >
                {m.content}
              </div>
            </div>
          ))}

          {loading && !streaming && (
            <div className="flex items-center gap-2 text-xs text-emerald-400 py-1 font-mono">
              <span
                className="inline-block h-3.5 w-3.5 rounded-full border-2 border-emerald-400 border-t-transparent animate-spin"
              />
              AUDITING RETENTION VECTORS…
            </div>
          )}
        </div>

        {/* Jump to Latest Button */}
        {userScrolledUp && (
          <button
            type="button"
            onClick={() => scrollToBottom()}
            className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-[var(--cs-surface)] px-3 py-1 text-xs font-mono text-emerald-400 shadow-xl hover:bg-[var(--cs-bg)] backdrop-blur-md"
          >
            <TrendingDownIcon size={14} />
            <span>Latest</span>
          </button>
        )}
      </div>

      {/* Composer Form */}
      <form onSubmit={send} className="flex gap-2.5">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            project
              ? `Prompt agent regarding ${project.projectName} retention levers, benchmarks, or ARPU…`
              : 'Calculate project metrics above to enable chat…'
          }
          disabled={!project || loading || streaming}
          aria-label="Your message to AI assistant"
          className="input-glow flex-1 font-mono text-xs rounded-xl"
        />
        <button
          type="submit"
          disabled={!project || loading || streaming || !input.trim()}
          aria-label="Send chat message"
          className="btn-primary min-h-[42px] px-5 font-mono text-xs font-semibold uppercase tracking-wider inline-flex items-center gap-1.5 rounded-xl"
        >
          {loading || streaming ? (
            <span>Sending…</span>
          ) : (
            <>
              <SendIcon size={14} />
              <span>Prompt</span>
            </>
          )}
        </button>
      </form>
    </SpotlightCard>
  );
}
