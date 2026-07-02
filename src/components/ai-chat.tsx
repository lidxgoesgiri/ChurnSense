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
}

const STORAGE_KEY = 'churnsense-chat-history';
const GREETING: ChatMessage = {
  role: 'assistant',
  content: 'Ask me anything about your churn data — trends, benchmarks, or what to improve.',
};

function loadHistory(): ChatMessage[] {
  if (typeof window === 'undefined') return [GREETING];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const parsed = stored ? (JSON.parse(stored) as ChatMessage[]) : null;
    return parsed && parsed.length > 0 ? parsed : [GREETING];
  } catch {
    return [GREETING];
  }
}

export function AIChat({ project, metrics, model }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([GREETING]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  // Load persisted history after mount (avoids SSR/hydration mismatch).
  useEffect(() => {
    setMessages(loadHistory());
  }, []);

  // Persist the last 50 messages whenever the conversation changes.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-50)));
    } catch {
      /* storage full or unavailable — non-fatal */
    }
  }, [messages]);

  function clearHistory() {
    setMessages([GREETING]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }

  async function send(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg: ChatMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input,
          context: project && metrics ? { project, metrics } : null,
          model,
        }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: data.reply || 'No response.' },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Sorry, something went wrong. Try again.' },
      ]);
    } finally {
      setLoading(false);
      // Scroll to bottom after render
      requestAnimationFrame(() => {
        listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
      });
    }
  }

  return (
    <div className="rounded-2xl border border-black/10 dark:border-white/15">
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-indigo-500">
          AI chat
        </span>
        {messages.length > 1 && (
          <button
            type="button"
            onClick={clearHistory}
            aria-label="Clear chat history"
            className="text-xs text-gray-400 transition-colors hover:text-foreground"
          >
            Clear
          </button>
        )}
      </div>

      <div
        ref={listRef}
        className="flex h-48 flex-col gap-2 overflow-y-auto px-4 pb-2 scroll-smooth"
      >
        {messages.map((m, i) => (
          <div
            key={i}
            className={`max-w-[85%] rounded-xl px-3 py-2 text-sm leading-relaxed ${
              m.role === 'user'
                ? 'ml-auto bg-foreground text-background'
                : 'bg-black/5 dark:bg-white/10'
            }`}
          >
            {m.content}
          </div>
        ))}
        {loading && (
          <div className="max-w-[85%] rounded-xl bg-black/5 px-3 py-2 text-sm dark:bg-white/10">
            <span className="animate-pulse">Thinking...</span>
          </div>
        )}
      </div>

      <form onSubmit={send} className="flex gap-2 border-t border-black/10 p-3 dark:border-white/15">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={project ? 'Ask about your data...' : 'Analyze a project first...'}
          disabled={!project || loading}
          aria-label="Chat message"
          className="min-w-0 flex-1 rounded-lg border border-black/15 bg-transparent px-3 py-2 text-sm outline-none focus:border-black/40 disabled:opacity-40 dark:border-white/20 dark:focus:border-white/50"
        />
        <button
          type="submit"
          disabled={!project || loading || !input.trim()}
          aria-label="Send message"
          className="rounded-lg bg-foreground px-3 py-2 text-sm font-semibold text-background transition-opacity hover:opacity-90 disabled:opacity-40"
        >
          Send
        </button>
      </form>
    </div>
  );
}
