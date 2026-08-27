import React from 'react';
import { Card } from '../ui/Card';
import { Zap, Target, Activity, AlertTriangle } from 'lucide-react';

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
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full mb-6">
      {/* Primary Hero WPM Card */}
      <Card glow className="col-span-2 md:col-span-2 bg-gradient-to-br from-[var(--bg-sub)] to-[var(--bg-card)] flex flex-col justify-between p-6 relative overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--accent)] flex items-center gap-1.5 font-sans">
            <Zap className="w-4 h-4" />
            Net WPM
          </span>
          <span className="text-xs text-[var(--text-sub)] font-mono">Precision Speed</span>
        </div>
        <div className="flex items-baseline gap-3 my-2">
          <span className="text-6xl sm:text-7xl font-extrabold font-mono tracking-tight text-[var(--text-main)]">
            {finalWpm}
          </span>
          <span className="text-base font-semibold text-[var(--accent)]">WPM</span>
        </div>
        <div className="text-xs text-[var(--text-sub)] font-mono flex items-center justify-between border-t border-[var(--border)]/60 pt-3 mt-2">
          <span>Raw Speed: <strong className="text-[var(--text-main)]">{rawWpm} WPM</strong></span>
          <span>Time: <strong className="text-[var(--text-main)]">{timeElapsed}s</strong></span>
        </div>
      </Card>

      {/* Accuracy Card */}
      <Card className="flex flex-col justify-between p-5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-sub)] flex items-center gap-1.5">
            <Target className="w-3.5 h-3.5 text-emerald-400" />
            Accuracy
          </span>
        </div>
        <div className="my-2">
          <span className="text-4xl font-extrabold font-mono text-[var(--text-main)]">
            {accuracy}%
          </span>
        </div>
        <div className="text-xs text-[var(--text-sub)] font-mono border-t border-[var(--border)]/60 pt-2 flex items-center gap-1">
          <AlertTriangle className="w-3 h-3 text-red-400" />
          <span>{totalErrors} errors total</span>
        </div>
      </Card>

      {/* Consistency Card */}
      <Card className="flex flex-col justify-between p-5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-sub)] flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            Consistency
          </span>
        </div>
        <div className="my-2">
          <span className="text-4xl font-extrabold font-mono text-[var(--text-main)]">
            {consistency}%
          </span>
        </div>
        <div className="text-xs text-[var(--text-sub)] font-mono border-t border-[var(--border)]/60 pt-2">
          Speed Stability
        </div>
      </Card>
    </div>
  );
};
