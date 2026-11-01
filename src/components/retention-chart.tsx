'use client';

import { useState } from 'react';
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
import { SpotlightCard } from './web3/spotlight-card';
import { useReducedMotion } from '@/lib/use-reduced-motion';

interface Props {
  project: ProjectInput;
  history?: SavedProject[];
}

export function RetentionChart({ project, history = [] }: Props) {
  const reduceMotion = useReducedMotion();
  const [showTable, setShowTable] = useState(false);

  // Filter history for snapshots matching this project name, sorted ascending by time, up to 10 latest
  const matchingHistory = history
    .filter((p) => p.projectName === project.projectName)
    .slice()
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    .slice(-10);

  const hasTrend = matchingHistory.length >= 2;

  const tooltipStyle = {
    borderRadius: '12px',
    border: '1px solid rgba(16, 185, 129, 0.3)',
    backgroundColor: 'rgba(14, 18, 26, 0.95)',
    color: '#F1F5F9',
    fontSize: '11px',
    fontFamily: 'monospace',
    boxShadow: '0 12px 32px rgba(0,0,0,0.6), 0 0 15px rgba(16,185,129,0.2)',
    backdropFilter: 'blur(12px)',
    padding: '10px 14px',
  };

  return (
    <SpotlightCard
      glowColor="rgba(16, 185, 129, 0.18)"
      className="p-6 space-y-5"
      role="region"
      aria-label={`Retention chart for ${project.projectName}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--cs-border)] pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-[10px] uppercase font-bold tracking-wider text-emerald-400">
              Telemetry Trend &amp; Cognitive Vectors
            </span>
          </div>
          <h3 className="text-base font-extrabold text-[var(--cs-text)]">
            {hasTrend
              ? `Historical Trend · ${project.projectName}`
              : `Active vs. Churned Users · ${project.projectName}`}
          </h3>
          <p className="text-xs text-[var(--cs-muted)]">
            {hasTrend
              ? `Synthesized from ${matchingHistory.length} loaded snapshot intervals`
              : 'Single snapshot view. Calculate and save subsequent snapshots to unlock multi-point curve interpolation.'}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowTable(!showTable)}
          className="rounded-lg border border-[var(--cs-border)] bg-[var(--cs-bg)] px-3 py-1 font-mono text-xs font-semibold text-[var(--cs-muted)] hover:border-emerald-500/40 hover:text-emerald-400 transition-all"
        >
          {showTable ? 'Hide Audit Table' : 'View Audit Table'}
        </button>
      </div>

      {hasTrend ? (
        <div className="h-72 w-full">
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
              <defs>
                <linearGradient id="glowRetention" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" opacity={0.12} stroke="#64748B" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'var(--cs-muted)' }} tickLine={false} axisLine={false} />
              <YAxis
                tick={{ fontSize: 11, fill: 'var(--cs-muted)' }}
                tickLine={false}
                axisLine={false}
                width={38}
                unit="%"
                domain={[0, 100]}
              />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Line
                type="monotone"
                dataKey="churn"
                name="Churn Rate %"
                stroke="#F43F5E"
                strokeWidth={2.5}
                strokeDasharray="4 4"
                dot={{ r: 4, fill: '#F43F5E', strokeWidth: 0 }}
                activeDot={{ r: 6, stroke: '#FFFFFF', strokeWidth: 2 }}
                isAnimationActive={!reduceMotion}
              />
              <Line
                type="monotone"
                dataKey="retention"
                name="Retention Rate %"
                stroke="#10B981"
                strokeWidth={2.5}
                dot={{ r: 4, fill: '#10B981', strokeWidth: 0 }}
                activeDot={{ r: 6, stroke: '#FFFFFF', strokeWidth: 2 }}
                isAnimationActive={!reduceMotion}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={[
                { name: 'Active Users', value: project.activeUsers, color: '#10B981' },
                { name: 'Churned Users', value: project.churnedUsers, color: '#F43F5E' },
              ]}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.12} stroke="#64748B" />
              <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: 'var(--cs-muted)' }} />
              <YAxis tickLine={false} axisLine={false} width={48} tick={{ fill: 'var(--cs-muted)', fontSize: 11 }} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar
                dataKey="value"
                radius={[8, 8, 0, 0]}
                isAnimationActive={!reduceMotion}
              >
                <Cell fill="#10B981" />
                <Cell fill="#F43F5E" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Accessible Table Fallback */}
      {showTable && (
        <div className="overflow-x-auto rounded-xl border border-[var(--cs-border)] pt-2 bg-[var(--cs-bg)]/60">
          <table className="w-full text-left text-xs" aria-label="Chart data tabular view">
            <thead className="border-b border-[var(--cs-border)] bg-[var(--cs-elevated)] text-[var(--cs-muted)] font-mono text-[11px]">
              <tr>
                <th scope="col" className="px-3.5 py-2.5 font-semibold">RECORD</th>
                <th scope="col" className="px-3.5 py-2.5 font-semibold">TIMESTAMP</th>
                <th scope="col" className="px-3.5 py-2.5 font-semibold text-right">ACTIVE</th>
                <th scope="col" className="px-3.5 py-2.5 font-semibold text-right">CHURNED</th>
                <th scope="col" className="px-3.5 py-2.5 font-semibold text-right">CHURN %</th>
                <th scope="col" className="px-3.5 py-2.5 font-semibold text-right">RETENTION %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--cs-border)] font-mono text-xs">
              {hasTrend ? (
                matchingHistory.map((p) => (
                  <tr key={p.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-3.5 py-2.5 font-medium text-[var(--cs-text)]">{p.projectName}</td>
                    <td className="px-3.5 py-2.5 text-[var(--cs-muted)]">
                      {new Date(p.createdAt).toLocaleString()}
                    </td>
                    <td className="px-3.5 py-2.5 text-right font-tabular">—</td>
                    <td className="px-3.5 py-2.5 text-right font-tabular">—</td>
                    <td className="px-3.5 py-2.5 text-right font-tabular text-rose-500 font-bold">
                      {(p.metrics.churnRate * 100).toFixed(1)}%
                    </td>
                    <td className="px-3.5 py-2.5 text-right font-tabular text-emerald-400 font-bold">
                      {(p.metrics.retentionRate * 100).toFixed(1)}%
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="hover:bg-white/5 transition-colors">
                  <td className="px-3.5 py-2.5 font-medium text-[var(--cs-text)]">{project.projectName}</td>
                  <td className="px-3.5 py-2.5 text-[var(--cs-muted)]">Current Execution</td>
                  <td className="px-3.5 py-2.5 text-right font-tabular text-[var(--cs-text)]">{project.activeUsers.toLocaleString()}</td>
                  <td className="px-3.5 py-2.5 text-right font-tabular text-[var(--cs-text)]">{project.churnedUsers.toLocaleString()}</td>
                  <td className="px-3.5 py-2.5 text-right font-tabular text-rose-500 font-bold">
                    {((project.churnedUsers / project.totalUsers) * 100).toFixed(1)}%
                  </td>
                  <td className="px-3.5 py-2.5 text-right font-tabular text-emerald-400 font-bold">
                    {((project.activeUsers / project.totalUsers) * 100).toFixed(1)}%
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </SpotlightCard>
  );
}
