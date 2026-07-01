'use client';

import { useState } from 'react';
import type { ProjectInput } from '@/types';

const FIELDS: { key: keyof Omit<ProjectInput, 'projectName'>; label: string }[] = [
  { key: 'totalUsers', label: 'Total users' },
  { key: 'activeUsers', label: 'Active users' },
  { key: 'churnedUsers', label: 'Churned users' },
  { key: 'monthlyRevenue', label: 'Monthly revenue ($)' },
];

interface Props {
  onAnalyze: (input: ProjectInput) => void;
  loading: boolean;
}

export function ProjectForm({ onAnalyze, loading }: Props) {
  const [projectName, setProjectName] = useState('Beta Client A');
  const [values, setValues] = useState<Record<string, string>>({
    totalUsers: '1000',
    activeUsers: '850',
    churnedUsers: '150',
    monthlyRevenue: '5000',
  });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    onAnalyze({
      projectName,
      totalUsers: Number(values.totalUsers),
      activeUsers: Number(values.activeUsers),
      churnedUsers: Number(values.churnedUsers),
      monthlyRevenue: Number(values.monthlyRevenue),
    });
  }

  return (
    <form
      onSubmit={submit}
      className="space-y-4 rounded-2xl border border-black/10 p-6 dark:border-white/15"
    >
      <div className="space-y-1">
        <label htmlFor="projectName" className="block text-sm font-medium">
          Project name
        </label>
        <input
          id="projectName"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          required
          className="w-full rounded-lg border border-black/15 bg-transparent px-3 py-2 text-sm outline-none focus:border-black/40 dark:border-white/20"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        {FIELDS.map((f) => (
          <div key={f.key} className="space-y-1">
            <label htmlFor={f.key} className="block text-sm font-medium">
              {f.label}
            </label>
            <input
              id={f.key}
              type="number"
              min="0"
              step="any"
              value={values[f.key]}
              onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))}
              required
              className="w-full rounded-lg border border-black/15 bg-transparent px-3 py-2 text-sm outline-none focus:border-black/40 dark:border-white/20"
            />
          </div>
        ))}
      </div>

      <button
        type="submit"
        disabled={loading}
        aria-label={loading ? 'Calculating metrics' : 'Calculate metrics'}
        className="w-full rounded-lg bg-foreground px-4 py-2 text-sm font-semibold text-background transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {loading ? 'Calculating…' : 'Calculate metrics'}
      </button>
    </form>
  );
}
