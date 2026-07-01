'use client';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}: ButtonProps) {
  const base = 'inline-flex items-center justify-center font-semibold transition-colors disabled:opacity-50 rounded-lg';
  const variants: Record<string, string> = {
    primary: 'bg-foreground text-background hover:opacity-90',
    secondary: 'border border-black/15 dark:border-white/20 hover:bg-black/5 dark:hover:bg-white/10',
    ghost: 'hover:bg-black/5 dark:hover:bg-white/10',
  };
  const sizes: Record<string, string> = {
    sm: 'px-2.5 py-1 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-2.5 text-base',
  };
  return (
    <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </button>
  );
}
