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
    projectName: varchar('project_name', { length: 255 }).notNull(),
    totalUsers: integer('total_users').notNull(),
    activeUsers: integer('active_users').notNull(),
    churnedUsers: integer('churned_users').notNull(),
    monthlyRevenue: numeric('monthly_revenue').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => [
    // loadTrend() filters by projectName; history lists order by createdAt.
    index('idx_project_name').on(table.projectName),
    index('idx_created_at').on(table.createdAt),
  ]
);

export type ProjectRow = typeof projects.$inferSelect;
export type NewProjectRow = typeof projects.$inferInsert;
