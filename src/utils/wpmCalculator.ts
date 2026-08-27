import type { TimelineDataPoint } from '../types/typing';

export function calculateRawWpm(totalKeystrokes: number, timeInSeconds: number): number {
  if (timeInSeconds <= 0) return 0;
  const minutes = timeInSeconds / 60;
  return Math.round((totalKeystrokes / 5) / minutes);
}

export function calculateNetWpm(correctChars: number, timeInSeconds: number): number {
  if (timeInSeconds <= 0) return 0;
  const minutes = timeInSeconds / 60;
  const wpm = Math.round((correctChars / 5) / minutes);
  return Math.max(0, wpm);
}

export function calculateAccuracy(correctKeystrokes: number, totalKeystrokes: number): number {
  if (totalKeystrokes <= 0) return 100;
  const accuracy = (correctKeystrokes / totalKeystrokes) * 100;
  return Math.max(0, Math.min(100, Math.round(accuracy * 10) / 10));
}

export function calculateConsistency(timeline: TimelineDataPoint[]): number {
  if (timeline.length < 3) return 100;
  const wpms = timeline.map(point => point.wpm).filter(w => w > 0);
  if (wpms.length < 2) return 100;

  const mean = wpms.reduce((acc, val) => acc + val, 0) / wpms.length;
  if (mean === 0) return 100;

  const variance = wpms.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / wpms.length;
  const stdDev = Math.sqrt(variance);
  const cv = (stdDev / mean) * 100;

  const consistency = Math.max(0, Math.min(100, 100 - cv));
  return Math.round(consistency);
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins > 0) {
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }
  return `${secs}s`;
}
