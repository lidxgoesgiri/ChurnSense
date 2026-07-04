'use client';

export function Skeleton({
  width,
  height,
  className = '',
}: {
  width?: string | number;
  height?: string | number;
  className?: string;
}) {
  return (
    <div className={`skeleton ${className}`} style={{ width, height, minHeight: height ?? 14 }} />
  );
}

export function MetricCardSkeleton() {
  return (
    <div className="glass-card relative overflow-hidden p-4">
      <div className="skeleton absolute inset-x-0 top-0 h-[3px]" />
      <div className="flex items-center gap-2">
        <Skeleton width={20} height={20} className="rounded" />
        <Skeleton width="50%" height={10} />
      </div>
      <div className="mt-3">
        <Skeleton width="60%" height={24} />
      </div>
    </div>
  );
}

export function InsightSkeleton() {
  return (
    <div className="glass-card space-y-3 p-6">
      <div className="flex items-center gap-2">
        <Skeleton width={28} height={28} className="rounded-lg" />
        <Skeleton width="20%" height={12} />
      </div>
      <Skeleton width="100%" height={12} />
      <Skeleton width="85%" height={12} />
      <Skeleton width="60%" height={12} />
    </div>
  );
}

export function HistoryRowSkeleton() {
  return (
    <div className="flex items-center justify-between py-3">
      <div className="space-y-2">
        <Skeleton width={140} height={12} />
        <Skeleton width={90} height={10} />
      </div>
      <Skeleton width={70} height={12} />
    </div>
  );
}
