'use client';

import { createContext, useCallback, useContext, useState } from 'react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: number;
  message: string;
  type: ToastType;
  exiting?: boolean;
}

const ICONS: Record<ToastType, string> = {
  success: '✓',
  error: '✕',
  info: 'ℹ',
  warning: '⚠',
};

const ACCENTS: Record<ToastType, string> = {
  success: 'var(--cs-success, #1F6B43)',
  error: 'var(--cs-danger, #B73535)',
  info: 'var(--cs-accent, #245B78)',
  warning: 'var(--cs-warning, #865400)',
};

interface ToastCtx {
  toast: (message: string, type?: ToastType) => void;
}

const Ctx = createContext<ToastCtx>({ toast: () => {} });
export const useToast = () => useContext(Ctx);

let _id = 0;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((message: string, type: ToastType = 'info') => {
    const id = ++_id;
    setToasts((prev) => [...prev, { id, message, type }]);
    // Animate out after 3.8s, then remove
    setTimeout(() => {
      setToasts((p) => p.map((t) => (t.id === id ? { ...t, exiting: true } : t)));
      setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 280);
    }, 3800);
  }, []);

  const dismiss = (id: number) => {
    setToasts((p) => p.map((t) => (t.id === id ? { ...t, exiting: true } : t)));
    setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 280);
  };

  return (
    <Ctx.Provider value={{ toast }}>
      {children}
      <div
        className="pointer-events-none fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-[calc(100vw-32px)] sm:bottom-6 sm:right-6"
        role="region"
        aria-live="polite"
        aria-label="Notifications"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            role={t.type === 'error' ? 'alert' : 'status'}
            className="pointer-events-auto flex items-center justify-between gap-3 rounded-lg border border-[var(--cs-border)] bg-[var(--cs-surface)] px-4 py-3 text-sm font-medium text-[var(--cs-text)] shadow-lg"
            style={{
              borderLeft: `4px solid ${ACCENTS[t.type]}`,
              width: 'min(380px, 100%)',
              animation: t.exiting
                ? 'toast-out 0.22s ease-in forwards'
                : 'toast-in 0.25s cubic-bezier(0.2, 0, 0, 1) forwards',
            }}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <span
                className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold"
                style={{
                  backgroundColor: `color-mix(in srgb, ${ACCENTS[t.type]} 15%, transparent)`,
                  color: ACCENTS[t.type],
                }}
              >
                {ICONS[t.type]}
              </span>
              <span className="truncate">{t.message}</span>
            </div>
            <button
              type="button"
              onClick={() => dismiss(t.id)}
              aria-label="Dismiss notification"
              className="text-[var(--cs-muted)] hover:text-[var(--cs-text)] p-1 text-xs"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </Ctx.Provider>
  );
}
