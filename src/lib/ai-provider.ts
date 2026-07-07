import { env } from '@/lib/env';
import { AVAILABLE_MODELS, validateModelId } from '@/lib/models';

export interface ChatMsg {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

// Circuit breaker: a model that errors is skipped for COOLDOWN_MS so a flaky
// provider doesn't get retried on every request, capping latency and cost
// (#3.3). Per-instance and time-based; forgives itself automatically.
const COOLDOWN_MS = 60_000;
const openCircuits = new Map<string, number>();

function isCircuitOpen(model: string): boolean {
  const until = openCircuits.get(model);
  if (until === undefined) return false;
  if (Date.now() > until) {
    openCircuits.delete(model);
    return false;
  }
  return true;
}

function tripCircuit(model: string): void {
  openCircuits.set(model, Date.now() + COOLDOWN_MS);
}

/**
 * Ordered model list, capped at TWO distinct models (#3.3): the validated
 * preferred model, then a single healthy chat-capable fallback. Models with an
 * open circuit are skipped. Bounding the chain keeps worst-case latency and
 * token spend predictable when a provider is degraded.
 */
export function modelFallbackOrder(preferred?: unknown): string[] {
  const first = validateModelId(preferred);
  // First healthy, chat-capable model that isn't the preferred one.
  const fallback = AVAILABLE_MODELS.filter((m) => m.chat !== false)
    .map((m) => m.id)
    .find((id) => id !== first && !isCircuitOpen(id));
  return fallback ? [first, fallback] : [first];
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
      // Mark this model unhealthy so it's skipped for the cooldown window (#3.3).
      tripCircuit(model);
    }
  }
  return '';
}
