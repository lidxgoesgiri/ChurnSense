import { MetricCardSkeleton, InsightSkeleton, HistoryRowSkeleton } from '@/components/skeleton';

export default function DashboardLoading() {
  return (
    <main
      id="main-content"
      aria-busy="true"
      aria-label="Loading dashboard"
      className="mx-auto w-full max-w-6xl space-y-8 p-4 sm:p-6 md:p-8"
    >
      <div className="flex items-center justify-between border-b border-[var(--cs-border)] pb-4">
        <div className="space-y-1.5">
          <div className="skeleton h-6 w-48 rounded" />
          <div className="skeleton h-4 w-72 rounded" />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        <div className="workbench-panel space-y-4 p-6 lg:col-span-5">
          <div className="skeleton h-4 w-28 rounded" />
          <div className="skeleton h-10 w-full rounded" />
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="skeleton h-10 w-full rounded" />
            ))}
          </div>
          <div className="skeleton h-11 w-full rounded" />
        </div>

        <div className="space-y-6 lg:col-span-7">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <MetricCardSkeleton key={i} />
            ))}
          </div>
          <InsightSkeleton />
        </div>
      </div>

      <div className="workbench-panel p-6">
        <div className="skeleton mb-4 h-4 w-36 rounded" />
        <div className="divide-y divide-[var(--cs-border)]">
          {[1, 2, 3].map((i) => (
            <HistoryRowSkeleton key={i} />
          ))}
        </div>
      </div>
    </main>
  );
}
