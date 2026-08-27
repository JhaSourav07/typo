import React from 'react';

export interface SegmentOption<T extends string | number> {
  id: T;
  label: string | number;
  icon?: React.ReactNode;
}

interface SegmentedControlProps<T extends string | number> {
  options: SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
  size?: 'sm' | 'md';
}

export function SegmentedControl<T extends string | number>({
  options,
  value,
  onChange,
  size = 'md',
}: SegmentedControlProps<T>) {
  return (
    <div className="inline-flex items-center p-0.5 rounded-md bg-[var(--bg-sub)] border border-[var(--border)]">
      {options.map((option) => {
        const isActive = option.id === value;
        return (
          <button
            key={String(option.id)}
            onClick={() => onChange(option.id)}
            className={`inline-flex items-center gap-1.5 rounded-[4px] font-medium transition-all duration-150 cursor-pointer select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] ${
              size === 'sm' ? 'px-2.5 py-1 text-xs' : 'px-3 py-1.5 text-xs'
            } ${
              isActive
                ? 'bg-[var(--accent)] text-white font-semibold shadow-xs'
                : 'text-[var(--text-sub)] hover:text-[var(--text-main)] hover:bg-[var(--bg-card)]/50'
            }`}
          >
            {option.icon}
            <span>{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
