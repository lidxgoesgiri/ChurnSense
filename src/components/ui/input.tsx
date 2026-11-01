'use client';

import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
}

export function Input({ label, hint, error, id, className = '', ...props }: InputProps) {
  const hintId = hint && id ? `${id}-hint` : undefined;
  const errorId = error && id ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;

  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <div className="flex items-center justify-between">
          <label htmlFor={id} className="block text-xs font-semibold text-[var(--cs-text)]">
            {label}
          </label>
          {hint && (
            <span id={hintId} className="text-[11px] text-[var(--cs-muted)]">
              {hint}
            </span>
          )}
        </div>
      )}
      <input
        id={id}
        aria-describedby={describedBy}
        aria-invalid={Boolean(error)}
        className={`w-full min-h-[44px] rounded-lg border border-[var(--cs-control-border)] bg-[var(--cs-surface)] px-3 py-2 text-sm text-[var(--cs-text)] placeholder:text-[var(--cs-muted)] outline-none transition-colors focus:border-[var(--cs-focus)] focus:ring-1 focus:ring-[var(--cs-focus)] disabled:opacity-40 disabled:cursor-not-allowed ${
          error ? 'border-[var(--cs-danger)] focus:border-[var(--cs-danger)] focus:ring-[var(--cs-danger)]' : ''
        } ${className}`}
        {...props}
      />
      {error && (
        <p id={errorId} className="text-xs text-[var(--cs-danger)]" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
