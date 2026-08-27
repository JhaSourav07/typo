import React from 'react';

interface FooterProps {
  onRestart: () => void;
  status: 'idle' | 'running' | 'completed';
}

export const Footer: React.FC<FooterProps> = ({ onRestart }) => {
  return (
    <footer className="w-full py-6 px-4 border-t border-[var(--border)] bg-[var(--bg-main)] text-xs text-[var(--text-sub)] mt-auto">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Hotkey hint */}
        <div className="flex items-center gap-4 flex-wrap justify-center">
          <button
            onClick={onRestart}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[var(--bg-sub)] border border-[var(--border)] text-[var(--text-main)] hover:border-[var(--accent)] transition group cursor-pointer"
          >
            <kbd className="px-1.5 py-0.5 text-[10px] font-mono rounded bg-[var(--border)] text-[var(--text-sub)]">Tab</kbd>
            <span>+</span>
            <kbd className="px-1.5 py-0.5 text-[10px] font-mono rounded bg-[var(--border)] text-[var(--text-sub)]">Enter</kbd>
            <span className="ml-1 text-[var(--text-sub)] group-hover:text-[var(--accent)] font-medium">Restart</span>
          </button>

          <div className="flex items-center gap-1.5 text-[var(--text-sub)]">
            <kbd className="px-1.5 py-0.5 text-[10px] font-mono rounded bg-[var(--bg-sub)] border border-[var(--border)]">Esc</kbd>
            <span>Settings</span>
          </div>
        </div>

        {/* Minimal slogan */}
        <div className="flex items-center gap-3 text-center sm:text-right font-mono text-[11px]">
          <span className="text-[var(--text-sub)]">TYPE → ANALYZE → COMPETE</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-pulse"></span>
        </div>
      </div>
    </footer>
  );
};
