import type { AIInsightResult, ProjectInput } from '@/types';

// In-memory insight cache. Identical inputs within the TTL return the prior
// AI result instead of paying for another provider call. Per-instance and
// cleared on cold start — a cost/latency optimization, not a durable store.
interface CacheEntry {
  insight: AIInsightResult;
  expiresAt: number;
}

const cache = new Map<string, CacheEntry>();
const TTL = 5 * 60 * 1000; // 5 minutes

// Key covers the model plus EVERY input field that affects the computed
// metrics/insight — changing activeUsers or monthlyRevenue must produce a
// fresh insight, not a stale cached one.
function makeKey(input: ProjectInput, model: string): string {
  const { projectName, totalUsers, activeUsers, churnedUsers, monthlyRevenue } = input;
  return `${model}:${projectName}:${totalUsers}:${activeUsers}:${churnedUsers}:${monthlyRevenue}`;
}

export function getCachedInsight(input: ProjectInput, model: string): AIInsightResult | null {
  const key = makeKey(input, model);
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    cache.delete(key);
    return null;
  }
  return entry.insight;
}

export function setCachedInsight(input: ProjectInput, model: string, insight: AIInsightResult): void {
  cache.set(makeKey(input, model), { insight, expiresAt: Date.now() + TTL });
}
