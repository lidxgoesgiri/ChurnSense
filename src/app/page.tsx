'use client';

import { useState, Suspense } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { ThemeToggle } from '@/components/theme-toggle';
import { Dialog } from '@/components/ui/dialog';
import {
  MailCheckIcon,
  SparklesIcon,
  ActivityIcon,
  ShieldCheckIcon,
  FileSpreadsheetIcon,
  ArrowUpRightIcon,
} from '@/components/ui/icons';

const SAMPLE_FIXTURE = {
  projectName: 'Acme SaaS Protocol',
  totalUsers: 1000,
  activeUsers: 850,
  churnedUsers: 150,
  monthlyRevenue: 5000,
  churnRate: 0.15,
  retentionRate: 0.85,
  arpu: 5.0,
  mrr: 5000.0,
  estimatedLtv: 33.33,
  riskStatus: 'Medium',
};

const PIPELINE_STAGES = [
  {
    stage: '01',
    code: 'INGEST',
    title: 'Aggregate Data Ingestion',
    desc: 'Supply user counts and revenue manually or batch stream via multi-row CSV datasets up to 500 records.',
  },
  {
    stage: '02',
    code: 'COMPUTE',
    title: 'Deterministic Retention Engine',
    desc: 'Instant calculation of mathematical churn fractions, retention indices, ARPU, MRR, and theoretical LTV.',
  },
  {
    stage: '03',
    code: 'OPTIMIZE',
    title: 'Autonomous Agent Insights',
    desc: 'Context-aware AI evaluates trailing baseline anomalies and drafts tactical retention strategies.',
  },
];

const CAPABILITY_PODS = [
  {
    icon: ActivityIcon,
    title: 'Immutable Snapshot Ledger',
    desc: 'Every calculation records an immutable point-in-time snapshot. Audit historical shifts with signed percentage point (pp) deltas.',
  },
  {
    icon: FileSpreadsheetIcon,
    title: 'Batch Dataset Processor',
    desc: 'Pre-validated CSV ingestion with 5MB quota enforcement, UTF-8 BOM sanitation, and 1-based error reporting.',
  },
  {
    icon: SparklesIcon,
    title: 'Autonomous AI Agent',
    desc: 'Multi-tier LLM reasoning engine backed by deterministic rule-based fallback guarantees zero downtime.',
  },
  {
    icon: ShieldCheckIcon,
    title: 'Cryptographic Isolation',
    desc: 'Owner-scoped sessions secured via HMAC-signed cookies, strict origin verification, and isolated persistence keys.',
  },
];

function HomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialError =
    searchParams.get('error') === 'invalid_or_expired_link'
      ? 'Your sign-in link is invalid or has expired. Please enter your email to request a new one.'
      : null;

  const [gateOpen, setGateOpen] = useState(Boolean(initialError));
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(initialError);
  const [sent, setSent] = useState(false);

  async function handleEnter(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error ?? 'Sign-in failed');
      }
      if (data.pending) {
        setSent(true);
        setLoading(false);
        return;
      }
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign-in failed');
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen bg-[var(--cs-bg)] text-[var(--cs-text)]">
      {/* Top Protocol Bar */}
      <header className="sticky top-0 z-40 border-b border-[var(--cs-border)] bg-[var(--cs-surface)]/90 backdrop-blur-xl">
        <div className="mx-auto flex min-h-[64px] max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <Image
              src="/churn.jpg"
              alt="ChurnSense"
              width={34}
              height={34}
              priority
              className="rounded-lg border border-white/10 ring-1 ring-emerald-500/20"
            />
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold tracking-tight text-[var(--cs-text)]">
                CHURNSENSE
              </span>
              <span className="hidden rounded bg-emerald-500/10 px-1.5 py-0.5 text-[9px] font-mono font-semibold tracking-wider text-emerald-400 border border-emerald-500/25 sm:inline">
                PROTOCOL V2.0
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="#how"
              className="hidden text-xs font-mono text-[var(--cs-muted)] hover:text-[var(--cs-text)] sm:inline"
            >
              {'// ARCHITECTURE'}
            </a>
            <a
              href="#about"
              className="hidden text-xs font-mono text-[var(--cs-muted)] hover:text-[var(--cs-text)] sm:inline"
            >
              {'// PHILOSOPHY'}
            </a>
            <ThemeToggle />
            <button
              type="button"
              onClick={() => {
                setError(null);
                setSent(false);
                setGateOpen(true);
              }}
              className="btn-primary min-h-[38px] px-4 py-1.5 text-xs font-mono font-semibold uppercase tracking-wider"
            >
              Launch Terminal
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Landmark */}
      <main id="main-content" tabIndex={-1} className="outline-none">
        {/* Hero Section */}
        <section className="relative mx-auto max-w-6xl px-4 pt-12 pb-20 sm:px-6 sm:pt-20 lg:pt-24">
          <div className="grid items-center gap-12 lg:grid-cols-12">
            {/* Left Value Proposition */}
            <div className="space-y-6 lg:col-span-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-mono text-emerald-400">
                <span className="live-pulse" />
                <span className="font-semibold uppercase tracking-widest text-[11px]">
                  RETENTION ANALYTICS TERMINAL
                </span>
              </div>

              <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl lg:text-[46px] lg:leading-[1.12]">
                Decentralized-Grade SaaS Retention Analytics.
              </h1>

              <p className="text-sm leading-relaxed text-[var(--cs-muted)] sm:text-base font-normal">
                Engineered for high-throughput SaaS operators. Convert raw user aggregate counts into
                auditable churn, retention indices, ARPU, and MRR. Powered by immutable snapshots and autonomous AI agents.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setError(null);
                    setSent(false);
                    setGateOpen(true);
                  }}
                  className="btn-primary min-h-[44px] px-6 py-2.5 text-xs font-mono font-semibold uppercase tracking-wider"
                >
                  Enter Terminal Console <ArrowUpRightIcon size={14} className="ml-1" />
                </button>
                <a
                  href="#how"
                  className="btn-secondary min-h-[44px] px-5 py-2.5 text-xs font-mono font-medium tracking-wide"
                >
                  System Spec
                </a>
              </div>
            </div>

            {/* Right: Mock Web3 Terminal Window */}
            <div className="lg:col-span-6">
              <div className="workbench-panel overflow-hidden border border-white/10 bg-[var(--cs-surface)]/95 shadow-2xl backdrop-blur-xl">
                {/* Terminal Title Bar */}
                <div className="flex items-center justify-between border-b border-[var(--cs-border)] bg-[var(--cs-elevated)]/60 px-4 py-2.5">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-rose-500/80" />
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
                    <span className="ml-2 font-mono text-[11px] font-medium text-[var(--cs-muted)]">
                      CORE://ANALYTICS_V2.0
                    </span>
                  </div>
                  <span className="rounded bg-[var(--cs-surface)] px-2 py-0.5 font-mono text-[10px] text-emerald-400 border border-emerald-500/30">
                    LIVE PREVIEW
                  </span>
                </div>

                <div className="p-5 space-y-4">
                  {/* Two HUD Metric Pods */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-lg border border-rose-500/20 bg-rose-500/5 p-4">
                      <div className="flex items-center justify-between text-[10px] font-mono font-semibold uppercase tracking-wider text-[var(--cs-muted)]">
                        <span>CHURN RATE</span>
                        <span className="text-rose-400">15.0%</span>
                      </div>
                      <div className="mt-2 text-3xl font-extrabold font-mono text-[var(--cs-danger)]">
                        15.00%
                      </div>
                      <div className="mt-1 font-mono text-[10px] text-[var(--cs-muted)]">
                        150 CHURNED / 1,000 TOTAL
                      </div>
                    </div>

                    <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4">
                      <div className="flex items-center justify-between text-[10px] font-mono font-semibold uppercase tracking-wider text-[var(--cs-muted)]">
                        <span>RETENTION</span>
                        <span className="text-emerald-400">85.0%</span>
                      </div>
                      <div className="mt-2 text-3xl font-extrabold font-mono text-[var(--cs-primary)]">
                        85.00%
                      </div>
                      <div className="mt-1 font-mono text-[10px] text-[var(--cs-muted)]">
                        850 ACTIVE SUBSCRIBERS
                      </div>
                    </div>
                  </div>

                  {/* Supporting Monospace Fin-Stats */}
                  <div className="grid grid-cols-3 gap-2 rounded-lg border border-[var(--cs-border)] bg-[var(--cs-bg)]/80 p-3 text-center">
                    <div>
                      <div className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[var(--cs-muted)]">
                        ARPU
                      </div>
                      <div className="mt-1 font-mono text-sm font-bold text-[var(--cs-text)]">
                        ${SAMPLE_FIXTURE.arpu.toFixed(2)}
                      </div>
                    </div>
                    <div className="border-x border-[var(--cs-border)]">
                      <div className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[var(--cs-muted)]">
                        MRR
                      </div>
                      <div className="mt-1 font-mono text-sm font-bold text-[var(--cs-text)]">
                        ${SAMPLE_FIXTURE.mrr.toLocaleString('en-US')}
                      </div>
                    </div>
                    <div>
                      <div className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[var(--cs-muted)]">
                        EST. LTV
                      </div>
                      <div className="mt-1 font-mono text-sm font-bold text-[var(--cs-text)]">
                        ${SAMPLE_FIXTURE.estimatedLtv.toFixed(2)}
                      </div>
                    </div>
                  </div>

                  {/* Risk Assessment Pod */}
                  <div className="flex items-center justify-between rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs font-mono text-amber-400">
                    <span className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-amber-400" />
                      AUDIT TIER: <strong>MEDIUM RISK</strong>
                    </span>
                    <span className="text-[10px] opacity-80">&gt;15.0% CHURN TRIGGER</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3-Stage Protocol Workflow */}
        <section id="how" className="border-t border-[var(--cs-border)] bg-[var(--cs-surface)]/50 py-16 sm:py-20">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <div className="text-center space-y-2">
              <span className="font-mono text-xs font-semibold uppercase tracking-widest text-emerald-400">
                [ PIPELINE SPECIFICATION ]
              </span>
              <h2 className="text-2xl font-bold tracking-tight text-[var(--cs-text)] sm:text-3xl">
                Deterministic Processing Stages
              </h2>
            </div>

            <div className="mt-12 grid gap-6 sm:grid-cols-3">
              {PIPELINE_STAGES.map((s) => (
                <div
                  key={s.stage}
                  className="rounded-xl border border-[var(--cs-border)] bg-[var(--cs-surface)] p-6 space-y-3 shadow-sm hover:border-emerald-500/40 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-[var(--cs-primary)]">
                      {s.code}
                    </span>
                    <span className="font-mono text-xs text-[var(--cs-muted)]">
                      {s.stage}
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-[var(--cs-text)]">
                    {s.title}
                  </h3>
                  <p className="text-xs leading-relaxed text-[var(--cs-muted)] font-normal">
                    {s.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Verified Capability Matrix */}
        <section className="border-t border-[var(--cs-border)] py-16 sm:py-20">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <div className="text-center space-y-2">
              <span className="font-mono text-xs font-semibold uppercase tracking-widest text-cyan-400">
                [ PROTOCOL CAPABILITIES ]
              </span>
              <h2 className="text-2xl font-bold tracking-tight text-[var(--cs-text)] sm:text-3xl">
                Engineered for Integrity
              </h2>
            </div>

            <div className="mt-12 grid gap-5 sm:grid-cols-2">
              {CAPABILITY_PODS.map((cap) => {
                const IconComponent = cap.icon;
                return (
                  <div
                    key={cap.title}
                    className="flex gap-4 rounded-xl border border-[var(--cs-border)] bg-[var(--cs-surface)] p-6 shadow-sm hover:border-cyan-500/40 transition-colors"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[var(--cs-border)] bg-[var(--cs-elevated)] text-[var(--cs-accent)]">
                      <IconComponent size={20} />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-sm font-semibold text-[var(--cs-text)]">
                        {cap.title}
                      </h3>
                      <p className="text-xs leading-relaxed text-[var(--cs-muted)]">
                        {cap.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Philosophy & Brand Symbol */}
        <section id="about" className="border-t border-[var(--cs-border)] bg-[var(--cs-surface)]/60 py-16">
          <div className="mx-auto max-w-4xl px-4 sm:px-6">
            <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:text-left">
              <Image
                src="/churn.jpg"
                alt="ChurnSense symbol"
                width={72}
                height={72}
                className="shrink-0 rounded-2xl border border-white/10 ring-1 ring-emerald-500/20 shadow-lg"
              />
              <div className="space-y-2">
                <div className="font-mono text-xs font-bold uppercase tracking-wider text-emerald-400">
                  {'// BRAND PHILOSOPHY'}
                </div>
                <h3 className="text-base font-bold text-[var(--cs-text)]">
                  The Sustainable Growth Seedling
                </h3>
                <p className="text-xs leading-relaxed text-[var(--cs-muted)]">
                  The ChurnSense glyph depicts a vibrant seedling emerging from an ascending bar chart.
                  Retention is dynamic: revenue expansion is achieved not by chasing transient signups,
                  but by nurturing and sustaining existing user relationships.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--cs-border)] py-8 text-center font-mono text-xs text-[var(--cs-muted)]">
        <p>© 2026 CHURNSENSE PROTOCOL · HACKATHON SEASON 3 BUILD THE LOOP</p>
      </footer>

      {/* Accessible Terminal Sign-In Dialog */}
      <Dialog
        open={gateOpen}
        onClose={() => setGateOpen(false)}
        title="Terminal Authentication"
        description="Authenticate via passwordless session to open the retention workbench."
        maxWidth="max-w-sm"
      >
        {sent ? (
          <div className="space-y-4 py-2 text-center" role="status">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-[var(--cs-primary)]/30 bg-[var(--cs-accent-surface)] text-[var(--cs-primary)]">
              <MailCheckIcon size={24} />
            </div>
            <div>
              <h3 className="text-sm font-mono font-semibold text-[var(--cs-text)] uppercase tracking-wider">
                Magic Link Dispatched
              </h3>
              <p className="mt-1 text-xs text-[var(--cs-muted)] leading-relaxed font-mono">
                Verification token sent to <strong className="text-[var(--cs-text)]">{email}</strong>.
                Session valid for 15 minutes.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setSent(false);
                setError(null);
              }}
              className="text-xs font-mono text-[var(--cs-primary)] underline underline-offset-2 hover:opacity-80"
            >
              Use alternate email
            </button>
          </div>
        ) : (
          <form onSubmit={handleEnter} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="auth-email" className="block text-[11px] font-mono font-semibold uppercase tracking-wider text-[var(--cs-muted)]">
                OPERATOR EMAIL
              </label>
              <input
                id="auth-email"
                type="email"
                required
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="operator@company.com"
                className="input-control font-mono text-xs"
              />
            </div>

            {error && (
              <div
                className="rounded-lg border border-[var(--cs-danger)]/30 bg-rose-500/10 p-3 text-xs font-mono text-[var(--cs-danger)]"
                role="alert"
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !email.trim()}
              className="btn-primary w-full min-h-[44px] text-xs font-mono font-semibold uppercase tracking-wider inline-flex items-center justify-center gap-1.5"
            >
              {loading ? (
                'AUTHENTICATING…'
              ) : (
                <>
                  <span>INITIALIZE SESSION</span>
                  <ArrowUpRightIcon className="h-3.5 w-3.5" />
                </>
              )}
            </button>

            <p className="text-center font-mono text-[10px] text-[var(--cs-muted)]">
              Instant login in development or magic link when verification is enabled.
            </p>
          </form>
        )}
      </Dialog>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[var(--cs-bg)]" />}>
      <HomeContent />
    </Suspense>
  );
}
