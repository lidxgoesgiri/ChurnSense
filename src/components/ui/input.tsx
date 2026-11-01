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
          <label htmlFor={id} className="block text-[11px] font-mono font-medium uppercase tracking-wider text-[var(--cs-muted)]">
            {label}
          </label>
          {hint && (
            <span id={hintId} className="text-[10px] font-mono text-[var(--cs-muted)] opacity-75">
              {hint}
            </span>
          )}
        </div>
      )}
      <input
        id={id}
        aria-describedby={describedBy}
        aria-invalid={Boolean(error)}
        className={`input-control ${
          error ? 'border-[var(--cs-danger)] focus:border-[var(--cs-danger)] focus:ring-[var(--cs-danger)]' : ''
        } ${className}`}
        {...props}
      />
      {error && (
        <p id={errorId} className="text-xs text-[var(--cs-danger)] font-mono" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
