import { z } from 'zod';

export const projectInputSchema = z
  .object({
    projectName: z.string().min(1, 'Project name is required'),
    totalUsers: z.number().int().positive('Total users must be greater than zero'),
    activeUsers: z.number().int().nonnegative(),
    churnedUsers: z.number().int().nonnegative(),
    monthlyRevenue: z.number().nonnegative(),
  })
  // Cross-field sanity: you cannot have more active or churned users than the
  // total, which would otherwise produce nonsensical >100% rates.
  .refine((d) => d.activeUsers <= d.totalUsers, {
    message: 'activeUsers cannot exceed totalUsers',
    path: ['activeUsers'],
  })
  .refine((d) => d.churnedUsers <= d.totalUsers, {
    message: 'churnedUsers cannot exceed totalUsers',
    path: ['churnedUsers'],
  });

export type ProjectInputSchema = z.infer<typeof projectInputSchema>;
