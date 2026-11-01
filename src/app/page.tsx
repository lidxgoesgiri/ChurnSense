'use client';

import { useState, Suspense } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { ThemeToggle } from '@/components/theme-toggle';
import { Dialog } from '@/components/ui/dialog';

const SAMPLE_FIXTURE = {
  projectName: 'Acme SaaS (Demo)',
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

const WORKFLOW_STEPS = [
  {
    step: '01',
    title: 'Input aggregate counts',
    desc: 'Enter your project user counts and monthly revenue manually or drag & drop a multi-row CSV.',
  },
  {
    step: '02',
    title: 'Calculate core metrics',
    desc: 'Instant, deterministic calculation of churn, retention, ARPU, MRR, and estimated LTV.',
  },
  {
    step: '03',
    title: 'Track snapshots & AI context',
    desc: 'Compare historical records with signed delta points, export reports, and consult contextual AI insights.',
  },
];

const PROVEN_CAPABILITIES = [
  {
    title: 'Snapshot Ledger & History',
    desc: 'Every calculation is stored as an immutable snapshot. Track changes over time and compare two periods with exact percentage point (pp) deltas.',
  },
  {
    title: 'Batch CSV Processing',
    desc: 'Upload multi-project datasets up to 5MB and 500 rows. Inspect valid and invalid rows with dedicated pre-validation before promoting to analysis.',
  },
  {
    title: 'Contextual AI & Offline Fallback',
    desc: 'Generate tactical retention advice using multi-tier models, backed by guaranteed rule-based fallback when AI providers are offline.',
  },
  {
    title: 'Data Isolation & Integrity',
    desc: 'Account-scoped session security with strict CSRF protection and signed cookies. Your metric snapshots stay strictly isolated to your account.',
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
      {/* Top Navbar */}
      <header className="border-b border-[var(--cs-border)] bg-[var(--cs-surface)]/90 backdrop-blur-md">
        <div className="mx-auto flex min-h-[64px] max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2.5">
            <Image
              src="/churn.jpg"
              alt="ChurnSense logo"
              width={34}
              height={34}
              priority
              className="rounded-lg border border-[var(--cs-border)]"
            />
            <span className="text-base font-bold tracking-tight text-[var(--cs-text)]">
              ChurnSense
            </span>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <a
              href="#how"
              className="hidden text-xs font-medium text-[var(--cs-muted)] hover:text-[var(--cs-text)] sm:inline"
            >
              How it works
            </a>
            <a
              href="#about"
              className="hidden text-xs font-medium text-[var(--cs-muted)] hover:text-[var(--cs-text)] sm:inline"
            >
              About
            </a>
            <ThemeToggle />
            <button
              type="button"
              onClick={() => {
                setError(null);
                setSent(false);
                setGateOpen(true);
              }}
              className="btn-primary min-h-[40px] px-4 py-1.5 text-xs font-semibold"
            >
              Sign in
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Landmark */}
      <main id="main-content" tabIndex={-1} className="outline-none">
        {/* Hero & Interactive Product Preview Section */}
        <section className="mx-auto max-w-6xl px-4 pt-12 pb-16 sm:px-6 sm:pt-16 lg:pt-20">
          <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-12">
            {/* Left Column: Editorial Value Proposition */}
            <div className="space-y-6 lg:col-span-6">
              <div className="inline-flex items-center gap-2 rounded-md border border-[var(--cs-primary)]/20 bg-[var(--cs-accent-surface)] px-2.5 py-1 text-xs font-medium text-[var(--cs-primary)]">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--cs-primary)]" />
                SaaS Retention Workbench
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-[var(--cs-text)] sm:text-5xl lg:text-[44px] lg:leading-[1.12]">
                Understand the customers you keep.
              </h1>

              <p className="text-base leading-relaxed text-[var(--cs-muted)] sm:text-lg">
                ChurnSense converts raw user counts and revenue into churn rate, retention, ARPU,
                and estimated LTV. Track historical snapshots, compare performance, and get
                clear tactical guidance.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setError(null);
                    setSent(false);
                    setGateOpen(true);
                  }}
                  className="btn-primary min-h-[44px] px-6 py-2.5 text-sm font-semibold"
                >
                  Open your dashboard →
                </button>
                <a
                  href="#how"
                  className="btn-secondary min-h-[44px] px-5 py-2.5 text-sm font-medium"
                >
                  See how it works
                </a>
              </div>
            </div>

            {/* Right Column: Authentic Product Proof Card */}
            <div className="lg:col-span-6">
              <div className="workbench-panel overflow-hidden border border-[var(--cs-border)] bg-[var(--cs-surface)] shadow-lg">
                <div className="flex items-center justify-between border-b border-[var(--cs-border)] bg-[var(--cs-bg)]/60 px-4 py-2.5 text-xs font-medium">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[var(--cs-primary)]" />
                    <span className="font-semibold text-[var(--cs-text)]">
                      {SAMPLE_FIXTURE.projectName}
                    </span>
                  </div>
                  <span className="rounded bg-[var(--cs-surface)] px-2 py-0.5 text-[11px] font-medium text-[var(--cs-muted)] border border-[var(--cs-border)]">
                    Illustrative Sample · Not Your Real Data
                  </span>
                </div>

                <div className="p-5 space-y-4">
                  {/* Two Primary Metric Cards */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-lg border border-[var(--cs-border)] bg-[var(--cs-bg)] p-3.5">
                      <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--cs-muted)]">
                        Churn Rate
                      </div>
                      <div className="mt-1 text-2xl font-bold font-tabular text-[var(--cs-danger)]">
                        {(SAMPLE_FIXTURE.churnRate * 100).toFixed(1)}%
                      </div>
                      <div className="mt-1 text-[11px] text-[var(--cs-muted)]">
                        150 lost of 1,000 total
                      </div>
                    </div>

                    <div className="rounded-lg border border-[var(--cs-border)] bg-[var(--cs-bg)] p-3.5">
                      <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--cs-muted)]">
                        Retention Rate
                      </div>
                      <div className="mt-1 text-2xl font-bold font-tabular text-[var(--cs-primary)]">
                        {(SAMPLE_FIXTURE.retentionRate * 100).toFixed(1)}%
                      </div>
                      <div className="mt-1 text-[11px] text-[var(--cs-muted)]">
                        850 active subscribers
                      </div>
                    </div>
                  </div>

                  {/* Supporting Financial Indicators */}
                  <div className="grid grid-cols-3 gap-2 border-t border-[var(--cs-border)] pt-3 text-center sm:text-left">
                    <div className="px-1">
                      <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--cs-muted)]">
                        ARPU
                      </div>
                      <div className="mt-0.5 text-sm font-semibold font-tabular text-[var(--cs-text)]">
                        ${SAMPLE_FIXTURE.arpu.toFixed(2)}
                      </div>
                    </div>
                    <div className="px-1 border-x border-[var(--cs-border)] sm:px-2">
                      <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--cs-muted)]">
                        MRR
                      </div>
                      <div className="mt-0.5 text-sm font-semibold font-tabular text-[var(--cs-text)]">
                        ${SAMPLE_FIXTURE.mrr.toLocaleString('en-US')}
                      </div>
                    </div>
                    <div className="px-1">
                      <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--cs-muted)]">
                        Est. LTV
                      </div>
                      <div className="mt-0.5 text-sm font-semibold font-tabular text-[var(--cs-text)]">
                        ${SAMPLE_FIXTURE.estimatedLtv.toFixed(2)}
                      </div>
                    </div>
                  </div>

                  {/* Sample Status & Explainer */}
                  <div className="flex items-center justify-between rounded-md bg-[var(--cs-accent-surface)] px-3 py-2 text-xs text-[var(--cs-accent)]">
                    <span>Risk evaluation: <strong>{SAMPLE_FIXTURE.riskStatus}</strong> (&gt;15% churn threshold)</span>
                    <span className="text-[11px]">Formula: ARPU ÷ Churn</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3-Step Process Section */}
        <section id="how" className="border-t border-[var(--cs-border)] bg-[var(--cs-surface)] py-16 sm:py-20">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <div className="text-center space-y-2">
              <h2 className="text-xl font-bold tracking-tight text-[var(--cs-text)] sm:text-2xl">
                How ChurnSense works
              </h2>
              <p className="text-xs text-[var(--cs-muted)] max-w-md mx-auto">
                No complex tracking scripts or event instrumentation required.
              </p>
            </div>

            <div className="mt-10 grid gap-6 sm:grid-cols-3">
              {WORKFLOW_STEPS.map((s) => (
                <div
                  key={s.step}
                  className="rounded-xl border border-[var(--cs-border)] bg-[var(--cs-bg)] p-5 space-y-2"
                >
                  <div className="text-xs font-mono font-bold text-[var(--cs-primary)]">
                    {s.step}
                  </div>
                  <h3 className="text-sm font-semibold text-[var(--cs-text)]">
                    {s.title}
                  </h3>
                  <p className="text-xs leading-relaxed text-[var(--cs-muted)]">
                    {s.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Verified Capabilities */}
        <section className="border-t border-[var(--cs-border)] py-16 sm:py-20">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <div className="text-center space-y-2">
              <h2 className="text-xl font-bold tracking-tight text-[var(--cs-text)] sm:text-2xl">
                Built for clarity and reliability
              </h2>
              <p className="text-xs text-[var(--cs-muted)] max-w-lg mx-auto">
                Engineered for founders and operators who need dependable numbers without generic AI hype.
              </p>
            </div>

            <div className="mt-10 grid gap-5 sm:grid-cols-2">
              {PROVEN_CAPABILITIES.map((cap) => (
                <div
                  key={cap.title}
                  className="rounded-xl border border-[var(--cs-border)] bg-[var(--cs-surface)] p-5 space-y-2"
                >
                  <h3 className="text-sm font-semibold text-[var(--cs-text)]">
                    {cap.title}
                  </h3>
                  <p className="text-xs leading-relaxed text-[var(--cs-muted)]">
                    {cap.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* About & Brand Philosophy */}
        <section id="about" className="border-t border-[var(--cs-border)] bg-[var(--cs-surface)] py-16">
          <div className="mx-auto max-w-4xl px-4 sm:px-6">
            <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:text-left">
              <Image
                src="/churn.jpg"
                alt="ChurnSense symbol"
                width={80}
                height={80}
                className="shrink-0 rounded-2xl border border-[var(--cs-border)] shadow-sm"
              />
              <div className="space-y-1.5">
                <h2 className="text-lg font-bold text-[var(--cs-text)]">
                  The ChurnSense Mark
                </h2>
                <p className="text-xs leading-relaxed text-[var(--cs-muted)]">
                  The seedling sprouting from a rising bar chart reflects our core belief: sustainable
                  growth is built on caring for the customers you already have. Our natural palette of
                  sage green and soft blue promotes a calm, editorial environment for serious data.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--cs-border)] py-8 text-center text-xs text-[var(--cs-muted)]">
        <p>© 2026 ChurnSense. Built for Hackathon Season 3 &ldquo;Build the Loop&rdquo;.</p>
      </footer>

      {/* Accessible Sign-In Modal */}
      <Dialog
        open={gateOpen}
        onClose={() => setGateOpen(false)}
        title="Sign in to ChurnSense"
        description="Enter your email address to access your analytics dashboard."
        maxWidth="max-w-sm"
      >
        {sent ? (
          <div className="space-y-4 py-2 text-center" role="status">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-[var(--cs-accent-surface)] text-[var(--cs-primary)] text-lg">
              ✉
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[var(--cs-text)]">Check your inbox</h3>
              <p className="mt-1 text-xs text-[var(--cs-muted)] leading-relaxed">
                We sent a secure sign-in link to{' '}
                <strong className="text-[var(--cs-text)]">{email}</strong>. It expires in 15 minutes.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setSent(false);
                setError(null);
              }}
              className="text-xs font-medium text-[var(--cs-primary)] underline underline-offset-2 hover:opacity-80"
            >
              Use a different email address
            </button>
          </div>
        ) : (
          <form onSubmit={handleEnter} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="auth-email" className="block text-xs font-semibold text-[var(--cs-text)]">
                Email address
              </label>
              <input
                id="auth-email"
                type="email"
                required
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="founder@company.com"
                className="input-control"
              />
            </div>

            {error && (
              <div
                className="rounded-lg border border-[var(--cs-danger)]/20 bg-red-500/10 p-3 text-xs text-[var(--cs-danger)]"
                role="alert"
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !email.trim()}
              className="btn-primary w-full min-h-[44px] text-sm font-semibold"
            >
              {loading ? 'Signing in…' : 'Continue with email →'}
            </button>

            <p className="text-center text-[11px] text-[var(--cs-muted)]">
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
