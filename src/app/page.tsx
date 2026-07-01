export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-8 text-center">
      <div className="max-w-xl space-y-4">
        <span className="inline-block rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide">
          Hackathon Season 3 · Build the Loop
        </span>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          LoopAnalytics
        </h1>
        <p className="text-base text-gray-500">
          Smart SaaS metrics dashboard — hitung churn, retensi, ARPU, dan insight
          otomatis berbasis AI. Live &amp; siap diverifikasi oleh TestSprite CLI.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-sm">
          <code className="rounded bg-gray-100 px-3 py-1 dark:bg-gray-800">
            GET /api/health
          </code>
          <code className="rounded bg-gray-100 px-3 py-1 dark:bg-gray-800">
            POST /api/metrics
          </code>
        </div>
      </div>
    </main>
  );
}
