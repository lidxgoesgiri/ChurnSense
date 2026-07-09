'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ThemeToggle } from '@/components/theme-toggle';

const FEATURES = [
  { icon: '📉', title: 'Churn & retention', desc: 'Instant rates from raw user counts.' },
  { icon: '💰', title: 'ARPU · MRR · LTV', desc: 'Revenue health at a glance.' },
  { icon: '🤖', title: 'AI insights', desc: 'Automated, actionable next steps.' },
  { icon: '📊', title: 'Trends & anomalies', desc: 'Spot spikes against your baseline.' },
];

const DEEP_FEATURES = [
  {
    icon: '📁',
    title: 'Secure Data Ingestion',
    desc: 'Upload raw user data via CSV with one click. Owner-scoped encryption ensures your metrics never leak to other accounts. No manual spreadsheet formulas — we parse, validate, and sanitize instantly.',
  },
  {
    icon: '🧠',
    title: 'AI-Powered Behavioral Analysis',
    desc: 'Our analytics engine detects churn patterns automatically: trailing-average anomaly detection flags spikes/drops, and multi-model AI (with deterministic fallback) generates written insights explaining WHY users are leaving and WHAT to do next.',
  },
  {
    icon: '⚡',
    title: 'Real-Time Actionable Dashboard',
    desc: 'Interactive Recharts visualizations show retention curves, comparison bars, and risk badges. Chat with an AI that knows your project context. Export CSV reports. Save history. All in a cinematic dark-mode interface optimized for speed.',
  },
];

const COMPARISON = [
  {
    label: 'Traditional Spreadsheets',
    points: [
      { icon: '🐌', text: 'Manual formula setup — error-prone and slow' },
      { icon: '📅', text: 'Reactive only — spot trends after damage is done' },
      { icon: '❌', text: 'No AI insight — you interpret the numbers yourself' },
      { icon: '🔓', text: 'Shared files leak across teams without access control' },
    ],
  },
  {
    label: 'ChurnSense',
    points: [
      { icon: '⚡', text: 'Automated in seconds — zero manual calculation' },
      { icon: '🔮', text: 'Proactive AI — flags anomalies before they spiral' },
      { icon: '🤖', text: 'Written recommendations — tactical next steps, not raw data' },
      { icon: '🔒', text: 'Owner-scoped data isolation — HMAC-signed sessions, CSRF guards' },
    ],
  },
];

const STEPS = [
  { n: '01', title: 'Enter your data', desc: 'Type user counts manually or drag-and-drop a CSV for batch analysis.' },
  { n: '02', title: 'See the metrics', desc: 'Churn, retention, ARPU, MRR and estimated LTV — computed instantly, with a risk badge.' },
  { n: '03', title: 'Act on AI insight', desc: 'Get a written summary, a recommendation, and chat with an AI that knows your data.' },
];

// English rendering of the logo philosophy (translated from filosofi.md) — a
// healthy seedling growing out of a rising bar chart: data-driven growth.
const PHILOSOPHY = [
  {
    icon: '🌱',
    title: 'Seedling & new growth',
    desc: 'A business growing dynamically. The seedling marks the beginning of a healthy customer lifecycle.',
  },
  {
    icon: '📊',
    title: 'Bar-chart foundation',
    desc: 'Leaves and stem sprout straight from a rising bar chart — growth built on accurate, data-driven decisions.',
  },
  {
    icon: '🎨',
    title: 'Sage green & pastel blue',
    desc: 'A natural, soft palette that reads calm, professional, and clean.',
  },
  {
    icon: '🤝',
    title: 'Friendly & minimalist',
    desc: 'Gentle soft curves keep the platform approachable for every user.',
  },
];

