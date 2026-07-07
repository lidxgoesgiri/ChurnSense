import { z } from 'zod';

/**
 * Centralized environment validation.
 *
 * Everything is optional by design — ChurnSense runs with no external keys
 * (the AI layer falls back to a rule-based engine, and persistence is disabled
 * with a clear 503 when DATABASE_URL is absent). What this guarantees is that
 * when a variable IS set, it has a valid shape — so a malformed value fails
 * fast with a clear message instead of causing a silent 500 at request time.
 */
const isProduction = process.env.NODE_ENV === 'production';

const envSchema = z.object({
  // Postgres URL (Neon). Not z.string().url() — the postgres:// scheme is valid
  // but stricter URL checks can reject it; we just require the right scheme.
  DATABASE_URL: z
    .string()
    .refine((v) => v.startsWith('postgres://') || v.startsWith('postgresql://'), {
      message: 'DATABASE_URL must be a postgres:// connection string',
    })
    .optional(),
  AI_API_KEY: z.string().min(1).optional(),
  AI_BASE_URL: z.string().url().optional(),
  // AI_MODEL is OPTIONAL and only overrides the built-in default (#3.4). A
  // provider is considered "configured" from key + base URL alone.
  AI_MODEL: z.string().min(1).optional(),
  // Cookie signing secret. In production it MUST be present and ≥32 chars —
  // there is no public fallback, so a deployment without it fails to boot (#1.2).
  COOKIE_SECRET: isProduction
    ? z.string().min(32, 'COOKIE_SECRET must be at least 32 characters in production')
    : z.string().min(32).optional(),
  // Optional bearer token gating the internal health endpoint (#4.4).
  HEALTH_TOKEN: z.string().min(1).optional(),
});

const parsed = envSchema.safeParse({
  DATABASE_URL: process.env.DATABASE_URL || undefined,
  AI_API_KEY: process.env.AI_API_KEY || undefined,
  AI_BASE_URL: process.env.AI_BASE_URL || undefined,
  AI_MODEL: process.env.AI_MODEL || undefined,
  COOKIE_SECRET: process.env.COOKIE_SECRET || undefined,
  HEALTH_TOKEN: process.env.HEALTH_TOKEN || undefined,
});

if (!parsed.success) {
  // Fail fast with a readable message rather than crashing mid-request.
  const issues = parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; ');
  throw new Error(`Invalid environment configuration — ${issues}`);
}

export const env = parsed.data;

export const hasDatabase = Boolean(env.DATABASE_URL);
// Provider is active with just a key + base URL; the model falls back to the
// built-in default when AI_MODEL is unset (#3.4).
export const hasAiProvider = Boolean(env.AI_API_KEY && env.AI_BASE_URL);
