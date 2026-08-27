import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  glow?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className, glow = false, ...props }) => {
  return (
    <div
      className={twMerge(
        clsx(
          'rounded-xl border border-[var(--border)] bg-[var(--bg-sub)] p-5 transition-all duration-300',
          glow && 'glow-accent border-[var(--accent)]',
          className
        )
      )}
      {...props}
    >
      {children}
    </div>
  );
};