export default function Home() {
  const router = useRouter();
  const [gateOpen, setGateOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
      // Verified flow: a magic link was emailed — no session yet.
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
    <div className="relative min-h-screen overflow-hidden">
      {/* Cinematic aurora backdrop — deep indigo, violet & cyan on near-black. */}
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="aurora-orb" style={{ top: '-12%', left: '-10%', width: '52vw', height: '52vw', background: '#4f46e5' }} />
        <div className="aurora-orb" style={{ bottom: '-16%', right: '-12%', width: '46vw', height: '46vw', background: '#7c3aed', animationDelay: '-7s' }} />
        <div className="aurora-orb" style={{ top: '32%', right: '20%', width: '28vw', height: '28vw', background: '#22d3ee', animationDelay: '-13s' }} />
        {/* Subtle grid + vignette for depth. */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
            backgroundSize: '56px 56px',
            maskImage: 'radial-gradient(70% 60% at 50% 30%, black, transparent)',
            WebkitMaskImage: 'radial-gradient(70% 60% at 50% 30%, black, transparent)',
          }}
        />
      </div>

      {/* Navbar */}
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <div className="anim-fade-down flex items-center gap-2.5">
          <Image src="/churn.jpg" alt="ChurnSense logo" width={40} height={40} priority className="rounded-xl shadow-sm ring-1 ring-white/10" />
          <span className="text-lg font-bold tracking-tight">ChurnSense</span>
        </div>
        <div className="flex items-center gap-2">
          <a href="#how" className="hidden rounded-lg px-3 py-1.5 text-sm text-gray-400 transition-colors hover:text-foreground sm:inline">How it works</a>
          <a href="#about" className="hidden rounded-lg px-3 py-1.5 text-sm text-gray-400 transition-colors hover:text-foreground sm:inline">About</a>
          <ThemeToggle />
          <button onClick={() => setGateOpen(true)} className="btn-primary px-4 py-2 text-sm">
            Sign in
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto flex max-w-3xl flex-col items-center px-6 pt-12 pb-16 text-center sm:pt-20">
        <Image src="/churn.jpg" alt="ChurnSense" width={96} height={96} priority className="anim-float mb-6 rounded-3xl shadow-2xl ring-1 ring-white/10" />
        <span
          className="anim-fade-up inline-block rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide backdrop-blur"
          style={{ animationDelay: '0.05s', borderColor: 'var(--card-border)', background: 'color-mix(in srgb, var(--accent) 10%, transparent)' }}
        >
          AI-powered SaaS retention analytics
        </span>
        <h1 className="anim-fade-up mt-5 text-5xl font-bold tracking-tight sm:text-7xl" style={{ animationDelay: '0.12s' }}>
          Grow what you <span className="text-gradient">keep</span>.
        </h1>
        <p className="anim-fade-up mx-auto mt-5 max-w-xl text-lg text-gray-400" style={{ animationDelay: '0.2s' }}>
          ChurnSense turns raw user counts into churn, retention, ARPU, MRR and LTV —
          tracks them over time, flags anomalies, and hands you an automated AI insight
          on exactly what to do next.
        </p>
        <div className="anim-fade-up mt-8 flex flex-wrap items-center justify-center gap-3" style={{ animationDelay: '0.3s' }}>
          <button onClick={() => setGateOpen(true)} className="btn-primary px-6 py-3 text-sm">
            Get started — it&apos;s free →
          </button>
          <a href="#how" className="rounded-xl border px-6 py-3 text-sm font-semibold transition-colors hover:bg-white/5" style={{ borderColor: 'var(--card-border)' }}>
            See how it works
          </a>
        </div>
      </section>

      {/* Feature cards */}
      <section className="mx-auto grid max-w-4xl grid-cols-2 gap-3 px-6 sm:grid-cols-4">
        {FEATURES.map((f, i) => (
          <div
            key={f.title}
            className="anim-fade-up glass-card p-4 text-center"
            style={{ animationDelay: `${0.1 + i * 0.08}s` }}
          >
            <div className="text-2xl">{f.icon}</div>
            <div className="mt-2 text-sm font-semibold">{f.title}</div>
            <div className="mt-1 text-xs text-gray-400">{f.desc}</div>
          </div>
        ))}
      </section>

      {/* Deep-Dive Features */}
      <section className="mx-auto max-w-5xl px-6 py-20">
        <h2 className="text-center text-2xl font-bold tracking-tight sm:text-3xl">
          Built for speed, powered by intelligence
        </h2>
        <p className="mx-auto mt-2 max-w-2xl text-center text-sm text-gray-400">
          ChurnSense combines secure data handling, AI-driven pattern detection, and a
          real-time dashboard so you spend zero time on spreadsheets and all your energy on
          keeping customers.
        </p>
        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {DEEP_FEATURES.map((feat, i) => (
            <div
              key={feat.title}
              className="glass-card p-6"
              style={{ animationDelay: `${0.15 + i * 0.1}s` }}
            >
              <div className="text-3xl">{feat.icon}</div>
              <h3 className="mt-4 text-lg font-semibold">{feat.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-400">{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Competitive Comparison */}
      <section className="mx-auto max-w-5xl px-6 pb-20">
        <h2 className="text-center text-2xl font-bold tracking-tight sm:text-3xl">
          Why ChurnSense?
        </h2>
        <p className="mx-auto mt-2 max-w-2xl text-center text-sm text-gray-400">
          Traditional spreadsheet workflows are reactive, error-prone, and time-consuming.
          ChurnSense automates the entire pipeline — from ingestion to AI-powered recommendations.
        </p>
        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {COMPARISON.map((col, idx) => (
            <div key={col.label} className="glass-card p-8">
              <div className="mb-6 flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full text-xl ${
                    idx === 0 ? 'bg-red-500/20 text-red-400' : 'bg-accent/20 text-accent'
                  }`}
                >
                  {idx === 0 ? '📊' : '✨'}
                </div>
                <h3 className="text-lg font-bold">{col.label}</h3>
              </div>
              <ul className="space-y-4">
                {col.points.map((pt, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="text-xl">{pt.icon}</span>
                    <span className="text-sm text-gray-400">{pt.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="mx-auto max-w-4xl px-6 py-20">
        <h2 className="text-center text-2xl font-bold tracking-tight sm:text-3xl">How it works</h2>
        <p className="mt-2 text-center text-sm text-gray-400">From raw numbers to an actionable decision in three steps.</p>
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {STEPS.map((s) => (
            <div key={s.n} className="glass-card p-6">
              <div className="text-gradient text-3xl font-bold">{s.n}</div>
              <div className="mt-3 text-base font-semibold">{s.title}</div>
              <div className="mt-1.5 text-sm text-gray-400">{s.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* About / Logo philosophy (English) */}
      <section id="about" className="mx-auto max-w-4xl px-6 pb-20">
        <div className="glass-card overflow-hidden p-8 sm:p-10">
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
            <Image src="/churn.jpg" alt="ChurnSense logo" width={120} height={120} className="shrink-0 rounded-3xl shadow-lg ring-1 ring-white/10" />
            <div>
              <h2 className="text-2xl font-bold tracking-tight">The logo philosophy</h2>
              <p className="mt-2 text-sm leading-relaxed text-gray-400">
                The ChurnSense mark shows a <strong>seedling growing straight out of a rising
                bar chart</strong> — a promise that healthy retention is born from growth
                supported by data. Its palette of <em>sage green</em> &amp; <em>pastel blue</em>
                is calm, professional, and clean.
              </p>
            </div>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {PHILOSOPHY.map((p) => (
              <div key={p.title} className="flex gap-3 rounded-xl border p-4" style={{ borderColor: 'var(--card-border)' }}>
                <span className="text-2xl">{p.icon}</span>
                <div>
                  <div className="text-sm font-semibold">{p.title}</div>
                  <div className="mt-0.5 text-xs text-gray-400">{p.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mx-auto max-w-6xl px-6 py-10 text-center">
        <div className="flex items-center justify-center gap-2">
          <Image src="/churn.jpg" alt="" width={24} height={24} className="rounded-md ring-1 ring-white/10" />
          <span className="text-sm font-semibold">ChurnSense</span>
        </div>
        <p className="mt-3 text-xs text-gray-500">
          Built for Hackathon Season 3 &ldquo;Build the Loop&rdquo; — organized by TestSprite.
          <br />© 2026 Ida Bagus Giri Krisnabhawa.
        </p>
      </footer>

      {/* Passwordless Sign-In gate (modal) */}
      {gateOpen && (
        <div
          className="anim-fade fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={(e) => { if (e.target === e.currentTarget) setGateOpen(false); }}
          style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
        >
          <div className="anim-scale glass-card w-full max-w-sm p-8" style={{ boxShadow: '0 24px 64px rgba(0,0,0,0.55)' }}>
            <button
              onClick={() => setGateOpen(false)}
              aria-label="Close sign in"
              className="ml-auto block rounded-md px-1.5 text-gray-400 transition-colors hover:text-foreground"
            >
              ✕
            </button>
            <div className="flex flex-col items-center text-center">
              <Image src="/churn.jpg" alt="ChurnSense" width={56} height={56} className="rounded-2xl shadow ring-1 ring-white/10" />
              <h2 className="mt-3 text-xl font-bold">Welcome to ChurnSense</h2>
              <p className="mt-1 text-xs text-gray-400">Sign in to open your analytics dashboard.</p>
            </div>

            {sent ? (
              <div className="anim-fade-up mt-6 space-y-3 text-center" role="status">
                <div className="text-3xl">📬</div>
                <p className="text-sm font-medium">Check your inbox</p>
                <p className="text-xs text-gray-400">
                  We sent a secure sign-in link to{' '}
                  <span className="font-medium text-foreground">{email}</span>. It expires in 15
                  minutes.
                </p>
                <button
                  type="button"
                  onClick={() => { setSent(false); setError(null); }}
                  className="text-xs text-gray-400 underline transition-colors hover:text-foreground"
                >
                  Use a different email
                </button>
              </div>
            ) : (
              <form onSubmit={handleEnter} className="mt-6 space-y-3">
                <label htmlFor="email" className="block text-sm font-medium">Email address</label>
                <input
                  id="email"
                  type="email"
                  required
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="input-glow px-3 py-2.5 text-sm"
                />
                {error && <p className="anim-fade-down text-sm text-red-400">{error}</p>}
                <button type="submit" disabled={loading} className="btn-primary w-full py-3">
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="inline-block h-4 w-4 rounded-full border-2 border-white/30 border-t-white" style={{ animation: 'spin-slow 0.8s linear infinite' }} />
                      Signing in…
                    </span>
                  ) : (
                    'Continue with email →'
                  )}
                </button>
                <div className="flex items-center justify-center gap-1.5 pt-1 text-center text-xs text-gray-400">
                  <span aria-hidden>🔒</span>
                  <span>
                    We&apos;ll send a secure magic link or OTP token to your inbox.{' '}
                    <span className="font-medium text-foreground">Simple. Passwordless.</span>
                  </span>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
