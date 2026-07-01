import { drizzle, type NeonHttpDatabase } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { env, hasDatabase } from '@/lib/env';
import * as schema from './schema';

// Lazy singleton: the app builds and deploys fine without DATABASE_URL.
// A clear error is thrown only when a DB-backed endpoint is actually hit.
let _db: NeonHttpDatabase<typeof schema> | null = null;

export function isDbConfigured(): boolean {
  return hasDatabase;
}

export function getDb(): NeonHttpDatabase<typeof schema> {
  if (!env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not configured');
  }
  if (!_db) {
    const sql = neon(env.DATABASE_URL);
    _db = drizzle(sql, { schema });
  }
  return _db;
}

export { schema };
