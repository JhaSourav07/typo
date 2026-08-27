import React from 'react';
import type { TestSettings, EngineStatus } from '../../types/typing';
import { formatTime } from '../../utils/wpmCalculator';

interface LiveMetricsProps {
  settings: TestSettings;
  status: EngineStatus;
  timeLeft: number;
  timeElapsed: number;
  liveWpm: number;
  liveAccuracy: number;
  currentWordIndex: number;
  totalWords: number;
}

export const LiveMetrics: React.FC<LiveMetricsProps> = ({
  settings,
  status,
  timeLeft,
  timeElapsed,
  liveWpm,
  liveAccuracy,
  currentWordIndex,
  totalWords,
}) => {
  const isRunning = status === 'running';

  let timeDisplay = '';
  let progressPercent = 0;

  if (settings.mode === 'time') {
    timeDisplay = `${timeLeft}`;
    progressPercent = ((settings.timeOption - timeLeft) / settings.timeOption) * 100;
  } else {
    timeDisplay = formatTime(timeElapsed);
    progressPercent = (currentWordIndex / Math.max(1, totalWords)) * 100;
  }

  return (
    <div className="w-full mb-6 transition-all duration-300">
      <div className="flex items-center justify-between font-mono text-sm px-2">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-extrabold text-[var(--accent)] tracking-tight">
            {timeDisplay}
          </span>
          {settings.mode === 'words' && (
            <span className="text-xs text-[var(--text-sub)]">
              / {settings.wordOption} words
            </span>
          )}
        </div>

        {!settings.blindMode ? (
          <div className="flex items-center gap-6">
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold text-[var(--text-main)]">
                {isRunning ? liveWpm : 0}
              </span>
              <span className="text-xs font-sans text-[var(--text-sub)] uppercase font-semibold tracking-wider">
                wpm
              </span>
            </div>

            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold text-[var(--text-main)]">
                {isRunning ? `${liveAccuracy}%` : '100%'}
              </span>
              <span className="text-xs font-sans text-[var(--text-sub)] uppercase font-semibold tracking-wider">
                acc
              </span>
            </div>
          </div>
        ) : (
          <span className="text-xs font-sans italic text-[var(--text-sub)] bg-[var(--bg-sub)] px-3 py-1 rounded-full border border-[var(--border)]">
            Blind Mode Active
          </span>
        )}
      </div>

      <div className="w-full h-1 mt-3 bg-[var(--bg-sub)] rounded-full overflow-hidden border border-[var(--border)]/40">
        <div
          className="h-full bg-gradient-to-r from-[var(--accent)] to-amber-300 transition-all duration-300 ease-out"
          style={{ width: `${Math.min(100, progressPercent)}%` }}
        />
      </div>
    </div>
  );
};
