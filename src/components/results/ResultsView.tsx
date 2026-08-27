import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import type { TestResult } from '../../types/typing';
import { HeroMetricCard } from './HeroMetricCard';
import { PerformanceChart } from './PerformanceChart';
import { KeyBreakdown } from './KeyBreakdown';
import { ResultActions } from './ResultActions';

interface ResultsViewProps {
  result: TestResult;
  onRestartTest: () => void;
  onChangeTest: () => void;
}

export const ResultsView: React.FC<ResultsViewProps> = ({
  result,
  onRestartTest,
  onChangeTest,
}) => {
  useEffect(() => {
    // Subtle, restrained celebration burst
    if (result.finalWpm >= 50 && result.accuracy >= 92) {
      try {
        confetti({
          particleCount: 35,
          spread: 40,
          origin: { y: 0.75 },
          colors: ['#8b5cf6', '#7c3aed', '#10b981'],
          disableForReducedMotion: true,
        });
      } catch {
        // Fallback
      }
    }
  }, [result]);

  const totalErrors = result.incorrectChars + result.extraChars;

  return (
    <div className="w-full max-w-4xl mx-auto py-6 px-4 animate-fade-in my-auto">
      {/* Session Summary Header */}
      <div className="flex items-center justify-between mb-4 border-b border-[var(--border)] pb-3">
        <div>
          <h1 className="text-lg font-bold font-sans tracking-tight text-[var(--text-main)]">
            Performance Summary
          </h1>
          <p className="text-xs text-[var(--text-sub)] font-mono tabular-nums mt-0.5">
            {result.modeSummary} • {result.totalChars} chars typed • {result.completedAt}
          </p>
        </div>

        <div className="px-2.5 py-1 rounded-[4px] bg-[var(--accent)]/15 border border-[var(--accent)]/30 text-[var(--accent)] text-xs font-semibold font-mono">
          Phase 1 Single-Player
        </div>
      </div>

      {/* Hero Metric Cards (Large WPM, Accuracy, Consistency, Supporting Stats) */}
      <HeroMetricCard
        finalWpm={result.finalWpm}
        rawWpm={result.rawWpm}
        accuracy={result.accuracy}
        consistency={result.consistency}
        timeElapsed={result.timeElapsed}
        totalErrors={totalErrors}
      />

      {/* Speed Timeline Chart */}
      <PerformanceChart timeline={result.timeline} />

      {/* Keystrokes & Problem Key Heatmap */}
      <KeyBreakdown
        correctChars={result.correctChars}
        incorrectChars={result.incorrectChars}
        extraChars={result.extraChars}
        missedChars={result.missedChars}
        keyStats={result.keyStats}
      />

      {/* Primary Actions */}
      <ResultActions
        result={result}
        onRestartTest={onRestartTest}
        onChangeTest={onChangeTest}
      />
    </div>
  );
};
