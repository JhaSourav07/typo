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
          'rounded-lg border border-[var(--border)] bg-[var(--bg-sub)] p-5 transition-all duration-150',
          glow && 'border-[var(--accent)] shadow-sm shadow-[var(--accent-glow)]',
          className
        )
      )}
      {...props}
    >
      {children}
    </div>
  );
};
