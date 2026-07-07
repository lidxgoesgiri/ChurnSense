'use client';

import { useRef, useState } from 'react';
import type { AggregateResult, BatchError, BatchRowResult, ProjectInput } from '@/types';
import { detectSeparator, parseCsvRecords } from '@/lib/csv-parser';

interface BatchResponse {
  success: boolean;
  totalRows: number;
  validRows: number;
  failedRows: number;
  errors: BatchError[];
  results: BatchRowResult[];
  aggregate: AggregateResult;
}

const SAMPLE_CSV = `project_name,total_users,active_users,churned_users,monthly_revenue
Acme Inc,1000,850,150,5000
Globex,500,400,100,2000
Initech,2000,1800,200,15000`;

export function CsvUploader({
  onSelectProject,
}: {
  // Promote one analyzed batch row into the main dashboard (#6.1).
  onSelectProject?: (input: ProjectInput) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string[][]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<BatchResponse | null>(null);

  function loadFile(f: File) {
    setError(null);
    setResult(null);
    setFile(f);
    const reader = new FileReader();
    reader.onload = () => {
      let text = String(reader.result ?? '');
      if (text.charCodeAt(0) === 0xfeff) text = text.slice(1); // strip BOM
      // Use the SAME quote/multiline-aware parser as the backend so the preview
      // matches what the server will actually process (#6.2, #7.6).
      const firstLine = text.split(/\r?\n/, 1)[0] ?? '';
      const sep = detectSeparator(firstLine);
      const rows = parseCsvRecords(text, sep)
        .filter((r) => r.length > 0 && r.some((c) => c !== ''))
        .slice(0, 4); // header + 3 preview rows
      setPreview(rows);
    };
    reader.readAsText(f);
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f) loadFile(f);
  }

  async function analyze() {
    if (!file) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const body = new FormData();
      body.append('file', file);
      const res = await fetch('/api/upload-csv', {
        method: 'POST',
        headers: { 'X-Requested-With': 'ChurnSense' },
        body,
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.details || data.error || 'Upload failed');
      }
      setResult(data as BatchResponse);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setLoading(false);
    }
  }

  function downloadSample() {
    const blob = new Blob([SAMPLE_CSV], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample-projects.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="glass-card space-y-4 p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold">Batch upload (CSV)</h2>
        <button
          type="button"
          onClick={downloadSample}
          className="text-xs text-indigo-600 underline-offset-2 hover:underline dark:text-indigo-400"
        >
          Download sample CSV
        </button>
      </div>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        aria-label="Upload CSV file"
        className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-4 py-8 text-center text-sm transition-colors ${
          dragOver
            ? 'border-indigo-500 bg-indigo-500/5'
            : 'border-black/15 hover:border-black/30 dark:border-white/20 dark:hover:border-white/40'
        }`}
      >
        <p className="font-medium">Drag &amp; drop your CSV here</p>
        <p className="text-gray-400">or click to browse · .csv (max 5MB)</p>
        {file && <p className="mt-2 text-xs text-indigo-500">Selected: {file.name}</p>}
        <input
          ref={inputRef}
          type="file"
          accept=".csv"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) loadFile(f);
          }}
        />
      </div>

      {preview.length > 0 && (
        <div className="overflow-x-auto rounded-lg border border-black/10 dark:border-white/15">
          <table className="w-full text-left text-xs">
            <tbody>
              {preview.map((row, i) => (
                <tr
                  key={i}
                  className={i === 0 ? 'font-semibold' : 'border-t border-black/5 dark:border-white/10'}
                >
                  {row.map((cell, j) => (
                    <td key={j} className="px-3 py-1.5">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <button
        type="button"
        onClick={analyze}
        disabled={!file || loading}
        className="btn-primary w-full px-4 py-2.5 text-sm"
      >
        {loading ? 'Analyzing…' : 'Analyze batch'}
      </button>

      {error && (
        <div className="rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      {result && (
        <div className="space-y-4">
          <p className="text-xs text-gray-400">
            {result.validRows} of {result.totalRows} rows analyzed
            {result.failedRows > 0 && ` · ${result.failedRows} skipped`}
          </p>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Stat label="Avg churn" value={`${(result.aggregate.avgChurnRate * 100).toFixed(1)}%`} />
            <Stat label="Avg retention" value={`${(result.aggregate.avgRetentionRate * 100).toFixed(1)}%`} />
            <Stat label="Total revenue" value={`$${result.aggregate.totalMonthlyRevenue.toLocaleString()}`} />
            <Stat label="High risk" value={String(result.aggregate.highRiskProjects)} />
          </div>

          {result.aggregate.anomaliesDetected && (
            <div className="space-y-1 rounded-lg bg-amber-500/10 px-4 py-3 text-sm text-amber-700 dark:text-amber-400">
              {result.aggregate.anomalyDetails.map((d, i) => (
                <p key={i}>⚠ {d}</p>
              ))}
            </div>
          )}

          {onSelectProject && (
            <p className="text-xs text-gray-400">
              Pick a project below to load it into the dashboard — metrics, chart,
              AI insight, and chat.
            </p>
          )}
          <div className="overflow-x-auto rounded-lg border border-black/10 dark:border-white/15">
            <table className="w-full text-left text-xs">
              <thead className="text-gray-400">
                <tr className="border-b border-black/10 dark:border-white/15">
                  <th className="px-3 py-2">Project</th>
                  <th className="px-3 py-2">Churn</th>
                  <th className="px-3 py-2">Retention</th>
                  <th className="px-3 py-2">ARPU</th>
                  <th className="px-3 py-2">Risk</th>
                  {onSelectProject && <th className="px-3 py-2" />}
                </tr>
              </thead>
              <tbody>
                {result.results.map((r, i) => (
                  <tr key={i} className="border-t border-black/5 dark:border-white/10">
                    <td className="px-3 py-1.5">{r.projectName}</td>
                    <td className="px-3 py-1.5">{(r.metrics.churnRate * 100).toFixed(1)}%</td>
                    <td className="px-3 py-1.5">{(r.metrics.retentionRate * 100).toFixed(1)}%</td>
                    <td className="px-3 py-1.5">${r.metrics.arpu}</td>
                    <td className="px-3 py-1.5">{r.metrics.riskStatus}</td>
                    {onSelectProject && (
                      <td className="px-3 py-1.5 text-right">
                        <button
                          type="button"
                          onClick={() => onSelectProject(r.input)}
                          className="rounded-md border border-indigo-500/40 px-2 py-0.5 text-[11px] font-semibold text-indigo-600 transition-colors hover:bg-indigo-500/10 dark:text-indigo-400"
                        >
                          Use
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {result.errors.length > 0 && (
            <div className="rounded-lg bg-red-500/5 px-4 py-3 text-xs text-red-600 dark:text-red-400">
              {result.errors.map((e, i) => (
                <p key={i}>Row {e.row}: {e.error}</p>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-black/10 px-3 py-2 dark:border-white/15">
      <p className="text-[11px] uppercase tracking-wide text-gray-400">{label}</p>
      <p className="text-lg font-semibold">{value}</p>
    </div>
  );
}
