'use client';

import { useRef, useState } from 'react';
import type { AggregateResult, BatchError, BatchRowResult, ProjectInput } from '@/types';
import { detectSeparator, parseCsvRecords } from '@/lib/csv-parser';
import { UploadCloudIcon } from './ui/icons';

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

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export function CsvUploader({
  onSelectProject,
}: {
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

    // Pre-read size validation (5MB max)
    if (f.size > MAX_FILE_SIZE) {
      setError(`File exceeds maximum size limit of 5MB (${(f.size / (1024 * 1024)).toFixed(1)}MB).`);
      setFile(null);
      setPreview([]);
      return;
    }

    setFile(f);
    const reader = new FileReader();
    reader.onload = () => {
      let text = String(reader.result ?? '');
      if (text.charCodeAt(0) === 0xfeff) text = text.slice(1); // strip UTF-8 BOM
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

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      inputRef.current?.click();
    }
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
    a.download = 'sample-churn-data.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="workbench-panel space-y-4 p-5 sm:p-6" aria-label="CSV batch upload section">
      <div className="flex items-center justify-between border-b border-[var(--cs-border)] pb-3">
        <div>
          <h2 className="text-sm font-semibold text-[var(--cs-text)]">Batch Upload (CSV)</h2>
          <p className="text-xs text-[var(--cs-muted)]">Upload up to 500 rows and 5MB per file.</p>
        </div>
        <button
          type="button"
          onClick={downloadSample}
          className="text-xs font-medium text-[var(--cs-primary)] underline underline-offset-2 hover:opacity-80"
        >
          Download template
        </button>
      </div>

      {error && (
        <div className="rounded-lg border border-[var(--cs-danger)]/25 bg-red-500/10 p-3 text-xs text-[var(--cs-danger)]" role="alert">
          {error}
        </div>
      )}

      {/* Accessible Drop Zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
        aria-label="Upload CSV file. Click or press Enter to browse files."
        className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center transition-colors focus-visible:outline-2 focus-visible:outline-[var(--cs-focus)] ${
          dragOver
            ? 'border-[var(--cs-primary)] bg-[var(--cs-accent-surface)]'
            : 'border-[var(--cs-border)] bg-[var(--cs-bg)]/50 hover:border-[var(--cs-control-border)]'
        }`}
      >
        <UploadCloudIcon size={28} className="text-[var(--cs-primary)] mb-2" />
        <p className="text-xs font-semibold text-[var(--cs-text)]">
          Drag &amp; drop your CSV file here
        </p>
        <p className="text-[11px] text-[var(--cs-muted)] mt-0.5">
          or click to browse (.csv, max 5MB, up to 500 rows)
        </p>

        {file && (
          <div className="mt-3 inline-flex items-center gap-1.5 rounded-md bg-[var(--cs-accent-surface)] px-2.5 py-1 text-xs font-medium text-[var(--cs-primary)]">
            <span>Selected: {file.name}</span>
            <span className="text-[10px] text-[var(--cs-muted)]">({(file.size / 1024).toFixed(1)} KB)</span>
          </div>
        )}

        <input
          ref={inputRef}
          type="file"
          accept=".csv"
          className="sr-only"
          tabIndex={-1}
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) loadFile(f);
          }}
        />
      </div>

      {/* Preview Table */}
      {preview.length > 0 && !result && (
        <div className="space-y-2">
          <div className="text-xs font-semibold text-[var(--cs-muted)] uppercase tracking-wider">
            Preview (first {preview.length - 1} rows)
          </div>
          <div className="overflow-x-auto rounded-lg border border-[var(--cs-border)]">
            <table className="w-full text-left text-xs" aria-label="CSV preview table">
              <thead className="border-b border-[var(--cs-border)] bg-[var(--cs-bg)] text-[var(--cs-muted)]">
                <tr>
                  {preview[0].map((header, i) => (
                    <th key={i} scope="col" className="px-3 py-2 font-medium">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--cs-border)]">
                {preview.slice(1).map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-[var(--cs-bg)]/40">
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} className="px-3 py-2 font-tabular">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button
            type="button"
            onClick={analyze}
            disabled={loading}
            className="btn-primary min-h-[44px] w-full text-sm font-semibold mt-2"
          >
            {loading ? 'Analyzing CSV…' : `Analyze batch (${file?.name})`}
          </button>
        </div>
      )}

      {/* Batch Results & Partial Error Summary */}
      {result && (
        <div className="space-y-4 pt-2">
          {/* Summary Banner */}
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-[var(--cs-border)] bg-[var(--cs-bg)] p-3.5 text-xs">
            <div>
              <span className="font-semibold text-[var(--cs-text)]">
                Processed {result.totalRows} row{result.totalRows === 1 ? '' : 's'}:
              </span>{' '}
              <span className="text-[var(--cs-success)] font-medium">
                {result.validRows} valid
              </span>
              {result.failedRows > 0 && (
                <span className="text-[var(--cs-danger)] font-medium ml-2">
                  · {result.failedRows} failed
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={() => {
                setFile(null);
                setPreview([]);
                setResult(null);
              }}
              className="text-[11px] text-[var(--cs-muted)] hover:text-[var(--cs-text)] underline"
            >
              Upload another file
            </button>
          </div>

          {/* Row errors */}
          {result.errors.length > 0 && (
            <div className="rounded-lg border border-[var(--cs-danger)]/25 bg-red-500/10 p-3 space-y-1 text-xs">
              <div className="font-semibold text-[var(--cs-danger)]">Validation errors:</div>
              <ul className="list-disc pl-4 space-y-0.5 text-[var(--cs-danger)]">
                {result.errors.map((err, i) => (
                  <li key={i}>
                    Row {err.row}: {err.error}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Valid rows with action to load into workbench */}
          {result.results.length > 0 && (
            <div className="space-y-2">
              <div className="text-xs font-semibold text-[var(--cs-muted)] uppercase tracking-wider">
                Valid Results
              </div>
              <div className="overflow-x-auto rounded-lg border border-[var(--cs-border)]">
                <table className="w-full text-left text-xs" aria-label="Batch results table">
                  <thead className="border-b border-[var(--cs-border)] bg-[var(--cs-bg)] text-[var(--cs-muted)]">
                    <tr>
                      <th scope="col" className="px-3 py-2 font-medium">Project</th>
                      <th scope="col" className="px-3 py-2 font-medium text-right">Churn</th>
                      <th scope="col" className="px-3 py-2 font-medium text-right">Retention</th>
                      <th scope="col" className="px-3 py-2 font-medium text-right">ARPU</th>
                      <th scope="col" className="px-3 py-2 font-medium text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--cs-border)]">
                    {result.results.map((row, idx) => (
                      <tr key={`${row.projectName}-${idx}`} className="hover:bg-[var(--cs-bg)]/40">
                        <td className="px-3 py-2 font-medium text-[var(--cs-text)] truncate max-w-[120px]">
                          {row.projectName}
                        </td>
                        <td className="px-3 py-2 font-tabular text-right text-[var(--cs-danger)]">
                          {(row.metrics.churnRate * 100).toFixed(1)}%
                        </td>
                        <td className="px-3 py-2 font-tabular text-right text-[var(--cs-primary)]">
                          {(row.metrics.retentionRate * 100).toFixed(1)}%
                        </td>
                        <td className="px-3 py-2 font-tabular text-right text-[var(--cs-text)]">
                          ${row.metrics.arpu.toFixed(2)}
                        </td>
                        <td className="px-3 py-2 text-right">
                          <button
                            type="button"
                            onClick={() => {
                              if (onSelectProject) {
                                onSelectProject({
                                  projectName: row.projectName,
                                  totalUsers: row.input.totalUsers,
                                  activeUsers: row.input.activeUsers,
                                  churnedUsers: row.input.churnedUsers,
                                  monthlyRevenue: row.input.monthlyRevenue,
                                });
                              }
                            }}
                            aria-label={`Analyze and save ${row.projectName}`}
                            className="inline-flex min-h-[32px] items-center rounded-md border border-[var(--cs-control-border)] bg-[var(--cs-surface)] px-2.5 py-1 text-[11px] font-medium text-[var(--cs-text)] hover:border-[var(--cs-focus)]"
                          >
                            Analyze
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
