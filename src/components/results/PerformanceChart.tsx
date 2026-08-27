import React from 'react';
import type { TimelineDataPoint } from '../../types/typing';

interface PerformanceChartProps {
  timeline: TimelineDataPoint[];
}

export const PerformanceChart: React.FC<PerformanceChartProps> = ({ timeline }) => {
  if (!timeline || timeline.length === 0) {
    return (
      <div className="w-full h-48 flex items-center justify-center text-xs text-[var(--text-sub)] bg-[var(--bg-sub)] rounded-lg border border-[var(--border)]">
        Insufficient timeline data to map graph
      </div>
    );
  }

  const width = 600;
  const height = 180;
  const padding = 30;

  const maxSecond = Math.max(...timeline.map((d) => d.second), 1);
  const maxWpm = Math.max(...timeline.map((d) => Math.max(d.wpm, d.rawWpm)), 40);

  const getX = (second: number) => padding + (second / maxSecond) * (width - 2 * padding);
  const getY = (wpm: number) => height - padding - (wpm / maxWpm) * (height - 2 * padding);

  const netPath = timeline.reduce((acc, pt, idx) => {
    const x = getX(pt.second);
    const y = getY(pt.wpm);
    return `${acc} ${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
  }, '');

  const rawPath = timeline.reduce((acc, pt, idx) => {
    const x = getX(pt.second);
    const y = getY(pt.rawWpm);
    return `${acc} ${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
  }, '');

  return (
    <div className="w-full bg-[var(--bg-sub)] rounded-lg border border-[var(--border)] p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3 text-xs">
        <span className="font-semibold text-[var(--text-main)] font-sans">Speed Timeline (WPM)</span>
        <div className="flex items-center gap-4 text-[11px]">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-[var(--accent)] rounded-full"></span>
            <span className="text-[var(--text-sub)]">Net WPM</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-slate-500 border-b border-dashed"></span>
            <span className="text-[var(--text-sub)]">Raw WPM</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-400"></span>
            <span className="text-[var(--text-sub)]">Errors</span>
          </div>
        </div>
      </div>

      <div className="w-full overflow-x-auto">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-44 overflow-visible">
          {[0, 0.33, 0.66, 1].map((ratio, i) => {
            const y = height - padding - ratio * (height - 2 * padding);
            const val = Math.round(ratio * maxWpm);
            return (
              <g key={i}>
                <line
                  x1={padding}
                  y1={y}
                  x2={width - padding}
                  y2={y}
                  stroke="var(--border)"
                  strokeDasharray="3 3"
                  strokeOpacity={0.6}
                />
                <text
                  x={padding - 6}
                  y={y + 4}
                  fill="var(--text-sub)"
                  fontSize="10"
                  textAnchor="end"
                  fontFamily="monospace"
                  className="tabular-nums"
                >
                  {val}
                </text>
              </g>
            );
          })}

          <path
            d={rawPath}
            fill="none"
            stroke="#64748b"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            opacity={0.6}
          />

          <path
            d={netPath}
            fill="none"
            stroke="var(--accent)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {timeline.map((pt, idx) => {
            const x = getX(pt.second);
            const y = getY(pt.wpm);
            return (
              <g key={idx}>
                <circle cx={x} cy={y} r="3" fill="var(--accent)" />
                {pt.errors > 0 && (
                  <circle cx={x} cy={y - 8} r="3.5" fill="#f43f5e">
                    <title>{`${pt.errors} errors at ${pt.second}s`}</title>
                  </circle>
                )}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};
