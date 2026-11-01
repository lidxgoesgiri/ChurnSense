'use client';

import { Component } from 'react';
import { AlertTriangleIcon } from './ui/icons';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="mx-auto flex min-h-[320px] max-w-md flex-col items-center justify-center gap-4 rounded-xl border border-[var(--cs-border)] bg-[var(--cs-surface)] p-8 text-center text-[var(--cs-text)] shadow-xl">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 text-[var(--cs-danger)]">
          <AlertTriangleIcon size={24} />
        </div>
        <div className="space-y-1">
          <h2 className="text-base font-semibold">System Exception Caught</h2>
          <p className="text-xs text-[var(--cs-muted)] font-mono leading-relaxed">
            {this.state.error?.message || 'An unexpected runtime error occurred.'}
          </p>
        </div>
        <button
          type="button"
          onClick={() => this.setState({ hasError: false, error: null })}
          className="btn-primary min-h-[38px] px-5 py-1.5 text-xs font-semibold"
        >
          Reset and Retry
        </button>
      </div>
    );
  }
}
