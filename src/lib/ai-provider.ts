import { env } from '@/lib/env';
import { AVAILABLE_MODELS, validateModelId } from '@/lib/models';

export interface ChatMsg {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

/**
 * Ordered model list: the (validated) preferred model first, then every other
 * allow-listed model as a fallback. Used to route around a model that returns
 * an empty response — a known quirk of some free models.
 */
export function modelFallbackOrder(preferred?: unknown): string[] {
  const first = validateModelId(preferred);
  // Only genuine chat models are used as fallbacks (excludes classifiers).
  const rest = AVAILABLE_MODELS.filter((m) => m.chat !== false)
    .map((m) => m.id)
    .filter((id) => id !== first);
  // Retry the preferred model once (empty replies are often transient) before
  // moving on to the chat-capable fallbacks.
  return [first, first, ...rest];
}

/** Call one model (non-streaming). Returns trimmed content ('' if empty). Throws on HTTP/network error. */
export async function callModel(
  model: string,
  messages: ChatMsg[],
  { maxTokens = 600, timeoutMs = 20_000 }: { maxTokens?: number; timeoutMs?: number } = {}
): Promise<string> {
  const res = await fetch(`${env.AI_BASE_URL!.replace(/\/+$/, '')}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${env.AI_API_KEY}`,
    },
    body: JSON.stringify({ model, temperature: 0.4, max_tokens: maxTokens, messages }),
    signal: AbortSignal.timeout(timeoutMs),
  });
  if (!res.ok) throw new Error(`AI provider returned ${res.status}`);
  const data = await res.json();
  return (data?.choices?.[0]?.message?.content ?? '').trim();
}

/**
 * Complete a chat across the fallback order, returning the first NON-EMPTY
 * content. Empty/failed models are skipped. Returns '' only if every model
 * failed or returned empty.
 */
export async function completeWithFallback(
  messages: ChatMsg[],
  preferred?: unknown,
  opts: { maxTokens?: number; timeoutMs?: number } = {}
): Promise<string> {
  for (const model of modelFallbackOrder(preferred)) {
    try {
      const content = await callModel(model, messages, opts);
      if (content) return content;
    } catch {
      /* try the next model */
    }
  }
  return '';
}
