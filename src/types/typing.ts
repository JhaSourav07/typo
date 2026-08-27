export type TestMode = 'time' | 'words' | 'quote' | 'code';
export type TimeOption = 15 | 30 | 60 | 120;
export type WordOption = 10 | 25 | 50 | 100;
export type QuoteOption = 'short' | 'medium' | 'long';
export type CodeOption = 'javascript' | 'python' | 'html' | 'sql';

export type FontFamily = 'jetbrains' | 'firacode' | 'robotomono' | 'inter';
export type ThemeId = 'obsidian' | 'cyber' | 'nord' | 'monokai' | 'pure-minimal';
export type CaretStyle = 'line' | 'block' | 'underline' | 'pulse';
export type SoundProfile = 'thock' | 'clicky' | 'soft' | 'typewriter' | 'off';

export interface TestSettings {
  mode: TestMode;
  timeOption: TimeOption;
  wordOption: WordOption;
  quoteOption: QuoteOption;
  codeOption: CodeOption;
  numbers: boolean;
  punctuation: boolean;
  strictMode: boolean;
  blindMode: boolean;
  fontFamily: FontFamily;
  theme: ThemeId;
  caretStyle: CaretStyle;
  soundProfile: SoundProfile;
  soundVolume: number;
}

export type CharState = 'untyped' | 'correct' | 'incorrect' | 'extra';

export interface CharData {
  char: string;
  state: CharState;
  typedChar?: string;
}

export interface WordData {
  id: string;
  originalWord: string;
  chars: CharData[];
}

export interface TimelineDataPoint {
  second: number;
  wpm: number;
  rawWpm: number;
  errors: number;
}

export interface KeyAccuracyStats {
  [key: string]: {
    total: number;
    errors: number;
  };
}

export interface TestResult {
  finalWpm: number;
  rawWpm: number;
  accuracy: number;
  consistency: number;
  timeElapsed: number; // in seconds
  totalChars: number;
  correctChars: number;
  incorrectChars: number;
  extraChars: number;
  missedChars: number;
  timeline: TimelineDataPoint[];
  keyStats: KeyAccuracyStats;
  modeSummary: string;
  completedAt: string;
}

export type EngineStatus = 'idle' | 'running' | 'completed';
