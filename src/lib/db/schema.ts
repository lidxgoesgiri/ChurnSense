import {
  pgTable,
  serial,
  varchar,
  integer,
  numeric,
  timestamp,
} from 'drizzle-orm/pg-core';

export const projects = pgTable('projects', {
  id: serial('id').primaryKey(),
  projectName: varchar('project_name', { length: 255 }).notNull(),
  totalUsers: integer('total_users').notNull(),
  activeUsers: integer('active_users').notNull(),
  churnedUsers: integer('churned_users').notNull(),
  monthlyRevenue: numeric('monthly_revenue').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export type ProjectRow = typeof projects.$inferSelect;
export type NewProjectRow = typeof projects.$inferInsert;
