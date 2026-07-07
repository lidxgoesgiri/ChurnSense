import { z } from 'zod';

export const projectInputSchema = z
  .object({
    projectName: z.string().trim().min(1, 'Project name is required'),
    totalUsers: z.number().int().positive('Total users must be greater than zero'),
    activeUsers: z.number().int().nonnegative(),
    churnedUsers: z.number().int().nonnegative(),
    monthlyRevenue: z.number().nonnegative(),
  })
  // Cross-field sanity: user counts cannot exceed total users.
  .refine((d) => d.activeUsers <= d.totalUsers, {
    message: 'activeUsers cannot exceed totalUsers',
    path: ['activeUsers'],
  })
  .refine((d) => d.churnedUsers <= d.totalUsers, {
    message: 'churnedUsers cannot exceed totalUsers',
    path: ['churnedUsers'],
  })
  // Combined sanity (#5.1): active and churned are treated as mutually
  // exclusive segments of the user base, so their sum cannot exceed the total.
  // This rejects arithmetically impossible data (e.g. 90 active + 90 churned of
  // 100 total) that the two per-field checks above let through.
  .refine((d) => d.activeUsers + d.churnedUsers <= d.totalUsers, {
    message: 'activeUsers + churnedUsers cannot exceed totalUsers',
    path: ['churnedUsers'],
  });

export type ProjectInputSchema = z.infer<typeof projectInputSchema>;