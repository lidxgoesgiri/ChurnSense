'use client';

import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
}

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2';

  const variants: Record<string, string> = {
    primary:
      'btn-primary focus-visible:outline-[var(--cs-focus)]',
    secondary:
      'btn-secondary focus-visible:outline-[var(--cs-focus)]',
    ghost:
      'text-[var(--cs-text)] hover:bg-[var(--cs-elevated)] hover:text-white focus-visible:outline-[var(--cs-focus)]',
    destructive:
      'bg-[var(--cs-danger)] text-white hover:brightness-110 active:scale-[0.99] focus-visible:outline-[var(--cs-danger)] shadow-sm',
  };

  const sizes: Record<string, string> = {
    sm: 'min-h-[36px] px-3 py-1.5 text-xs gap-1.5',
    md: 'min-h-[44px] px-4 py-2 text-sm gap-2',
    lg: 'min-h-[48px] px-6 py-2.5 text-base gap-2.5',
  };

  return (
    <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </button>
  );
}
