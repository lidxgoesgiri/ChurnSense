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

const STEPS = [
  { n: '01', title: 'Enter your data', desc: 'Type user counts manually or drag-and-drop a CSV for batch analysis.' },
  { n: '02', title: 'See the metrics', desc: 'Churn, retention, ARPU, MRR and estimated LTV — computed instantly, with a risk badge.' },
  { n: '03', title: 'Act on AI insight', desc: 'Get a written summary, a recommendation, and chat with an AI that knows your data.' },
];

// Logo philosophy (from filosofi.md) — a healthy seedling growing out of a
// rising bar chart: data-driven growth, calm & professional.
const PHILOSOPHY = [
  { icon: '🌱', title: 'Tunas & Seedling', desc: 'Melambangkan awal dari siklus hidup pelanggan yang sehat — bisnis yang tumbuh dinamis.' },
  { icon: '📊', title: 'Pondasi Bar Chart', desc: 'Daun tumbuh langsung dari diagram batang yang naik: pertumbuhan ditopang keputusan berbasis data.' },
  { icon: '🎨', title: 'Sage Green & Pastel Blue', desc: 'Palet natural yang lembut, menenangkan, profesional, dan bersih.' },
  { icon: '🤝', title: 'Ramah & Minimalis', desc: 'Sudut melengkung lembut memberi kesan approachable bagi setiap pengguna.' },
];

