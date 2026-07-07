import type { AIInsightResult, ProjectInput } from '@/types';
import { eq } from 'drizzle-orm';
import { getDb, isDbConfigured } from '@/lib/db';
import { insightCache } from '@/lib/db/schema';

// Insight cache. Identical inputs within the TTL return the prior AI result
// instead of paying for another provider call.
//
// Primary store is the Neon DB (#3.5): a cached insight persists across
// serverless cold starts and is shared across instances. When no DB is
// configured, it degrades to a per-instance in-memory map so the app still
// works keyless — just without cross-instance sharing.
const TTL_MS = 5 * 60 * 1000; // 5 minutes

interface MemEntry {
  insight: AIInsightResult;
  expiresAt: number;
}
const memCache = new Map<string, MemEntry>();

// Key covers the OWNER (#3.5), the model, plus EVERY input field that affects
// the computed metrics/insight — so two users with an identically-named project
// never share an entry, and changing any number yields a fresh insight.
function makeKey(owner: string, input: ProjectInput, model: string): string {
  const { projectName, totalUsers, activeUsers, churnedUsers, monthlyRevenue } = input;
  return `${owner}:${model}:${projectName}:${totalUsers}:${activeUsers}:${churnedUsers}:${monthlyRevenue}`;
}

export async function getCachedInsight(
  owner: string,
  input: ProjectInput,
  model: string
): Promise<AIInsightResult | null> {
  const key = makeKey(owner, input, model);

  if (!isDbConfigured()) {
    const entry = memCache.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      memCache.delete(key);
      return null;
    }
    return entry.insight;
  }

  try {
    const rows = await getDb()
      .select()
      .from(insightCache)
      .where(eq(insightCache.cacheKey, key))
      .limit(1);
    const row = rows[0];
    if (!row) return null;
    if (row.expiresAt.getTime() < Date.now()) {
      // Lazily evict the expired row; ignore failures.
      getDb().delete(insightCache).where(eq(insightCache.cacheKey, key)).catch(() => {});
      return null;
    }
    return JSON.parse(row.insight) as AIInsightResult;
  } catch {
    // Cache is a cost optimization, never a failure mode — miss on error.
    return null;
  }
}

export async function setCachedInsight(
  owner: string,
  input: ProjectInput,
  model: string,
  insight: AIInsightResult
): Promise<void> {
  const key = makeKey(owner, input, model);

  if (!isDbConfigured()) {
    memCache.set(key, { insight, expiresAt: Date.now() + TTL_MS });
    return;
  }

  const expiresAt = new Date(Date.now() + TTL_MS);
  const payload = JSON.stringify(insight);
  try {
    // Upsert: refresh the insight + TTL if the key already exists.
    await getDb()
      .insert(insightCache)
      .values({ cacheKey: key, insight: payload, expiresAt })
      .onConflictDoUpdate({
        target: insightCache.cacheKey,
        set: { insight: payload, expiresAt },
      });
  } catch {
    /* best-effort — a failed cache write must not break the request */
  }
}
