import type { Config } from 'drizzle-kit';
import { config } from 'dotenv';

// Load local secrets for the drizzle-kit CLI (Next loads .env.local itself).
config({ path: '.env.local' });

export default {
  schema: './src/lib/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL ?? '',
  },
} satisfies Config;
