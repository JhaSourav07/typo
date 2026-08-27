import React from 'react';
import type { KeyAccuracyStats } from '../../types/typing';

interface KeyBreakdownProps {
  correctChars: number;
  incorrectChars: number;
  extraChars: number;
  missedChars: number;
  keyStats: KeyAccuracyStats;
}

export const KeyBreakdown: React.FC<KeyBreakdownProps> = ({
  correctChars,
  incorrectChars,
  extraChars,
  missedChars,
  keyStats,
}) => {
  const problemKeys = Object.entries(keyStats)
    .filter(([, stat]) => stat.errors > 0)
    .sort((a, b) => b[1].errors - a[1].errors)
    .slice(0, 6);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full my-4">
      <div className="bg-[var(--bg-sub)] rounded-lg border border-[var(--border)] p-4">
        <span className="text-xs font-semibold text-[var(--text-main)] font-sans block mb-3">
          Keystroke Statistics
        </span>
        <div className="grid grid-cols-2 gap-2 text-xs font-mono tabular-nums">
          <div className="p-2.5 rounded-md bg-[var(--bg-card)] border border-[var(--border)] flex justify-between">
            <span className="text-[var(--text-sub)]">Correct:</span>
            <span className="text-emerald-400 font-bold">{correctChars}</span>
          </div>
          <div className="p-2.5 rounded-md bg-[var(--bg-card)] border border-[var(--border)] flex justify-between">
            <span className="text-[var(--text-sub)]">Incorrect:</span>
            <span className="text-red-400 font-bold">{incorrectChars}</span>
          </div>
          <div className="p-2.5 rounded-md bg-[var(--bg-card)] border border-[var(--border)] flex justify-between">
            <span className="text-[var(--text-sub)]">Extra:</span>
            <span className="text-amber-400 font-bold">{extraChars}</span>
          </div>
          <div className="p-2.5 rounded-md bg-[var(--bg-card)] border border-[var(--border)] flex justify-between">
            <span className="text-[var(--text-sub)]">Missed:</span>
            <span className="text-slate-400 font-bold">{missedChars}</span>
          </div>
        </div>
      </div>

      <div className="bg-[var(--bg-sub)] rounded-lg border border-[var(--border)] p-4">
        <span className="text-xs font-semibold text-[var(--text-main)] font-sans block mb-3">
          Problem Key Heatmap
        </span>
        {problemKeys.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {problemKeys.map(([char, stat]) => {
              const acc = Math.round(((stat.total - stat.errors) / stat.total) * 100);
              return (
                <div
                  key={char}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-[var(--bg-card)] border border-red-500/25 text-xs font-mono tabular-nums"
                >
                  <span className="px-1.5 py-0.5 rounded-[3px] bg-red-500/20 text-red-400 font-bold">
                    {char === ' ' ? 'Space' : char}
                  </span>
                  <span className="text-[var(--text-sub)]">{stat.errors} err ({acc}%)</span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-xs text-[var(--text-sub)] italic py-3 font-sans">
            Flawless execution! Zero problem keys detected.
          </div>
        )}
      </div>
    </div>
  );
};
