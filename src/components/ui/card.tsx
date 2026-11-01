import React from 'react';

export function Card({ className = '', children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`rounded-xl border border-[var(--cs-border)] bg-[var(--cs-surface)] p-5 text-[var(--cs-text)] shadow-sm ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className = '', children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`mb-3.5 flex items-center justify-between ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ className = '', children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={`text-xs font-semibold uppercase tracking-wider text-[var(--cs-muted)] ${className}`} {...props}>
      {children}
    </h3>
  );
}
