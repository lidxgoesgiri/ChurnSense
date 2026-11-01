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

  // Focus trap, Escape key handling, and background scroll lock
  useEffect(() => {
    if (!open) return;

    previouslyFocusedRef.current = document.activeElement as HTMLElement | null;

    // Scroll lock on body
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Focus inside dialog
    const focusableSelector =
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

    // Small delay or RAF to ensure DOM is rendered before focusing
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
      // Restore focus to previous trigger
      previouslyFocusedRef.current?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      style={{
        background: 'rgba(10, 15, 12, 0.72)',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
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
        className={`w-full ${maxWidth} relative flex flex-col max-h-[calc(100dvh-32px)] rounded-2xl border border-[var(--cs-border,rgba(0,0,0,0.1))] bg-[var(--cs-surface,#ffffff)] text-[var(--cs-text,#17251e)] shadow-2xl outline-none overflow-hidden ${className}`}
        style={{
          boxShadow: '0 20px 48px -12px rgba(0, 0, 0, 0.35)',
        }}
      >
        <div className="flex items-start justify-between border-b border-[var(--cs-border,rgba(0,0,0,0.08))] px-6 py-4">
          <div>
            <h2 id={titleId} className="text-base font-semibold text-[var(--cs-text,#17251e)]">
              {title}
            </h2>
            {description && (
              <p id={descId} className="mt-1 text-xs text-[var(--cs-muted,#526259)]">
                {description}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="flex h-11 w-11 -mr-2 -mt-1 items-center justify-center rounded-lg text-[var(--cs-muted,#526259)] transition-colors hover:bg-[var(--cs-bg,rgba(0,0,0,0.05))] hover:text-[var(--cs-text,#17251e)] focus-visible:outline-2 focus-visible:outline-[var(--cs-focus,#225c43)]"
          >
            <span aria-hidden="true" className="text-xl leading-none">
              ×
            </span>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>
      </div>
    </div>
  );
}
