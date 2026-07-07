import { MetricCardSkeleton, InsightSkeleton, HistoryRowSkeleton } from '@/components/skeleton';

// Route-level loading UI (#6.5). Shown instantly while the server component
// verifies the session and renders the dashboard, so the user sees a structured
// skeleton instead of a blank/flashing screen. Next fades to real content.
export default function DashboardLoading() {
  return (
    <main className="mx-auto w-full max-w-5xl space-y-8 p-4 sm:p-6 md:p-10" aria-busy="true">
      <div className="skeleton h-4 w-40 rounded" />

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="glass-card space-y-4 p-6">
          <div className="skeleton h-4 w-24 rounded" />
          <div className="skeleton h-9 w-full rounded" />
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="skeleton h-9 w-full rounded" />
            ))}
          </div>
          <div className="skeleton h-10 w-full rounded" />
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <MetricCardSkeleton key={i} />
            ))}
          </div>
          <InsightSkeleton />
        </div>
      </div>

      <div className="glass-card p-6">
        <div className="skeleton mb-4 h-4 w-32 rounded" />
        <div className="divide-y divide-black/5 dark:divide-white/10">
          {[1, 2, 3].map((i) => (
            <HistoryRowSkeleton key={i} />
          ))}
        </div>
      </div>
    </main>
  );
}
