import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import type { TestResult } from '../../types/typing';
import { HeroMetricCard } from './HeroMetricCard';
import { PerformanceChart } from './PerformanceChart';
import { KeyBreakdown } from './KeyBreakdown';
import { ResultActions } from './ResultActions';

interface ResultsViewProps {
  result: TestResult;
  onNextTest: () => void;
  onRestartSame: () => void;
}

export const ResultsView: React.FC<ResultsViewProps> = ({
  result,
  onNextTest,
  onRestartSame,
}) => {
  useEffect(() => {
    if (result.finalWpm >= 40 && result.accuracy >= 90) {
      try {
        confetti({
          particleCount: 60,
          spread: 50,
          origin: { y: 0.7 },
          colors: ['#8b5cf6', '#7c3aed', '#10b981', '#38bdf8'],
        });
      } catch {
        // Fallback
      }
    }
  }, [result]);

  const totalErrors = result.incorrectChars + result.extraChars;

  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-4 animate-fade-in my-auto">
      <div className="flex items-center justify-between mb-6 border-b border-[var(--border)] pb-4">
        <div>
          <h1 className="text-xl font-bold font-sans tracking-tight text-[var(--text-main)]">
            Test Performance Summary
          </h1>
          <p className="text-xs text-[var(--text-sub)] font-mono tabular-nums">
            {result.modeSummary} • Completed at {result.completedAt}
          </p>
        </div>

        <div className="px-3 py-1 rounded-[4px] bg-[var(--accent)]/15 border border-[var(--accent)]/30 text-[var(--accent)] text-xs font-semibold font-mono">
          Phase 1 Single-Player
        </div>
      </div>

      <HeroMetricCard
        finalWpm={result.finalWpm}
        rawWpm={result.rawWpm}
        accuracy={result.accuracy}
        consistency={result.consistency}
        timeElapsed={result.timeElapsed}
        totalErrors={totalErrors}
      />

      <PerformanceChart timeline={result.timeline} />

      <KeyBreakdown
        correctChars={result.correctChars}
        incorrectChars={result.incorrectChars}
        extraChars={result.extraChars}
        missedChars={result.missedChars}
        keyStats={result.keyStats}
      />

      <ResultActions
        result={result}
        onNextTest={onNextTest}
        onRestartSame={onRestartSame}
      />
    </div>
  );
};
