'use client';

import { useState, useMemo, Suspense } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { ThemeToggle } from '@/components/theme-toggle';
import { Dialog } from '@/components/ui/dialog';
import {
  CyberBackground,
  AnimatedRibbon,
  PipelineRibbon,
  MagneticButton,
  SpotlightCard,
  RevealAnimation,
} from '@/components/web3';
import {
  MailCheckIcon,
  SparklesIcon,
  ActivityIcon,
  ShieldCheckIcon,
  FileSpreadsheetIcon,
  ArrowUpRightIcon,
  LayersIcon,
} from '@/components/ui/icons';

const PIPELINE_STAGES = [
  {
    stage: '01',
    code: 'INGEST',
    title: 'Aggregate Data Ingestion',
    desc: 'Supply user counts and monthly revenue via precision manual telemetry or batch stream CSV datasets up to 500 records.',
    tag: '5MB MAX QUOTA',
  },
  {
    stage: '02',
    code: 'COMPUTE',
    title: 'Deterministic Retention Engine',
    desc: 'Instant calculation of mathematical churn fractions, retention indices, ARPU, MRR, and asymptotic theoretical LTV.',
    tag: 'DETERMINISTIC · ZERO LATENCY',
  },
  {
    stage: '03',
    code: 'OPTIMIZE',
    title: 'Autonomous Agent Insights',
    desc: 'Context-aware AI evaluates trailing baseline anomalies and drafts tactical retention intervention strategies.',
    tag: 'MULTI-TIER LLM ORCHESTRATION',
  },
];

