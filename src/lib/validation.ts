import { z } from 'zod';

export const projectInputSchema = z.object({
  projectName: z.string().min(1, 'Nama proyek wajib diisi'),
  totalUsers: z.number().int().positive('Total users harus lebih dari 0'),
  activeUsers: z.number().int().nonnegative(),
  churnedUsers: z.number().int().nonnegative(),
  monthlyRevenue: z.number().nonnegative(),
});

export type ProjectInputSchema = z.infer<typeof projectInputSchema>;
