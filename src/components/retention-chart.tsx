'use client';

import { useEffect, useState } from 'react';
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

interface Props {
  project: ProjectInput;
  history?: SavedProject[];
}

export function RetentionChart({ project, history = [] }: Props) {
  const [reduceMotion, setReduceMotion] = useState(false);
  const [showTable, setShowTable] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setReduceMotion(media.matches);
    const listener = (e: MediaQueryListEvent) => setReduceMotion(e.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, []);

  // Filter history for snapshots matching this project name, sorted ascending by time, up to 10 latest
  const matchingHistory = history
    .filter((p) => p.projectName === project.projectName)
    .slice()
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    .slice(-10);

  const hasTrend = matchingHistory.length >= 2;

  const tooltipStyle = {
    borderRadius: '8px',
    border: '1px solid var(--cs-border, #d8e1db)',
    backgroundColor: 'var(--cs-surface, #ffffff)',
    color: 'var(--cs-text, #17251e)',
    fontSize: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  };

  return (
    <div
      className="workbench-panel space-y-4 p-5 sm:p-6"
      role="region"
      aria-label={`Retention chart for ${project.projectName}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--cs-border)] pb-3">
        <div>
          <h3 className="text-sm font-semibold text-[var(--cs-text)]">
            {hasTrend
              ? `Historical Trend · ${project.projectName}`
              : `Active vs. Churned Users · ${project.projectName}`}
          </h3>
          <p className="text-xs text-[var(--cs-muted)]">
            {hasTrend
              ? `Based on ${matchingHistory.length} loaded saved snapshots (latest 10 displayed)`
              : 'Single snapshot view. Calculate and save future snapshots to see trend lines.'}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowTable(!showTable)}
          className="text-xs font-medium text-[var(--cs-muted)] hover:text-[var(--cs-text)] underline"
        >
          {showTable ? 'Hide data table' : 'View as data table'}
        </button>
      </div>

      {hasTrend ? (
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={matchingHistory.map((p) => ({
                id: p.id,
                date: new Date(p.createdAt).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                }),
                fullDate: new Date(p.createdAt).toLocaleString(),
                churn: Number((p.metrics.churnRate * 100).toFixed(1)),
                retention: Number((p.metrics.retentionRate * 100).toFixed(1)),
              }))}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis
                tick={{ fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                width={36}
                unit="%"
                domain={[0, 100]}
              />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
              <Line
                type="monotone"
                dataKey="churn"
                name="Churn Rate %"
                stroke="var(--cs-danger, #b73535)"
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={{ r: 3 }}
                isAnimationActive={!reduceMotion}
              />
              <Line
                type="monotone"
                dataKey="retention"
                name="Retention Rate %"
                stroke="var(--cs-primary, #225c43)"
                strokeWidth={2}
                dot={{ r: 3 }}
                isAnimationActive={!reduceMotion}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={[
                { name: 'Active Users', value: project.activeUsers, color: 'var(--cs-primary, #225c43)' },
                { name: 'Churned Users', value: project.churnedUsers, color: 'var(--cs-danger, #b73535)' },
              ]}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
              <YAxis tickLine={false} axisLine={false} width={44} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar
                dataKey="value"
                radius={[6, 6, 0, 0]}
                isAnimationActive={!reduceMotion}
              >
                <Cell fill="var(--cs-primary, #225c43)" />
                <Cell fill="var(--cs-danger, #b73535)" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Accessible Table Fallback */}
      {showTable && (
        <div className="overflow-x-auto rounded-lg border border-[var(--cs-border)] pt-2">
          <table className="w-full text-left text-xs" aria-label="Chart data tabular view">
            <thead className="border-b border-[var(--cs-border)] bg-[var(--cs-bg)] text-[var(--cs-muted)]">
              <tr>
                <th scope="col" className="px-3 py-2 font-medium">Record</th>
                <th scope="col" className="px-3 py-2 font-medium">Date</th>
                <th scope="col" className="px-3 py-2 font-medium text-right">Active</th>
                <th scope="col" className="px-3 py-2 font-medium text-right">Churned</th>
                <th scope="col" className="px-3 py-2 font-medium text-right">Churn %</th>
                <th scope="col" className="px-3 py-2 font-medium text-right">Retention %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--cs-border)]">
              {hasTrend ? (
                matchingHistory.map((p) => (
                  <tr key={p.id}>
                    <td className="px-3 py-2 font-medium">{p.projectName}</td>
                    <td className="px-3 py-2 text-[var(--cs-muted)]">
                      {new Date(p.createdAt).toLocaleString()}
                    </td>
                    <td className="px-3 py-2 text-right font-tabular">—</td>
                    <td className="px-3 py-2 text-right font-tabular">—</td>
                    <td className="px-3 py-2 text-right font-tabular text-[var(--cs-danger)]">
                      {(p.metrics.churnRate * 100).toFixed(1)}%
                    </td>
                    <td className="px-3 py-2 text-right font-tabular text-[var(--cs-primary)]">
                      {(p.metrics.retentionRate * 100).toFixed(1)}%
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="px-3 py-2 font-medium">{project.projectName}</td>
                  <td className="px-3 py-2 text-[var(--cs-muted)]">Current Calculation</td>
                  <td className="px-3 py-2 text-right font-tabular">{project.activeUsers}</td>
                  <td className="px-3 py-2 text-right font-tabular">{project.churnedUsers}</td>
                  <td className="px-3 py-2 text-right font-tabular text-[var(--cs-danger)]">
                    {((project.churnedUsers / project.totalUsers) * 100).toFixed(1)}%
                  </td>
                  <td className="px-3 py-2 text-right font-tabular text-[var(--cs-primary)]">
                    {((project.activeUsers / project.totalUsers) * 100).toFixed(1)}%
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
