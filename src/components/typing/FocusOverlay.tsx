import React from 'react';
import { MousePointerClick } from 'lucide-react';

interface FocusOverlayProps {
  isFocused: boolean;
  onFocus: () => void;
}

export const FocusOverlay: React.FC<FocusOverlayProps> = ({ isFocused, onFocus }) => {
  if (isFocused) return null;

  return (
    <div
      onClick={onFocus}
      className="absolute inset-0 z-20 flex flex-col items-center justify-center rounded-2xl bg-[var(--bg-main)]/70 backdrop-blur-md cursor-pointer transition-all duration-300 group border border-[var(--accent)]/30"
    >
      <div className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border)] shadow-xl group-hover:border-[var(--accent)] transition-all transform group-hover:scale-105">
        <MousePointerClick className="w-5 h-5 text-[var(--accent)] animate-bounce" />
        <span className="text-sm font-semibold text-[var(--text-main)] font-sans">
          Click or press any key to focus
        </span>
      </div>
    </div>
  );
};
