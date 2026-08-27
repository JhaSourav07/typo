import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'secondary',
  size = 'md',
  className,
  children,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer active:scale-95';

  const variants = {
    primary: 'bg-amber-500 text-slate-950 hover:bg-amber-400 font-semibold shadow-md shadow-amber-500/20',
    accent: 'bg-[var(--accent)] text-slate-950 font-semibold hover:brightness-110 shadow-lg shadow-[var(--accent-glow)]',
    secondary: 'bg-[var(--bg-card)] text-[var(--text-main)] hover:bg-[var(--border)] border border-[var(--border)]',
    ghost: 'text-[var(--text-sub)] hover:text-[var(--text-main)] hover:bg-[var(--bg-sub)]',
    danger: 'bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20',
  };

  const sizes = {
    sm: 'px-2.5 py-1 text-xs gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-5 py-2.5 text-base gap-2.5',
  };

  return (
    <button
      className={twMerge(clsx(baseStyles, variants[variant], sizes[size], className))}
      {...props}
    >
      {children}
    </button>
  );
};
