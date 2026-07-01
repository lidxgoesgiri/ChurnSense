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
  AI_MODEL: z.string().min(1).optional(),
});

const parsed = envSchema.safeParse({
  DATABASE_URL: process.env.DATABASE_URL || undefined,
  AI_API_KEY: process.env.AI_API_KEY || undefined,
  AI_BASE_URL: process.env.AI_BASE_URL || undefined,
  AI_MODEL: process.env.AI_MODEL || undefined,
});

if (!parsed.success) {
  // Fail fast with a readable message rather than crashing mid-request.
  const issues = parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; ');
  throw new Error(`Invalid environment configuration — ${issues}`);
}

export const env = parsed.data;

export const hasDatabase = Boolean(env.DATABASE_URL);
export const hasAiProvider = Boolean(env.AI_API_KEY && env.AI_BASE_URL && env.AI_MODEL);
