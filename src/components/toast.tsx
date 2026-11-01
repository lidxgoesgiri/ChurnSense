'use client';

import { createContext, useCallback, useContext, useState } from 'react';
import { CheckCircle2Icon, XCircleIcon, AlertTriangleIcon, InfoIcon } from './ui/icons';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: number;
  message: string;
  type: ToastType;
  exiting?: boolean;
}

const ACCENTS: Record<ToastType, string> = {
  success: 'var(--cs-success, #10B981)',
  error: 'var(--cs-danger, #F43F5E)',
  info: 'var(--cs-accent, #06B6D4)',
  warning: 'var(--cs-warning, #F59E0B)',
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
        aria-label="System notifications"
      >
        {toasts.map((t) => {
          const accentColor = ACCENTS[t.type];
          return (
            <div
              key={t.id}
              role={t.type === 'error' ? 'alert' : 'status'}
              className="pointer-events-auto flex items-center justify-between gap-3 rounded-lg border border-[var(--cs-border)] bg-[var(--cs-surface)]/95 backdrop-blur-md px-4 py-3 text-xs font-medium text-[var(--cs-text)] shadow-xl"
              style={{
                borderLeft: `3px solid ${accentColor}`,
                width: 'min(380px, 100%)',
                animation: t.exiting
                  ? 'toast-out 0.22s ease-in forwards'
                  : 'toast-in 0.25s cubic-bezier(0.2, 0, 0, 1) forwards',
              }}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="shrink-0" style={{ color: accentColor }}>
                  {t.type === 'success' && <CheckCircle2Icon size={16} />}
                  {t.type === 'error' && <XCircleIcon size={16} />}
                  {t.type === 'warning' && <AlertTriangleIcon size={16} />}
                  {t.type === 'info' && <InfoIcon size={16} />}
                </span>
                <span className="truncate font-mono">{t.message}</span>
              </div>
              <button
                type="button"
                onClick={() => dismiss(t.id)}
                aria-label="Dismiss notification"
                className="text-[var(--cs-muted)] hover:text-[var(--cs-text)] p-1 text-xs"
              >
                &times;
              </button>
            </div>
          );
        })}
      </div>
    </Ctx.Provider>
  );
}
