'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { ProjectInput } from '@/types';
import type { SavedProject } from './projects-history';

const TOOLTIP_STYLE = {
  borderRadius: 8,
  border: '1px solid rgba(125,125,125,0.3)',
  background: 'var(--card)',
  color: 'var(--foreground)',
};

export function RetentionChart({
  project,
  history = [],
}: {
  project: ProjectInput;
  history?: SavedProject[];
}) {
  // Prefer a real trend when this project has ≥2 saved snapshots.
  const projectHistory = history
    .filter((p) => p.projectName === project.projectName)
    .slice()
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    .slice(-10);

  if (projectHistory.length >= 2) {
    const trendData = projectHistory.map((p) => ({
      name: new Date(p.createdAt).toLocaleDateString(undefined, {
        day: '2-digit',
        month: 'short',
      }),
      churn: Number((p.metrics.churnRate * 100).toFixed(1)),
      retention: Number((p.metrics.retentionRate * 100).toFixed(1)),
    }));

    return (
      <div
        className="rounded-2xl border border-black/10 p-4 dark:border-white/15"
        role="figure"
        aria-label="Line chart of churn and retention over time"
      >
        <h3 className="mb-3 text-sm font-medium text-gray-500">
          Churn &amp; retention trend
        </h3>
        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.12} />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} width={40} unit="%" />
              <Tooltip contentStyle={TOOLTIP_STYLE} />
              <Legend />
              <Line type="monotone" dataKey="churn" name="Churn %" stroke="#ef4444" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="retention" name="Retention %" stroke="#22c55e" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  }

  // Fallback: single-snapshot active vs churned bars.
  const data = [
    { name: 'Active', value: project.activeUsers, fill: '#22c55e' },
    { name: 'Churned', value: project.churnedUsers, fill: '#ef4444' },
  ];

  return (
    <div
      className="rounded-2xl border border-black/10 p-4 dark:border-white/15"
      role="figure"
      aria-label="Bar chart comparing active vs churned users"
    >
      <h3 className="mb-3 text-sm font-medium text-gray-500">Active vs. churned users</h3>
      <p className="mb-3 text-xs text-gray-400">
        Analyze this project again over time to unlock the churn &amp; retention trend line.
      </p>
      <div className="h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="name" tickLine={false} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} width={48} />
            <Tooltip cursor={{ fill: 'rgba(125,125,125,0.08)' }} contentStyle={TOOLTIP_STYLE} />
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
