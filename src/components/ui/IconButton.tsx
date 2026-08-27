import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  label?: string;
  active?: boolean;
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  label,
  active = false,
  className,
  ...props
}) => {
  return (
    <button
      title={label}
      aria-label={label}
      className={twMerge(
        clsx(
          'p-2 rounded-md transition-all duration-150 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-main)]',
          active
            ? 'bg-[var(--accent)]/15 text-[var(--accent)] border border-[var(--accent)]/30'
            : 'text-[var(--text-sub)] hover:text-[var(--text-main)] hover:bg-[var(--bg-sub)] border border-transparent hover:border-[var(--border)]',
          className
        )
      )}
      {...props}
    >
      {icon}
    </button>
  );
};
