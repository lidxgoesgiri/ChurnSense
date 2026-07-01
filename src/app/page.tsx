'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

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
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 p-8">
      <div className="max-w-xl space-y-5 text-center">
        <span className="inline-block rounded-full border border-black/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide dark:border-white/15">
          Hackathon Season 3 · Build the Loop
        </span>
        <h1 className="text-5xl font-bold tracking-tight">ChurnSense</h1>
        <p className="text-lg text-gray-500">
          Turn raw user counts into churn, retention, and ARPU — with an
          automated AI insight on what to do next.
        </p>
      </div>

      <form
        onSubmit={handleEnter}
        className="w-full max-w-sm space-y-3 rounded-2xl border border-black/10 p-6 dark:border-white/15"
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
          className="w-full rounded-lg border border-black/15 bg-transparent px-3 py-2 text-sm outline-none focus:border-black/40 dark:border-white/20 dark:focus:border-white/50"
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-foreground px-4 py-2 text-sm font-semibold text-background transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {loading ? 'Entering…' : 'Enter dashboard'}
        </button>
        <p className="text-center text-xs text-gray-400">
          Demo access — any valid email works.
        </p>
      </form>
    </main>
  );
}
