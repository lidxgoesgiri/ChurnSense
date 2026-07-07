import {
  pgTable,
  serial,
  varchar,
  integer,
  numeric,
  timestamp,
  index,
  text,
} from 'drizzle-orm/pg-core';

export const projects = pgTable(
  'projects',
  {
    id: serial('id').primaryKey(),
    // Verified session identity that owns this row (#2.1). Every read/write is
    // filtered by this so users only ever see and mutate their own projects.
    ownerEmail: varchar('owner_email', { length: 320 }).notNull(),
    projectName: varchar('project_name', { length: 255 }).notNull(),
    totalUsers: integer('total_users').notNull(),
    activeUsers: integer('active_users').notNull(),
    churnedUsers: integer('churned_users').notNull(),
    monthlyRevenue: numeric('monthly_revenue').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => [
    // Trend lookups filter by (owner, projectName); history lists by owner+time.
    index('idx_owner_project').on(table.ownerEmail, table.projectName),
    index('idx_owner_created').on(table.ownerEmail, table.createdAt),
  ]
);

export type ProjectRow = typeof projects.$inferSelect;
export type NewProjectRow = typeof projects.$inferInsert;

// Cross-instance insight cache (#3.5). Backed by the same Neon DB so a cached
// insight survives serverless cold starts and is shared across instances,
// instead of living in per-instance memory. The key is owner-scoped and covers
// every input field + model; expiresAt drives TTL eviction.
export const insightCache = pgTable(
  'insight_cache',
  {
    cacheKey: varchar('cache_key', { length: 512 }).primaryKey(),
    insight: text('insight').notNull(), // JSON-serialized AIInsightResult
    expiresAt: timestamp('expires_at').notNull(),
  },
  (table) => [index('idx_insight_expires').on(table.expiresAt)]
);

export type InsightCacheRow = typeof insightCache.$inferSelect;
