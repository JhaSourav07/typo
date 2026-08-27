import React, { memo } from 'react';
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

export const LiveMetrics: React.FC<LiveMetricsProps> = memo(({
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
    timeDisplay = formatTime(timeLeft);
    progressPercent = ((settings.timeOption - timeLeft) / settings.timeOption) * 100;
  } else {
    timeDisplay = formatTime(timeElapsed);
    progressPercent = (currentWordIndex / Math.max(1, totalWords)) * 100;
  }

  return (
    <div className="w-full mt-6 transition-all duration-200">
      {!settings.blindMode ? (
        <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 font-mono text-sm sm:text-base tabular-nums select-none py-2">
          {/* Live WPM */}
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-[var(--text-main)]">
              {isRunning ? liveWpm : 0}
            </span>
            <span className="text-xs font-sans text-[var(--text-sub)] uppercase font-semibold tracking-wider">
              WPM
            </span>
          </div>

          {/* Live Accuracy */}
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-[var(--text-main)]">
              {isRunning ? `${liveAccuracy}%` : '100%'}
            </span>
            <span className="text-xs font-sans text-[var(--text-sub)] uppercase font-semibold tracking-wider">
              ACC
            </span>
          </div>

          {/* Time Remaining / Counter */}
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-[var(--accent)]">
              {timeDisplay}
            </span>
            {settings.mode === 'words' && (
              <span className="text-xs font-sans text-[var(--text-sub)] uppercase font-semibold tracking-wider">
                ({currentWordIndex}/{settings.wordOption})
              </span>
            )}
          </div>
        </div>
      ) : (
        <div className="flex justify-center py-2">
          <span className="text-xs font-sans text-[var(--text-sub)] bg-[var(--bg-sub)] px-3 py-1 rounded-[4px] border border-[var(--border)]">
            Blind Mode Active
          </span>
        </div>
      )}

      {/* Subtle Progress Bar */}
      <div className="w-full h-[2px] mt-2 bg-[var(--border)] rounded-full overflow-hidden opacity-60">
        <div
          className="h-full bg-[var(--accent)] transition-all duration-200 ease-out"
          style={{ width: `${Math.min(100, progressPercent)}%` }}
        />
      </div>
    </div>
  );
});
