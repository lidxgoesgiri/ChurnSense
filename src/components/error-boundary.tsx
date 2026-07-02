'use client';

import { Component } from 'react';

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
      <div className="mx-auto flex min-h-[300px] max-w-md flex-col items-center justify-center gap-4 p-8 text-center">
        <span className="text-4xl">⚠</span>
        <h2 className="text-lg font-semibold">Something went wrong</h2>
        <p className="text-sm text-gray-500">
          {this.state.error?.message || 'An unexpected error occurred.'}
        </p>
        <button
          onClick={() => this.setState({ hasError: false, error: null })}
          className="rounded-lg bg-foreground px-4 py-2 text-sm font-semibold text-background transition-opacity hover:opacity-90"
        >
          Try again
        </button>
      </div>
    );
  }
}
