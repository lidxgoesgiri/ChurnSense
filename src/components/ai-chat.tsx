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
  const [streaming, setStreaming] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  // Load persisted history after mount (avoids SSR/hydration mismatch).
  useEffect(() => {
    // Intentional: read localStorage only on the client, post-hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
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

  const scrollToEnd = () =>
    requestAnimationFrame(() => {
      listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
    });

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
    if (!text || loading || streaming) return;

    setMessages((prev) => [...prev, { role: 'user', content: text }]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          context: project && metrics ? { project, metrics } : null,
          model,
          stream: true,
        }),
      });

      const contentType = res.headers.get('content-type') ?? '';
      if (res.ok && res.body && contentType.includes('text/plain')) {
        // Streaming response — append tokens into a growing assistant message.
        setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);
        setLoading(false);
        setStreaming(true);
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let acc = '';
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          acc += decoder.decode(value, { stream: true });
          replaceLast(acc);
          scrollToEnd();
        }
        replaceLast(acc || 'No response.');
        setStreaming(false);
      } else {
        // Fallback: non-streaming JSON reply (e.g. provider not configured / error).
        const data = await res.json().catch(() => ({}));
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: data.reply || data.error || 'No response.' },
        ]);
        setLoading(false);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Sorry, something went wrong. Try again.' },
      ]);
      setLoading(false);
      setStreaming(false);
    } finally {
      scrollToEnd();
    }
  }

  return (
    <div className="glass-card anim-fade-up delay-6 overflow-hidden">
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
            className={`anim-fade max-w-[85%] px-3 py-2 text-sm leading-relaxed ${
              m.role === 'user' ? 'ml-auto text-white' : ''
            }`}
            style={
              m.role === 'user'
                ? {
                    background: 'linear-gradient(135deg, var(--accent), #4f46e5)',
                    borderRadius: '16px',
                    borderBottomRightRadius: '6px',
                  }
                : {
                    background: 'color-mix(in srgb, var(--muted) 12%, transparent)',
                    borderRadius: '16px',
                    borderBottomLeftRadius: '6px',
                  }
            }
          >
            {m.content}
          </div>
        ))}
        {loading && !streaming && (
          <div className="anim-fade flex justify-start">
            <div className="typing-dots" role="status" aria-label="AI is typing">
              <span />
              <span />
              <span />
            </div>
          </div>
        )}
      </div>

      <form onSubmit={send} className="flex gap-2 border-t border-black/10 p-3 dark:border-white/15">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={project ? 'Ask about your data...' : 'Analyze a project first...'}
          disabled={!project || loading || streaming}
          aria-label="Chat message"
          className="min-w-0 flex-1 rounded-lg border border-black/15 bg-transparent px-3 py-2 text-sm outline-none focus:border-black/40 disabled:opacity-40 dark:border-white/20 dark:focus:border-white/50"
        />
        <button
          type="submit"
          disabled={!project || loading || streaming || !input.trim()}
          aria-label="Send message"
          className="rounded-lg bg-foreground px-3 py-2 text-sm font-semibold text-background transition-opacity hover:opacity-90 disabled:opacity-40"
        >
          Send
        </button>
      </form>
    </div>
  );
}
