import {
  pgTable,
  serial,
  varchar,
  integer,
  numeric,
  timestamp,
  index,
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
