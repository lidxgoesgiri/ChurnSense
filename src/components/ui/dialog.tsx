'use client';

import { useEffect, useId, useRef } from 'react';

interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  maxWidth?: string;
}

export function Dialog({
  open,
  onClose,
  title,
  description,
  children,
  className = '',
  maxWidth = 'max-w-md',
}: DialogProps) {
  const titleId = useId();
  const descId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;

    previouslyFocusedRef.current = document.activeElement as HTMLElement | null;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const focusableSelector =
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

    const rafId = requestAnimationFrame(() => {
      if (!dialogRef.current) return;
      const firstFocusable = dialogRef.current.querySelector<HTMLElement>(focusableSelector);
      if (firstFocusable) {
        firstFocusable.focus();
      } else {
        dialogRef.current.focus();
      }
    });

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === 'Tab') {
        if (!dialogRef.current) return;
        const focusables = Array.from(
          dialogRef.current.querySelectorAll<HTMLElement>(focusableSelector)
        ).filter((el) => el.offsetParent !== null);

        if (focusables.length === 0) {
          e.preventDefault();
          return;
        }

        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first || document.activeElement === dialogRef.current) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
      previouslyFocusedRef.current?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      style={{
        background: 'rgba(5, 7, 10, 0.8)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descId : undefined}
        tabIndex={-1}
        className={`w-full ${maxWidth} relative flex flex-col max-h-[calc(100dvh-32px)] rounded-xl border border-[var(--cs-border)] bg-[var(--cs-surface)]/95 text-[var(--cs-text)] shadow-2xl outline-none overflow-hidden ${className}`}
        style={{
          boxShadow: '0 24px 64px -12px rgba(0, 0, 0, 0.6), 0 0 20px -2px rgba(16, 185, 129, 0.1)',
        }}
      >
        {/* Terminal Header */}
        <div className="flex items-center justify-between border-b border-[var(--cs-border)] bg-[var(--cs-elevated)]/50 px-5 py-3">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[var(--cs-primary)] opacity-80" />
            <h2 id={titleId} className="text-xs font-mono font-semibold uppercase tracking-wider text-[var(--cs-text)]">
              {title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--cs-muted)] transition-colors hover:bg-[var(--cs-surface)] hover:text-[var(--cs-text)] focus-visible:outline-2 focus-visible:outline-[var(--cs-focus)]"
          >
            <span aria-hidden="true" className="text-base font-mono leading-none">
              &times;
            </span>
          </button>
        </div>

        {description && (
          <div className="border-b border-[var(--cs-border)]/50 px-5 py-2 text-[11px] font-mono text-[var(--cs-muted)] bg-[var(--cs-surface)]">
            <p id={descId}>{description}</p>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-5">{children}</div>
      </div>
    </div>
  );
}
