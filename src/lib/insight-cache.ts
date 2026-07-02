import type { AIInsightResult } from '@/types';

// In-memory insight cache. Identical inputs within the TTL return the prior
// AI result instead of paying for another provider call. Per-instance and
// cleared on cold start — a cost/latency optimization, not a durable store.
interface CacheEntry {
  insight: AIInsightResult;
  expiresAt: number;
}

const cache = new Map<string, CacheEntry>();
const TTL = 5 * 60 * 1000; // 5 minutes

function makeKey(projectName: string, totalUsers: number, churnedUsers: number, model: string): string {
  return `${model}:${projectName}:${totalUsers}:${churnedUsers}`;
}

export function getCachedInsight(
  projectName: string,
  totalUsers: number,
  churnedUsers: number,
  model: string
): AIInsightResult | null {
  const key = makeKey(projectName, totalUsers, churnedUsers, model);
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    cache.delete(key);
    return null;
  }
  return entry.insight;
}

export function setCachedInsight(
  projectName: string,
  totalUsers: number,
  churnedUsers: number,
  model: string,
  insight: AIInsightResult
): void {
  const key = makeKey(projectName, totalUsers, churnedUsers, model);
  cache.set(key, { insight, expiresAt: Date.now() + TTL });
}
