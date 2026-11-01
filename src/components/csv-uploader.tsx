'use client';

import { useRef, useState } from 'react';
import type { AggregateResult, BatchError, BatchRowResult, ProjectInput } from '@/types';
import { detectSeparator, parseCsvRecords } from '@/lib/csv-parser';
import { UploadCloudIcon, ArrowUpRightIcon } from './ui/icons';
import { SpotlightCard } from './web3/spotlight-card';

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
    <SpotlightCard
      glowColor="rgba(6, 182, 212, 0.2)"
      className="p-6 sm:p-7 space-y-5"
      role="region"
      aria-label="CSV batch upload section"
    >
      <div className="flex items-center justify-between border-b border-[var(--cs-border)] pb-3.5">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="font-mono text-[10px] uppercase font-bold tracking-wider text-cyan-400">
              Batch Dataset Ingestion
            </span>
          </div>
          <h2 className="text-base font-extrabold text-[var(--cs-text)]">Batch Ingestion (CSV)</h2>
          <p className="text-xs text-[var(--cs-muted)]">Upload up to 500 records and 5MB per batch payload.</p>
        </div>
        <button
          type="button"
          onClick={downloadSample}
          className="rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 font-mono text-xs font-semibold text-cyan-400 hover:bg-cyan-500/20 transition-all"
        >
          Download Schema
        </button>
      </div>

      {error && (
        <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 font-mono text-xs text-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.15)]" role="alert">
          {error}
        </div>
      )}

      {/* Accessible Cyber Drop Zone */}
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
        className={`group flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center transition-all ${
          dragOver
            ? 'border-emerald-500 bg-emerald-500/15 shadow-[0_0_30px_rgba(16,185,129,0.3)]'
            : 'border-[var(--cs-border)] bg-[var(--cs-bg)]/60 hover:border-emerald-500/40 hover:bg-[var(--cs-elevated)]/60'
        }`}
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 mb-3 shadow-[0_0_15px_rgba(16,185,129,0.2)] group-hover:scale-110 transition-transform">
          <UploadCloudIcon size={24} />
        </div>
        <p className="font-mono text-xs font-bold text-[var(--cs-text)] uppercase tracking-wider">
          Drag &amp; drop dataset stream here
        </p>
        <p className="font-mono text-[11px] text-[var(--cs-muted)] mt-1">
          or click to select file (.csv · max 5MB · 500 rows)
        </p>

        {file && (
          <div className="mt-4 inline-flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/15 px-3 py-1.5 font-mono text-xs font-semibold text-emerald-400">
            <span>SELECTED: {file.name}</span>
            <span className="text-[10px] opacity-80">({(file.size / 1024).toFixed(1)} KB)</span>
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
        <div className="space-y-3 pt-2">
          <div className="font-mono text-xs font-bold text-[var(--cs-muted)] uppercase tracking-wider">
            DATASET PREVIEW (SAMPLE {preview.length - 1} ROWS)
          </div>
          <div className="overflow-x-auto rounded-xl border border-[var(--cs-border)] bg-[var(--cs-bg)]/80">
            <table className="w-full text-left text-xs font-mono" aria-label="CSV preview table">
              <thead className="border-b border-[var(--cs-border)] bg-[var(--cs-elevated)] text-[var(--cs-muted)] text-[11px]">
                <tr>
                  {preview[0].map((header, i) => (
                    <th key={i} scope="col" className="px-3.5 py-2.5 font-semibold">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--cs-border)]">
                {preview.slice(1).map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-white/5 transition-colors">
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} className="px-3.5 py-2.5 font-tabular text-[var(--cs-text)]">
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
            className="btn-primary min-h-[46px] w-full font-mono text-xs font-semibold tracking-wider uppercase inline-flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] rounded-xl mt-3"
          >
            {loading ? 'PROCESSING BATCH STREAM…' : `EXECUTE BATCH PIPELINE (${file?.name})`}
          </button>
        </div>
      )}

      {/* Batch Results & Summary */}
      {result && (
        <div className="space-y-4 pt-3">
          {/* Summary Banner */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 font-mono text-xs text-emerald-400">
            <div>
              <span className="font-bold text-[var(--cs-text)]">
                PROCESSED {result.totalRows} RECORD{result.totalRows === 1 ? '' : 'S'}:
              </span>{' '}
              <span className="font-bold text-emerald-400">
                {result.validRows} VALID
              </span>
              {result.failedRows > 0 && (
                <span className="text-rose-400 font-bold ml-2">
                  · {result.failedRows} FAILED
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
              className="text-[11px] text-cyan-400 underline hover:text-cyan-300"
            >
              Upload another dataset
            </button>
          </div>

          {/* Row errors */}
          {result.errors.length > 0 && (
            <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3.5 space-y-1 font-mono text-xs text-rose-400">
              <div className="font-bold">PARSING EXCEPTIONS:</div>
              <ul className="list-disc pl-4 space-y-0.5">
                {result.errors.map((err, i) => (
                  <li key={i}>
                    ROW {err.row}: {err.error}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Valid rows table */}
          {result.results.length > 0 && (
            <div className="space-y-2">
              <div className="font-mono text-xs font-bold text-[var(--cs-muted)] uppercase tracking-wider">
                VALIDATED SNAPSHOT RECORDS
              </div>
              <div className="overflow-x-auto rounded-xl border border-[var(--cs-border)] bg-[var(--cs-bg)]/80">
                <table className="w-full text-left text-xs font-mono" aria-label="Batch results table">
                  <thead className="border-b border-[var(--cs-border)] bg-[var(--cs-elevated)] text-[var(--cs-muted)] text-[11px]">
                    <tr>
                      <th scope="col" className="px-3.5 py-2.5 font-semibold">PROJECT</th>
                      <th scope="col" className="px-3.5 py-2.5 font-semibold text-right">CHURN</th>
                      <th scope="col" className="px-3.5 py-2.5 font-semibold text-right">RETENTION</th>
                      <th scope="col" className="px-3.5 py-2.5 font-semibold text-right">ARPU</th>
                      <th scope="col" className="px-3.5 py-2.5 font-semibold text-right">ACTION</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--cs-border)]">
                    {result.results.map((row, idx) => (
                      <tr key={`${row.projectName}-${idx}`} className="hover:bg-white/5 transition-colors">
                        <td className="px-3.5 py-2.5 font-semibold text-[var(--cs-text)] truncate max-w-[120px]">
                          {row.projectName}
                        </td>
                        <td className="px-3.5 py-2.5 font-tabular text-right text-rose-500 font-bold">
                          {(row.metrics.churnRate * 100).toFixed(1)}%
                        </td>
                        <td className="px-3.5 py-2.5 font-tabular text-right text-emerald-400 font-bold">
                          {(row.metrics.retentionRate * 100).toFixed(1)}%
                        </td>
                        <td className="px-3.5 py-2.5 font-tabular text-right text-[var(--cs-text)]">
                          ${row.metrics.arpu.toFixed(2)}
                        </td>
                        <td className="px-3.5 py-2.5 text-right">
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
                            aria-label={`Analyze and load ${row.projectName}`}
                            className="inline-flex min-h-[32px] items-center gap-1 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-mono font-semibold text-emerald-400 hover:bg-emerald-500/20"
                          >
                            <span>Load</span>
                            <ArrowUpRightIcon size={12} />
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
    </SpotlightCard>
  );
}
