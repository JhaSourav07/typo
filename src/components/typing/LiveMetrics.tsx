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
    <div className="w-full mb-8 transition-all duration-200">
      {/* Live Metrics Toolbar */}
      <div className="flex items-center justify-between font-mono text-sm px-1">
        {/* Timer / Counter */}
        <div className="flex items-baseline gap-2">
          <span className="text-3xl sm:text-4xl font-extrabold text-[var(--accent)] tracking-tight tabular-nums">
            {timeDisplay}
          </span>
          {settings.mode === 'words' && (
            <span className="text-xs text-[var(--text-sub)] tabular-nums">
              / {settings.wordOption} words
            </span>
          )}
        </div>

        {/* Live WPM & Accuracy (hidden in Blind Mode) */}
        {!settings.blindMode ? (
          <div className="flex items-center gap-8">
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-bold text-[var(--text-main)] tabular-nums">
                {isRunning ? liveWpm : 0}
              </span>
              <span className="text-[11px] font-sans text-[var(--text-sub)] uppercase font-semibold tracking-wider">
                wpm
              </span>
            </div>

            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-bold text-[var(--text-main)] tabular-nums">
                {isRunning ? `${liveAccuracy}%` : '100%'}
              </span>
              <span className="text-[11px] font-sans text-[var(--text-sub)] uppercase font-semibold tracking-wider">
                acc
              </span>
            </div>
          </div>
        ) : (
          <span className="text-xs font-sans text-[var(--text-sub)] bg-[var(--bg-sub)] px-3 py-1 rounded-[4px] border border-[var(--border)]">
            Blind Mode Active
          </span>
        )}
      </div>

      {/* Low-profile Progress Bar */}
      <div className="w-full h-[2px] mt-4 bg-[var(--border)] rounded-full overflow-hidden">
        <div
          className="h-full bg-[var(--accent)] transition-all duration-200 ease-out"
          style={{ width: `${Math.min(100, progressPercent)}%` }}
        />
      </div>
    </div>
  );
};