const CAPABILITY_PODS = [
  {
    icon: ActivityIcon,
    title: 'Immutable Snapshot Ledger',
    desc: 'Every calculation records an auditable point-in-time snapshot. Track temporal shifts with signed percentage point (pp) deltas.',
    stat: '100% AUDITABLE',
  },
  {
    icon: FileSpreadsheetIcon,
    title: 'Batch Dataset Processor',
    desc: 'Pre-validated multi-tenant CSV ingestion with quota enforcement, UTF-8 BOM sanitation, and 1-based error reporting.',
    stat: '500 ROWS / BATCH',
  },
  {
    icon: SparklesIcon,
    title: 'Autonomous AI Agent',
    desc: 'Multi-tier LLM reasoning engine backed by deterministic rule-based fallback guarantees zero system downtime.',
    stat: 'GEMINI · CLAUDE · LOCAL',
  },
  {
    icon: ShieldCheckIcon,
    title: 'Cryptographic Isolation',
    desc: 'Owner-scoped sessions secured via HMAC-signed session cookies, strict origin checks, and isolated persistence keys.',
    stat: 'HMAC-SHA256 SECURED',
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

  // Interactive Live Terminal Simulator state
  const [simTotalUsers, setSimTotalUsers] = useState<number>(1000);
  const [simActiveUsers, setSimActiveUsers] = useState<number>(850);
  const [simRevenue, setSimRevenue] = useState<number>(5000);

  // Dynamic calculations for preview
  const liveStats = useMemo(() => {
    const total = Math.max(1, simTotalUsers);
    const active = Math.min(total, Math.max(0, simActiveUsers));
    const churned = total - active;
    const churnRate = churned / total;
    const retentionRate = active / total;
    const arpu = active > 0 ? simRevenue / active : 0;
    const mrr = simRevenue;
    const ltv = churnRate > 0 ? arpu / churnRate : null;

    let risk: 'Low' | 'Medium' | 'High' = 'Low';
    if (churnRate > 0.15) risk = 'High';
    else if (churnRate > 0.05) risk = 'Medium';

    return {
      total,
      active,
      churned,
      churnRate: churnRate * 100,
      retentionRate: retentionRate * 100,
      arpu,
      mrr,
      ltv,
      risk,
    };
  }, [simTotalUsers, simActiveUsers, simRevenue]);

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
    <div className="relative min-h-screen bg-[var(--cs-bg)] text-[var(--cs-text)] selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Dynamic Cybernetic Web3 Background (Retention Currents & Growth Loops) */}
      <CyberBackground
        intensity="vibrant"
        showGrid
        showRetentionStreams
        showGrowthLoops
        showAurora
        showSpotlight
      />

      {/* Top Protocol Bar */}
      <header className="sticky top-0 z-40 border-b border-[var(--cs-border)] bg-[var(--cs-surface)]/80 backdrop-blur-2xl">
        <div className="mx-auto flex min-h-[68px] max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3.5">
            <div className="relative group">
              <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 opacity-30 blur-sm group-hover:opacity-70 transition-opacity" />
              <Image
                src="/churn.jpg"
                alt="ChurnSense"
                width={38}
                height={38}
                priority
                className="relative rounded-xl border border-white/20 shadow-md object-cover"
              />
              <span className="absolute -bottom-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-base font-extrabold tracking-tight text-[var(--cs-text)]">
                  CHURNSENSE
                </span>
                <span className="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-mono font-semibold tracking-wider text-emerald-400">
                  PROTOCOL V2.4
                </span>
              </div>
              <span className="text-[10px] font-mono text-[var(--cs-muted)] tracking-wider">
                RETENTION INTELLIGENCE ENGINE
              </span>
            </div>
          </div>

          <nav aria-label="Quick links" className="hidden items-center gap-7 md:flex">
            <a
              href="#interactive-demo"
              className="text-xs font-medium text-[var(--cs-muted)] transition-colors hover:text-emerald-400"
            >
              Simulator
            </a>
            <a
              href="#pipeline"
              className="text-xs font-medium text-[var(--cs-muted)] transition-colors hover:text-emerald-400"
            >
              Architecture
            </a>
            <a
              href="#capabilities"
              className="text-xs font-medium text-[var(--cs-muted)] transition-colors hover:text-emerald-400"
            >
              Capabilities
            </a>
            <a
              href="#philosophy"
              className="text-xs font-medium text-[var(--cs-muted)] transition-colors hover:text-emerald-400"
            >
              Philosophy
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <MagneticButton
              variant="glow"
              onClick={() => {
                setError(null);
                setSent(false);
                setGateOpen(true);
              }}
              className="px-4 py-2 text-xs"
            >
              <span>Launch Terminal</span>
              <ArrowUpRightIcon size={14} className="text-emerald-400" />
            </MagneticButton>
          </div>
        </div>
      </header>

      {/* Main Content Landmark */}
      <main id="main-content" tabIndex={-1} className="relative z-10 outline-none">
        {/* Hero Section */}
        <section className="relative mx-auto max-w-7xl px-4 pt-12 pb-24 sm:px-6 sm:pt-20 lg:px-8 lg:pt-24 overflow-hidden">
          {/* Hero Organic Flowing Ribbon */}
          <AnimatedRibbon className="absolute -top-10 left-0 right-0 h-[380px] w-full" opacity={0.45} />

          <div className="grid items-center gap-12 lg:grid-cols-12 relative z-10">
            {/* Left Value Proposition */}
            <div className="space-y-6 lg:col-span-6">
              <RevealAnimation direction="down" delayMs={50}>
                <div className="inline-flex items-center gap-2.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-mono text-emerald-400 backdrop-blur-md shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                  <span className="live-pulse" />
                  <span className="font-semibold uppercase tracking-wider text-[11px]">
                    Autonomous Retention Protocol
                  </span>
                  <span className="h-1 w-1 rounded-full bg-emerald-500" />
                  <span className="text-[10px] opacity-80">v2.4 Mainnet</span>
                </div>
              </RevealAnimation>

              <RevealAnimation direction="up" delayMs={120}>
                <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-[54px] lg:leading-[1.15] text-[var(--cs-text)]">
                  Decentralized-Grade{' '}
                  <span className="relative inline-block">
                    <span className="text-glow-gradient-web3">
                      SaaS Retention
                    </span>
                    {/* Decorative Curved Underline SVG */}
                    <svg
                      className="absolute -bottom-2 left-0 w-full h-3.5 curved-underline-glow overflow-visible pointer-events-none"
                      viewBox="0 0 260 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M6 13C85 3 175 3 254 13"
                        stroke="url(#retention-curve-grad)"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                      />
                      <defs>
                        <linearGradient id="retention-curve-grad" x1="6" y1="8" x2="254" y2="8" gradientUnits="userSpaceOnUse">
                          <stop stopColor="#10B981" />
                          <stop offset="0.5" stopColor="#2DD4BF" />
                          <stop offset="1" stopColor="#38BDF8" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </span>{' '}
                  Intelligence.
                </h1>
              </RevealAnimation>

              <RevealAnimation direction="up" delayMs={200}>
                <p className="text-sm leading-relaxed text-[var(--cs-muted)] sm:text-base font-normal max-w-xl">
                  Engineered for high-throughput subscription operators. Convert aggregate customer counts
                  into auditable churn fractions, retention indices, ARPU, and MRR. Powered by immutable
                  snapshot ledgers and multi-tier autonomous AI agents.
                </p>
              </RevealAnimation>

              <RevealAnimation direction="up" delayMs={280}>
                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <MagneticButton
                    variant="primary"
                    onClick={() => {
                      setError(null);
                      setSent(false);
                      setGateOpen(true);
                    }}
                    className="min-h-[48px] px-7 py-3 text-xs tracking-wider"
                  >
                    <span>Enter Terminal Console</span>
                    <ArrowUpRightIcon size={16} />
                  </MagneticButton>

                  <MagneticButton
                    as="a"
                    href="#pipeline"
                    variant="secondary"
                    className="min-h-[48px] px-6 py-3 text-xs tracking-wide"
                  >
                    <LayersIcon size={15} className="text-emerald-400" />
                    <span>System Architecture</span>
                  </MagneticButton>
                </div>
              </RevealAnimation>

              {/* Protocol Trust & Telemetry Strip */}
              <RevealAnimation direction="up" delayMs={340}>
                <div className="flex flex-wrap items-center gap-6 border-t border-[var(--cs-border)] pt-6 font-mono text-[11px] text-[var(--cs-muted)]">
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    <span>DETERMINISTIC FORMULAS</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                    <span>HMAC-SIGNED SESSION</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    <span>ZERO DATA RETENTION LEAK</span>
                  </div>
                </div>
              </RevealAnimation>
            </div>

            {/* Right: Interactive 3D Web3 Terminal Preview Widget */}
            <div id="interactive-demo" className="lg:col-span-6">
              <RevealAnimation direction="left" delayMs={200}>
                <SpotlightCard
                  glowColor="rgba(16, 185, 129, 0.22)"
                  className="border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.6)]"
                >
                  {/* Terminal Header Bar */}
                  <div className="flex items-center justify-between border-b border-[var(--cs-border)] bg-[var(--cs-elevated)]/80 px-4 py-3 backdrop-blur-md">
                    <div className="flex items-center gap-2">
                      <span className="h-3 w-3 rounded-full bg-rose-500/80 shadow-[0_0_8px_rgba(244,63,94,0.6)]" />
                      <span className="h-3 w-3 rounded-full bg-amber-500/80 shadow-[0_0_8px_rgba(245,158,11,0.6)]" />
                      <span className="h-3 w-3 rounded-full bg-emerald-500/80 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
                      <span className="ml-2 font-mono text-xs font-semibold text-[var(--cs-text)]">
                        CORE PROTOCOL TELEMETRY
                      </span>
                    </div>
                    <div className="flex items-center gap-2 font-mono text-[10px]">
                      <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-emerald-400 border border-emerald-500/30">
                        INTERACTIVE REACTION
                      </span>
                    </div>
                  </div>

                  <div className="p-6 space-y-6">
                    {/* Live Metric HUD Pods */}
                    <div className="grid grid-cols-2 gap-3.5">
                      {/* Churn Rate Pod */}
                      <div className="relative overflow-hidden rounded-xl border border-rose-500/25 bg-rose-500/5 p-4.5 transition-all">
                        <div className="flex items-center justify-between text-[11px] font-mono font-semibold uppercase tracking-wider text-[var(--cs-muted)]">
                          <span>CHURN RATE</span>
                          <span className="text-rose-400 font-bold">{liveStats.churnRate.toFixed(2)}%</span>
                        </div>
                        <div className="mt-2 text-3xl font-extrabold font-mono text-rose-500 tracking-tight">
                          {liveStats.churnRate.toFixed(2)}%
                        </div>
                        <div className="mt-1 font-mono text-[10px] text-[var(--cs-muted)]">
                          {liveStats.churned.toLocaleString()} CHURNED / {liveStats.total.toLocaleString()} TOTAL
                        </div>
                        {/* Subtle sparkline visual */}
                        <div className="mt-3 h-1 w-full rounded-full bg-rose-950/40 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-rose-500 to-rose-400 transition-all duration-300"
                            style={{ width: `${Math.min(100, liveStats.churnRate)}%` }}
                          />
                        </div>
                      </div>

                      {/* Retention Rate Pod */}
                      <div className="relative overflow-hidden rounded-xl border border-emerald-500/25 bg-emerald-500/5 p-4.5 transition-all">
                        <div className="flex items-center justify-between text-[11px] font-mono font-semibold uppercase tracking-wider text-[var(--cs-muted)]">
                          <span>RETENTION</span>
                          <span className="text-emerald-400 font-bold">{liveStats.retentionRate.toFixed(2)}%</span>
                        </div>
                        <div className="mt-2 text-3xl font-extrabold font-mono text-emerald-400 tracking-tight">
                          {liveStats.retentionRate.toFixed(2)}%
                        </div>
                        <div className="mt-1 font-mono text-[10px] text-[var(--cs-muted)]">
                          {liveStats.active.toLocaleString()} ACTIVE SUBSCRIBERS
                        </div>
                        {/* Subtle sparkline visual */}
                        <div className="mt-3 h-1 w-full rounded-full bg-emerald-950/40 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300"
                            style={{ width: `${Math.min(100, liveStats.retentionRate)}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Monospace Financial Telemetry */}
                    <div className="grid grid-cols-3 gap-2 rounded-xl border border-[var(--cs-border)] bg-[var(--cs-bg)]/80 p-3.5 text-center">
                      <div>
                        <div className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[var(--cs-muted)]">
                          ARPU
                        </div>
                        <div className="mt-1 font-mono text-sm font-bold text-[var(--cs-text)]">
                          ${liveStats.arpu.toFixed(2)}
                        </div>
                      </div>
                      <div className="border-x border-[var(--cs-border)]">
                        <div className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[var(--cs-muted)]">
                          MRR
                        </div>
                        <div className="mt-1 font-mono text-sm font-bold text-[var(--cs-text)]">
                          ${liveStats.mrr.toLocaleString('en-US')}
                        </div>
                      </div>
                      <div>
                        <div className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[var(--cs-muted)]">
                          EST. LTV
                        </div>
                        <div className="mt-1 font-mono text-sm font-bold text-[var(--cs-text)]">
                          {liveStats.ltv !== null ? `$${liveStats.ltv.toFixed(2)}` : 'N/A'}
                        </div>
                      </div>
                    </div>

                    {/* Interactive Simulator Sliders (Touch & Feel Web3 Reaction) */}
                    <div className="rounded-xl border border-[var(--cs-border)] bg-[var(--cs-elevated)]/50 p-4 space-y-3.5">
                      <div className="flex items-center justify-between text-xs font-mono text-[var(--cs-muted)]">
                        <span className="font-semibold text-[var(--cs-text)]">ADJUST TELEMETRY INPUTS:</span>
                        <span className="text-[10px] text-emerald-400">REAL-TIME REACTIVE</span>
                      </div>

                      {/* Total Users Slider */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-[11px] font-mono text-[var(--cs-muted)]">
                          <span>Total User Capacity</span>
                          <span className="font-semibold text-[var(--cs-text)]">{simTotalUsers.toLocaleString()}</span>
                        </div>
                        <input
                          type="range"
                          min="500"
                          max="5000"
                          step="50"
                          value={simTotalUsers}
                          onChange={(e) => {
                            const newTotal = Number(e.target.value);
                            setSimTotalUsers(newTotal);
                            if (simActiveUsers > newTotal) {
                              setSimActiveUsers(newTotal);
                            }
                          }}
                          className="w-full accent-indigo-500 cursor-pointer h-1.5 bg-[var(--cs-border)] rounded-lg"
                        />
                      </div>

                      {/* Active Users Slider */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-[11px] font-mono text-[var(--cs-muted)]">
                          <span>Active Subscribers</span>
                          <span className="font-semibold text-emerald-400">{simActiveUsers.toLocaleString()}</span>
                        </div>
                        <input
                          type="range"
                          min="50"
                          max={simTotalUsers}
                          step="10"
                          value={simActiveUsers}
                          onChange={(e) => setSimActiveUsers(Number(e.target.value))}
                          className="w-full accent-emerald-500 cursor-pointer h-1.5 bg-[var(--cs-border)] rounded-lg"
                        />
                      </div>

                      {/* Revenue Slider */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-[11px] font-mono text-[var(--cs-muted)]">
                          <span>Monthly Revenue</span>
                          <span className="font-semibold text-[var(--cs-text)]">${simRevenue.toLocaleString()}</span>
                        </div>
                        <input
                          type="range"
                          min="1000"
                          max="25000"
                          step="500"
                          value={simRevenue}
                          onChange={(e) => setSimRevenue(Number(e.target.value))}
                          className="w-full accent-cyan-500 cursor-pointer h-1.5 bg-[var(--cs-border)] rounded-lg"
                        />
                      </div>
                    </div>

                    {/* Risk Assessment Tier Banner */}
                    <div className={`flex items-center justify-between rounded-xl border px-4 py-2.5 text-xs font-mono transition-all ${
                      liveStats.risk === 'High'
                        ? 'border-rose-500/30 bg-rose-500/10 text-rose-400'
                        : liveStats.risk === 'Medium'
                        ? 'border-amber-500/30 bg-amber-500/10 text-amber-400'
                        : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                    }`}>
                      <span className="flex items-center gap-2">
                        <span className={`h-2.5 w-2.5 rounded-full ${
                          liveStats.risk === 'High' ? 'bg-rose-500' : liveStats.risk === 'Medium' ? 'bg-amber-500' : 'bg-emerald-500'
                        }`} />
                        RISK ASSESSMENT: <strong>{liveStats.risk.toUpperCase()} RETENTION RISK</strong>
                      </span>
                      <span className="text-[10px] opacity-80">
                        {liveStats.risk === 'High' ? '>15% HIGH ALERT' : liveStats.risk === 'Medium' ? '5-15% MONITORING' : '<5% HEALTHY'}
                      </span>
                    </div>
                  </div>
                </SpotlightCard>
              </RevealAnimation>
            </div>
          </div>
        </section>

        {/* 3-Stage Pipeline Specification */}
        <section id="pipeline" className="border-t border-[var(--cs-border)] bg-[var(--cs-surface)]/40 py-24 relative overflow-hidden">
          {/* Animated Wave Ribbon Connecting Pipeline Stages */}
          <PipelineRibbon className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-[280px] w-full z-0 opacity-70" />

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
            <RevealAnimation direction="up" delayMs={50}>
              <div className="text-center space-y-3 max-w-2xl mx-auto">
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-mono text-emerald-400">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-semibold uppercase tracking-wider text-[11px]">Pipeline Specification</span>
                </div>
                <h2 className="text-3xl font-extrabold tracking-tight text-[var(--cs-text)] sm:text-4xl">
                  Deterministic Processing Stages
                </h2>
                <p className="text-xs sm:text-sm text-[var(--cs-muted)]">
                  Zero guesswork. Each data payload flows through three isolated execution rings designed for mathematical accuracy.
                </p>
              </div>
            </RevealAnimation>

            <div className="mt-14 grid gap-6 md:grid-cols-3 relative">
              {PIPELINE_STAGES.map((s, idx) => (
                <RevealAnimation key={s.stage} direction="up" delayMs={idx * 120}>
                  <SpotlightCard className="h-full p-7 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/25">
                        {s.code}
                      </span>
                      <span className="font-mono text-xs text-[var(--cs-muted)]">
                        STAGE {s.stage}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-[var(--cs-text)]">
                      {s.title}
                    </h3>

                    <p className="text-xs leading-relaxed text-[var(--cs-muted)] font-normal">
                      {s.desc}
                    </p>

                    <div className="pt-2 border-t border-[var(--cs-border)] font-mono text-[10px] text-emerald-400/80">
                      {s.tag}
                    </div>
                  </SpotlightCard>
                </RevealAnimation>
              ))}
            </div>
          </div>
        </section>

        {/* Protocol Capabilities Matrix */}
        <section id="capabilities" className="border-t border-[var(--cs-border)] py-20 relative">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <RevealAnimation direction="up" delayMs={50}>
              <div className="text-center space-y-3 max-w-2xl mx-auto">
                <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3.5 py-1 text-xs font-mono text-cyan-400">
                  <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
                  <span className="font-semibold uppercase tracking-wider text-[11px]">Verified Capabilities</span>
                </div>
                <h2 className="text-3xl font-extrabold tracking-tight text-[var(--cs-text)] sm:text-4xl">
                  Engineered for Absolute Integrity
                </h2>
                <p className="text-xs sm:text-sm text-[var(--cs-muted)]">
                  Architected with cryptographic rigor and deterministic data guarantees.
                </p>
              </div>
            </RevealAnimation>

            <div className="mt-14 grid gap-6 sm:grid-cols-2">
              {CAPABILITY_PODS.map((cap, idx) => {
                const IconComponent = cap.icon;
                return (
                  <RevealAnimation key={cap.title} direction="up" delayMs={idx * 100}>
                    <SpotlightCard className="p-7">
                      <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                          <IconComponent size={22} />
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <h3 className="text-base font-bold text-[var(--cs-text)]">
                              {cap.title}
                            </h3>
                            <span className="font-mono text-[9px] text-cyan-400 bg-cyan-500/10 border border-cyan-500/25 px-2 py-0.5 rounded">
                              {cap.stat}
                            </span>
                          </div>
                          <p className="text-xs leading-relaxed text-[var(--cs-muted)]">
                            {cap.desc}
                          </p>
                        </div>
                      </div>
                    </SpotlightCard>
                  </RevealAnimation>
                );
              })}
            </div>
          </div>
        </section>

        {/* Brand Philosophy & The Seedling Symbol */}
        <section id="philosophy" className="border-t border-[var(--cs-border)] bg-[var(--cs-surface)]/60 py-20 relative">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <RevealAnimation direction="up" delayMs={50}>
              <SpotlightCard className="p-8 sm:p-12">
                <div className="flex flex-col items-center gap-8 text-center sm:flex-row sm:text-left">
                  {/* Glowing Orbit Seedling Glyph */}
                  <div className="relative shrink-0">
                    <div className="absolute -inset-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 opacity-40 blur-md animate-pulse" />
                    <Image
                      src="/churn.jpg"
                      alt="ChurnSense Symbol"
                      width={88}
                      height={88}
                      priority
                      className="relative rounded-2xl border border-white/20 shadow-xl object-cover"
                    />
                    {/* Orbit Ring */}
                    <div className="absolute -inset-4 rounded-full border border-emerald-500/30 animate-spin-slow pointer-events-none" />
                  </div>

                  <div className="space-y-3">
                    <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-mono text-emerald-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="font-semibold uppercase tracking-wider text-[11px]">Brand Identity &amp; Philosophy</span>
                    </div>
                    <h3 className="text-xl font-extrabold text-[var(--cs-text)] sm:text-2xl">
                      The Sustainable Growth Seedling
                    </h3>
                    <p className="text-xs sm:text-sm leading-relaxed text-[var(--cs-muted)]">
                      The ChurnSense emblem portrays a vibrant seedling rising through an ascending bar chart.
                      In modern subscription ecosystems, lasting revenue expansion is not achieved by recklessly
                      churning and acquiring new users — it is built by cultivating, sustaining, and deepening relationships
                      with your existing subscriber base.
                    </p>
                  </div>
                </div>
              </SpotlightCard>
            </RevealAnimation>
          </div>
        </section>

        {/* Bottom CTA Terminal Banner */}
        <section className="border-t border-[var(--cs-border)] py-16 text-center relative overflow-hidden">
          <div className="mx-auto max-w-4xl px-4 sm:px-6">
            <RevealAnimation direction="up" delayMs={50}>
              <div className="space-y-6">
                <h2 className="text-2xl font-extrabold sm:text-4xl text-[var(--cs-text)]">
                  Ready to Deploy the Retention Workbench?
                </h2>
                <p className="text-xs sm:text-sm text-[var(--cs-muted)] max-w-lg mx-auto">
                  Execute passwordless session authentication or initialize development mode to start computing deterministic retention models.
                </p>
                <div className="pt-2">
                  <MagneticButton
                    variant="primary"
                    onClick={() => {
                      setError(null);
                      setSent(false);
                      setGateOpen(true);
                    }}
                    className="min-h-[48px] px-8 py-3 text-xs"
                  >
                    <span>Launch Terminal Console</span>
                    <ArrowUpRightIcon size={16} />
                  </MagneticButton>
                </div>
              </div>
            </RevealAnimation>
          </div>
        </section>
      </main>

      {/* Protocol Footer */}
      <footer className="border-t border-[var(--cs-border)] py-8 font-mono text-xs text-[var(--cs-muted)] relative z-10 bg-[var(--cs-surface)]/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6 lg:px-8">
          <p>© 2026 CHURNSENSE PROTOCOL · HACKATHON SEASON 3 BUILD THE LOOP</p>
          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              MAINNET ACTIVE
            </span>
            <span>SHANGHAI TIMEZONE</span>
          </div>
        </div>
      </footer>

      {/* Accessible Terminal Sign-In Dialog with Web3 Styling */}
      <Dialog
        open={gateOpen}
        onClose={() => setGateOpen(false)}
        title="Terminal Authentication"
        description="Authenticate via passwordless session to enter the retention workbench."
        maxWidth="max-w-md"
      >
        {sent ? (
          <div className="space-y-4 py-2 text-center" role="status">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.25)]">
              <MailCheckIcon size={28} />
            </div>
            <div>
              <h3 className="text-base font-mono font-bold text-[var(--cs-text)] uppercase tracking-wider">
                Magic Link Dispatched
              </h3>
              <p className="mt-1 text-xs text-[var(--cs-muted)] leading-relaxed font-mono">
                Verification token sent to <strong className="text-emerald-400">{email}</strong>.
                Session valid for 15 minutes.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setSent(false);
                setError(null);
              }}
              className="text-xs font-mono text-emerald-400 underline underline-offset-4 hover:text-emerald-300"
            >
              Use alternate email
            </button>
          </div>
        ) : (
          <form onSubmit={handleEnter} className="space-y-5">
            <div className="space-y-2">
              <label
                htmlFor="auth-email"
                className="block text-[11px] font-mono font-semibold uppercase tracking-wider text-[var(--cs-muted)]"
              >
                Operator Email Address
              </label>
              <input
                id="auth-email"
                type="email"
                required
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="operator@churnsense.io"
                className="input-glow font-mono text-xs w-full py-2.5 px-3 rounded-xl"
              />
            </div>

            {error && (
              <div
                className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs font-mono text-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.15)]"
                role="alert"
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !email.trim()}
              className="btn-primary w-full min-h-[46px] text-xs font-mono font-semibold uppercase tracking-wider inline-flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)]"
            >
              {loading ? (
                'INITIALIZING PROTOCOL HANDSHAKE…'
              ) : (
                <>
                  <span>INITIALIZE SESSION</span>
                  <ArrowUpRightIcon size={15} />
                </>
              )}
            </button>

            <div className="flex items-center justify-between pt-1 font-mono text-[10px] text-[var(--cs-muted)] border-t border-[var(--cs-border)]">
              <span>SECURITY: HMAC-SHA256</span>
              <span className="text-emerald-400">INSTANT DEV LOGIN</span>
            </div>
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
