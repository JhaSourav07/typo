import React from 'react';
import { Clock, Type, Quote, Code, Hash, AtSign } from 'lucide-react';
import type { TestSettings, TestMode, TimeOption, WordOption, QuoteOption, CodeOption } from '../../types/typing';
import { SegmentedControl } from '../ui/SegmentedControl';
import type { SegmentOption } from '../ui/SegmentedControl';

interface ModeSelectorProps {
  settings: TestSettings;
  onUpdateSettings: (partial: Partial<TestSettings>) => void;
}

export const ModeSelector: React.FC<ModeSelectorProps> = ({ settings, onUpdateSettings }) => {
  const mainModeOptions: SegmentOption<TestMode>[] = [
    { id: 'time', label: 'Time', icon: <Clock className="w-3.5 h-3.5" /> },
    { id: 'words', label: 'Words', icon: <Type className="w-3.5 h-3.5" /> },
    { id: 'quote', label: 'Quote', icon: <Quote className="w-3.5 h-3.5" /> },
    { id: 'code', label: 'Code', icon: <Code className="w-3.5 h-3.5" /> },
  ];

  const timeSubOptions: SegmentOption<TimeOption>[] = [
    { id: 15, label: '15s' },
    { id: 30, label: '30s' },
    { id: 60, label: '60s' },
    { id: 120, label: '120s' },
  ];

  const wordSubOptions: SegmentOption<WordOption>[] = [
    { id: 10, label: 10 },
    { id: 25, label: 25 },
    { id: 50, label: 50 },
    { id: 100, label: 100 },
  ];

  const quoteSubOptions: SegmentOption<QuoteOption>[] = [
    { id: 'short', label: 'Short' },
    { id: 'medium', label: 'Medium' },
    { id: 'long', label: 'Long' },
  ];

  const codeSubOptions: SegmentOption<CodeOption>[] = [
    { id: 'javascript', label: 'JS/TS' },
    { id: 'python', label: 'Python' },
    { id: 'html', label: 'HTML/CSS' },
    { id: 'sql', label: 'SQL' },
  ];

  return (
    <div className="flex flex-wrap items-center justify-center gap-2.5">
      <SegmentedControl
        options={mainModeOptions}
        value={settings.mode}
        onChange={(mode) => onUpdateSettings({ mode })}
      />

      <div className="h-4 w-[1px] bg-[var(--border)] hidden sm:block"></div>

      {settings.mode === 'time' && (
        <SegmentedControl
          options={timeSubOptions}
          value={settings.timeOption}
          onChange={(timeOption) => onUpdateSettings({ timeOption })}
          size="sm"
        />
      )}

      {settings.mode === 'words' && (
        <SegmentedControl
          options={wordSubOptions}
          value={settings.wordOption}
          onChange={(wordOption) => onUpdateSettings({ wordOption })}
          size="sm"
        />
      )}

      {settings.mode === 'quote' && (
        <SegmentedControl
          options={quoteSubOptions}
          value={settings.quoteOption}
          onChange={(quoteOption) => onUpdateSettings({ quoteOption })}
          size="sm"
        />
      )}

      {settings.mode === 'code' && (
        <SegmentedControl
          options={codeSubOptions}
          value={settings.codeOption}
          onChange={(codeOption) => onUpdateSettings({ codeOption })}
          size="sm"
        />
      )}

      {(settings.mode === 'time' || settings.mode === 'words') && (
        <>
          <div className="h-4 w-[1px] bg-[var(--border)] hidden sm:block"></div>
          <div className="inline-flex items-center gap-1 p-0.5 rounded-md bg-[var(--bg-sub)] border border-[var(--border)]">
            <button
              onClick={() => onUpdateSettings({ punctuation: !settings.punctuation })}
              className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs rounded-[4px] font-medium transition-all duration-150 cursor-pointer ${
                settings.punctuation
                  ? 'bg-[var(--accent)]/15 text-[var(--accent)] font-semibold border border-[var(--accent)]/30'
                  : 'text-[var(--text-sub)] hover:text-[var(--text-main)]'
              }`}
            >
              <AtSign className="w-3 h-3" />
              <span>punc</span>
            </button>

            <button
              onClick={() => onUpdateSettings({ numbers: !settings.numbers })}
              className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs rounded-[4px] font-medium transition-all duration-150 cursor-pointer ${
                settings.numbers
                  ? 'bg-[var(--accent)]/15 text-[var(--accent)] font-semibold border border-[var(--accent)]/30'
                  : 'text-[var(--text-sub)] hover:text-[var(--text-main)]'
              }`}
            >
              <Hash className="w-3 h-3" />
              <span>nums</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
};
