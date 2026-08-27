import React from 'react';
import { Target, Activity, AlertTriangle, Clock, Zap } from 'lucide-react';

interface HeroMetricCardProps {
  finalWpm: number;
  rawWpm: number;
  accuracy: number;
  consistency: number;
  timeElapsed: number;
  totalErrors: number;
}

export const HeroMetricCard: React.FC<HeroMetricCardProps> = ({
  finalWpm,
  rawWpm,
  accuracy,
  consistency,
  timeElapsed,
  totalErrors,
}) => {
  return (
    <div className="w-full flex flex-col items-center justify-center text-center my-4 select-none">
      {/* 1. Large Dominant WPM Hero */}
      <div className="flex flex-col items-center mb-6">
        <span className="text-7xl sm:text-8xl font-extrabold font-mono tracking-tight text-[var(--text-main)] tabular-nums leading-none">
          {finalWpm}
        </span>
        <span className="text-sm font-semibold font-mono text-[var(--accent)] tracking-widest uppercase mt-2">
          WPM
        </span>
      </div>

      {/* 2. Secondary Metrics: Accuracy & Consistency */}
      <div className="grid grid-cols-2 gap-6 sm:gap-12 max-w-md w-full mb-6">
        <div className="flex flex-col items-center p-3 rounded-lg bg-[var(--bg-sub)] border border-[var(--border)]">
          <div className="flex items-center gap-1.5 text-xs text-[var(--text-sub)] uppercase font-semibold mb-1">
            <Target className="w-3.5 h-3.5 text-emerald-400" />
            <span>Accuracy</span>
          </div>
          <span className="text-3xl sm:text-4xl font-extrabold font-mono text-[var(--text-main)] tabular-nums">
            {accuracy}%
          </span>
        </div>

        <div className="flex flex-col items-center p-3 rounded-lg bg-[var(--bg-sub)] border border-[var(--border)]">
          <div className="flex items-center gap-1.5 text-xs text-[var(--text-sub)] uppercase font-semibold mb-1">
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            <span>Consistency</span>
          </div>
          <span className="text-3xl sm:text-4xl font-extrabold font-mono text-[var(--text-main)] tabular-nums">
            {consistency}%
          </span>
        </div>
      </div>

      {/* 3. Supporting Statistics Bar */}
      <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 py-2 px-4 rounded-md bg-[var(--bg-sub)] border border-[var(--border)] text-xs font-mono text-[var(--text-sub)] tabular-nums">
        <div className="flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-[var(--accent)]" />
          <span>Raw: <strong className="text-[var(--text-main)]">{rawWpm} WPM</strong></span>
        </div>
        <div className="h-3 w-[1px] bg-[var(--border)]"></div>
        <div className="flex items-center gap-1.5">
          <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
          <span>Errors: <strong className="text-[var(--text-main)]">{totalErrors}</strong></span>
        </div>
        <div className="h-3 w-[1px] bg-[var(--border)]"></div>
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-amber-400" />
          <span>Duration: <strong className="text-[var(--text-main)]">{timeElapsed}s</strong></span>
        </div>
      </div>
    </div>
  );
};
