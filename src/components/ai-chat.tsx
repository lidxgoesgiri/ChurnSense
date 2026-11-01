'use client';

import { useEffect, useRef, useState } from 'react';
import type { AnalyticsResult, ProjectInput } from '@/types';

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
    'Ask me anything about your retention metrics — benchmark interpretation, churn reduction ideas, or MRR optimization.',
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
    // Intentional: read localStorage only on the client, post-hydration.
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
    <div className="workbench-panel space-y-3 p-5 sm:p-6" aria-label="AI retention assistant chat">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--cs-border)] pb-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-[var(--cs-text)]">AI Assistant</h3>
            <span className="rounded bg-[var(--cs-accent-surface)] px-2 py-0.5 text-[10px] font-semibold text-[var(--cs-accent)] border border-[var(--cs-accent)]/20">
              Context-Aware
            </span>
          </div>
          <p className="text-xs text-[var(--cs-muted)]">
            {project ? `Discussing: ${project.projectName}` : 'Calculate a project to enable contextual chat'}
          </p>
        </div>

        {messages.length > 1 && (
          <button
            type="button"
            onClick={clearHistory}
            disabled={loading || streaming}
            aria-label="Clear chat messages"
            className="text-xs text-[var(--cs-muted)] hover:text-[var(--cs-danger)] disabled:opacity-40"
          >
            Clear conversation
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
          className="flex h-56 flex-col gap-3 overflow-y-auto rounded-lg border border-[var(--cs-border)] bg-[var(--cs-bg)] p-3 text-xs"
        >
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex flex-col gap-1 max-w-[85%] ${
                m.role === 'user' ? 'ml-auto items-end' : 'items-start'
              }`}
            >
              <span className="text-[10px] font-medium text-[var(--cs-muted)]">
                {m.role === 'user' ? 'You' : 'ChurnSense Assistant'}
              </span>
              <div
                className={`rounded-xl px-3.5 py-2 leading-relaxed whitespace-pre-wrap ${
                  m.role === 'user'
                    ? 'bg-[var(--cs-primary)] text-[var(--cs-on-primary)] rounded-br-sm'
                    : 'bg-[var(--cs-surface)] text-[var(--cs-text)] border border-[var(--cs-border)] rounded-bl-sm'
                }`}
              >
                {m.content}
              </div>
            </div>
          ))}

          {loading && !streaming && (
            <div className="flex items-center gap-2 text-xs text-[var(--cs-muted)] py-1">
              <span
                className="inline-block h-3 w-3 rounded-full border-2 border-[var(--cs-primary)] border-t-transparent"
                style={{ animation: 'spin-slow 0.8s linear infinite' }}
              />
              Thinking…
            </div>
          )}
        </div>

        {/* Jump to Latest Button */}
        {userScrolledUp && (
          <button
            type="button"
            onClick={() => scrollToBottom()}
            className="absolute bottom-2 right-2 rounded-md border border-[var(--cs-border)] bg-[var(--cs-surface)] px-2.5 py-1 text-[11px] font-medium text-[var(--cs-primary)] shadow-md hover:bg-[var(--cs-bg)]"
          >
            ↓ Jump to latest
          </button>
        )}
      </div>

      {/* Composer Form */}
      <form onSubmit={send} className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            project
              ? `Ask about ${project.projectName} retention, pricing, or benchmarks…`
              : 'Calculate project metrics above to enable chat…'
          }
          disabled={!project || loading || streaming}
          aria-label="Your message to AI assistant"
          className="input-control flex-1 text-xs"
        />
        <button
          type="submit"
          disabled={!project || loading || streaming || !input.trim()}
          aria-label="Send chat message"
          className="btn-primary min-h-[40px] px-4 text-xs font-semibold"
        >
          {loading || streaming ? 'Sending…' : 'Send'}
        </button>
      </form>
    </div>
  );
}