export default function Home() {
  const router = useRouter();
  const [gateOpen, setGateOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? 'Login failed');
      }
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Aurora backdrop tuned to the brand palette (sage green + pastel blue) */}
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="aurora-orb" style={{ top: '-10%', left: '-8%', width: '48vw', height: '48vw', background: '#7bb98f' }} />
        <div className="aurora-orb" style={{ bottom: '-14%', right: '-10%', width: '44vw', height: '44vw', background: '#8fbce6', animationDelay: '-7s' }} />
        <div className="aurora-orb" style={{ top: '35%', right: '22%', width: '26vw', height: '26vw', background: '#a7d7c5', animationDelay: '-13s' }} />
      </div>

      {/* Navbar with logo */}
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <div className="anim-fade-down flex items-center gap-2.5">
          <Image src="/churn.jpg" alt="ChurnSense logo" width={40} height={40} priority className="rounded-xl shadow-sm" />
          <span className="text-lg font-bold tracking-tight">ChurnSense</span>
        </div>
        <div className="flex items-center gap-2">
          <a href="#how" className="hidden rounded-lg px-3 py-1.5 text-sm text-gray-500 transition-colors hover:text-foreground sm:inline">How it works</a>
          <a href="#about" className="hidden rounded-lg px-3 py-1.5 text-sm text-gray-500 transition-colors hover:text-foreground sm:inline">About</a>
          <ThemeToggle />
          <button onClick={() => setGateOpen(true)} className="btn-primary px-4 py-2 text-sm">
            Sign in
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto flex max-w-3xl flex-col items-center px-6 pt-12 pb-16 text-center sm:pt-20">
        <Image src="/churn.jpg" alt="ChurnSense" width={96} height={96} priority className="anim-float mb-6 rounded-3xl shadow-lg" />
        <span
          className="anim-fade-up inline-block rounded-full border border-black/10 bg-white/40 px-3 py-1 text-xs font-semibold uppercase tracking-wide backdrop-blur dark:border-white/15 dark:bg-white/5"
          style={{ animationDelay: '0.05s' }}
        >
          AI-powered SaaS retention analytics
        </span>
        <h1 className="anim-fade-up mt-5 text-5xl font-bold tracking-tight sm:text-7xl" style={{ animationDelay: '0.12s' }}>
          Grow what you <span className="text-gradient">keep</span>.
        </h1>
        <p className="anim-fade-up mx-auto mt-5 max-w-xl text-lg text-gray-500 dark:text-gray-400" style={{ animationDelay: '0.2s' }}>
          ChurnSense turns raw user counts into churn, retention, ARPU, MRR and LTV —
          tracks them over time, flags anomalies, and hands you an automated AI insight
          on exactly what to do next.
        </p>
        <div className="anim-fade-up mt-8 flex flex-wrap items-center justify-center gap-3" style={{ animationDelay: '0.3s' }}>
          <button onClick={() => setGateOpen(true)} className="btn-primary px-6 py-3 text-sm">
            Get started — it&apos;s free →
          </button>
          <a href="#how" className="rounded-xl border border-black/10 px-6 py-3 text-sm font-semibold transition-colors hover:bg-black/5 dark:border-white/15 dark:hover:bg-white/10">
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
            <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">{f.desc}</div>
          </div>
        ))}
      </section>

      {/* How it works */}
      <section id="how" className="mx-auto max-w-4xl px-6 py-20">
        <h2 className="text-center text-2xl font-bold tracking-tight sm:text-3xl">How it works</h2>
        <p className="mt-2 text-center text-sm text-gray-500 dark:text-gray-400">From raw numbers to an actionable decision in three steps.</p>
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {STEPS.map((s) => (
            <div key={s.n} className="glass-card p-6">
              <div className="text-gradient text-3xl font-bold">{s.n}</div>
              <div className="mt-3 text-base font-semibold">{s.title}</div>
              <div className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">{s.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* About / Logo philosophy */}
      <section id="about" className="mx-auto max-w-4xl px-6 pb-20">
        <div className="glass-card overflow-hidden p-8 sm:p-10">
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
            <Image src="/churn.jpg" alt="ChurnSense logo" width={120} height={120} className="shrink-0 rounded-3xl shadow-md" />
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Filosofi Logo</h2>
              <p className="mt-2 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                Logo ChurnSense menggambarkan sebuah <strong>tunas yang tumbuh langsung dari
                grafik batang</strong> — retensi yang sehat lahir dari pertumbuhan yang ditopang
                data. Paletnya <em>sage green</em> &amp; <em>pastel blue</em>: tenang, profesional,
                dan bersih.
              </p>
            </div>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {PHILOSOPHY.map((p) => (
              <div key={p.title} className="flex gap-3 rounded-xl border border-black/5 p-4 dark:border-white/5">
                <span className="text-2xl">{p.icon}</span>
                <div>
                  <div className="text-sm font-semibold">{p.title}</div>
                  <div className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{p.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mx-auto max-w-6xl px-6 py-10 text-center">
        <div className="flex items-center justify-center gap-2">
          <Image src="/churn.jpg" alt="" width={24} height={24} className="rounded-md" />
          <span className="text-sm font-semibold">ChurnSense</span>
        </div>
        <p className="mt-3 text-xs text-gray-400">
          Built for Hackathon Season 3 &ldquo;Build the Loop&rdquo; — organized by TestSprite.
          <br />© 2026 Ida Bagus Giri Krisnabhawa.
        </p>
      </footer>

      {/* Elegant Sign-In gate (modal) */}
      {gateOpen && (
        <div
          className="anim-fade fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={(e) => { if (e.target === e.currentTarget) setGateOpen(false); }}
          style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
        >
          <div className="anim-scale glass-card w-full max-w-sm p-8" style={{ boxShadow: '0 12px 48px rgba(0,0,0,0.28)' }}>
            <button
              onClick={() => setGateOpen(false)}
              aria-label="Close sign in"
              className="ml-auto block rounded-md px-1.5 text-gray-400 transition-colors hover:text-foreground"
            >
              ✕
            </button>
            <div className="flex flex-col items-center text-center">
              <Image src="/churn.jpg" alt="ChurnSense" width={56} height={56} className="rounded-2xl shadow" />
              <h2 className="mt-3 text-xl font-bold">Welcome to ChurnSense</h2>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Sign in to open your analytics dashboard.</p>
            </div>

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
              {error && <p className="anim-fade-down text-sm text-red-500">{error}</p>}
              <button type="submit" disabled={loading} className="btn-primary w-full py-3">
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="inline-block h-4 w-4 rounded-full border-2 border-white/30 border-t-white" style={{ animation: 'spin-slow 0.8s linear infinite' }} />
                    Entering…
                  </span>
                ) : (
                  'Enter dashboard →'
                )}
              </button>
              <p className="text-center text-xs text-gray-400">Demo access — any valid email works.</p>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
