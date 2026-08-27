import React from 'react';

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  sublabel?: string;
}

export const Toggle: React.FC<ToggleProps> = ({ checked, onChange, label, sublabel }) => {
  return (
    <label className="inline-flex items-center justify-between cursor-pointer w-full group py-1.5">
      {(label || sublabel) && (
        <div className="flex flex-col">
          {label && <span className="text-sm font-medium text-[var(--text-main)] group-hover:text-[var(--accent)] transition-colors">{label}</span>}
          {sublabel && <span className="text-xs text-[var(--text-sub)]">{sublabel}</span>}
        </div>
      )}
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
          checked ? 'bg-[var(--accent)]' : 'bg-[var(--border)]'
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-slate-950 shadow-lg ring-0 transition duration-200 ease-in-out ${
            checked ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </label>
  );
};
