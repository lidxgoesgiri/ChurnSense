'use client';

import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { ProjectInput } from '@/types';

export function RetentionChart({ project }: { project: ProjectInput }) {
  const data = [
    { name: 'Active', value: project.activeUsers, fill: '#22c55e' },
    { name: 'Churned', value: project.churnedUsers, fill: '#ef4444' },
  ];

  return (
    <div className="rounded-2xl border border-black/10 p-4 dark:border-white/15">
      <h3 className="mb-3 text-sm font-medium text-gray-500">
        Active vs. churned users
      </h3>
      <div className="h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="name" tickLine={false} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} width={48} />
            <Tooltip
              cursor={{ fill: 'rgba(125,125,125,0.08)' }}
              contentStyle={{ borderRadius: 8, border: '1px solid rgba(125,125,125,0.3)' }}
            />
            <Bar dataKey="value" radius={[6, 6, 0, 0]}>
              {data.map((d) => (
                <Cell key={d.name} fill={d.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
