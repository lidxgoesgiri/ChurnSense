'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ThemeToggle } from '@/components/theme-toggle';

const FEATURES = [
  { icon: '📉', title: 'Churn & retention', desc: 'Instant rates from raw user counts.' },
  { icon: '💰', title: 'ARPU · MRR · LTV', desc: 'Revenue health at a glance.' },
  { icon: '🤖', title: 'AI insights', desc: 'Automated, actionable next steps.' },
  { icon: '📊', title: 'Trends & anomalies', desc: 'Spot spikes against your baseline.' },
];

export default function Home() {
  const router = useRouter();
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
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-16">
      {/* Animated aurora backdrop */}
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="aurora-orb" style={{ top: '-8%', left: '-6%', width: '46vw', height: '46vw', background: '#6366f1' }} />
        <div className="aurora-orb" style={{ bottom: '-12%', right: '-8%', width: '42vw', height: '42vw', background: '#22d3ee', animationDelay: '-7s' }} />
        <div className="aurora-orb" style={{ top: '30%', right: '20%', width: '28vw', height: '28vw', background: '#a855f7', animationDelay: '-13s' }} />
      </div>

      <div className="absolute right-5 top-5">
        <ThemeToggle />
      </div>

      {/* Hero */}
      <div className="mb-10 max-w-2xl space-y-5 text-center">
        <span
          className="animate-fade-in-up inline-block rounded-full border border-black/10 bg-white/40 px-3 py-1 text-xs font-semibold uppercase tracking-wide backdrop-blur dark:border-white/15 dark:bg-white/5"
          style={{ animationDelay: '0.05s' }}
        >
          SaaS retention analytics
        </span>
        <h1
          className="animate-fade-in-up text-6xl font-bold tracking-tight sm:text-7xl"
          style={{ animationDelay: '0.12s' }}
        >
          <span className="text-gradient">ChurnSense</span>
        </h1>
        <p
          className="animate-fade-in-up mx-auto max-w-xl text-lg text-gray-500 dark:text-gray-400"
          style={{ animationDelay: '0.2s' }}
        >
          Turn raw user counts into churn, retention, ARPU and LTV — track them
          over time and get an automated AI insight on what to do next.
        </p>
      </div>

      {/* Feature cards */}
      <div className="mb-10 grid w-full max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4">
        {FEATURES.map((f, i) => (
          <div
            key={f.title}
            className="animate-fade-in-up group rounded-2xl border border-black/10 bg-white/40 p-4 text-center backdrop-blur transition-transform duration-300 hover:-translate-y-1 dark:border-white/10 dark:bg-white/5"
            style={{ animationDelay: `${0.28 + i * 0.08}s` }}
          >
            <div className="text-2xl transition-transform duration-300 group-hover:scale-110">{f.icon}</div>
            <div className="mt-2 text-sm font-semibold">{f.title}</div>
            <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">{f.desc}</div>
          </div>
        ))}
      </div>

      {/* Sign-in card */}
      <form
        onSubmit={handleEnter}
        className="animate-fade-in-up w-full max-w-sm space-y-3 rounded-2xl border border-black/10 bg-white/50 p-6 shadow-xl backdrop-blur-md dark:border-white/15 dark:bg-white/5"
        style={{ animationDelay: '0.6s' }}
      >
        <label htmlFor="email" className="block text-sm font-medium">
          Sign in to continue
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@company.com"
          className="w-full rounded-lg border border-black/15 bg-transparent px-3 py-2 text-sm outline-none transition-colors focus:border-accent dark:border-white/20"
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-foreground px-4 py-2 text-sm font-semibold text-background transition-all hover:opacity-90 hover:shadow-lg disabled:opacity-50"
        >
          {loading ? 'Entering…' : 'Enter dashboard'}
        </button>
        <p className="text-center text-xs text-gray-400">Demo access — any valid email works.</p>
      </form>
    </main>
  );
}
