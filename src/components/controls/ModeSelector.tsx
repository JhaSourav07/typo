import React from 'react';
import { Clock, Type, Quote, Code, Hash, AtSign } from 'lucide-react';
import type { TestSettings, TestMode, TimeOption, WordOption, QuoteOption, CodeOption } from '../../types/typing';

interface ModeSelectorProps {
  settings: TestSettings;
  onUpdateSettings: (partial: Partial<TestSettings>) => void;
}

export const ModeSelector: React.FC<ModeSelectorProps> = ({ settings, onUpdateSettings }) => {
  const modes: { id: TestMode; label: string; icon: React.ReactNode }[] = [
    { id: 'time', label: 'Time', icon: <Clock className="w-3.5 h-3.5" /> },
    { id: 'words', label: 'Words', icon: <Type className="w-3.5 h-3.5" /> },
    { id: 'quote', label: 'Quote', icon: <Quote className="w-3.5 h-3.5" /> },
    { id: 'code', label: 'Code', icon: <Code className="w-3.5 h-3.5" /> },
  ];

  const timeOptions: TimeOption[] = [15, 30, 60, 120];
  const wordOptions: WordOption[] = [10, 25, 50, 100];
  const quoteOptions: { id: QuoteOption; label: string }[] = [
    { id: 'short', label: 'Short' },
    { id: 'medium', label: 'Medium' },
    { id: 'long', label: 'Long' },
  ];
  const codeOptions: { id: CodeOption; label: string }[] = [
    { id: 'javascript', label: 'JS / TS' },
    { id: 'python', label: 'Python' },
    { id: 'html', label: 'HTML/CSS' },
    { id: 'sql', label: 'SQL' },
  ];

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 p-1.5 rounded-2xl bg-[var(--bg-sub)] border border-[var(--border)] shadow-sm">
      {/* Mode Pills */}
      <div className="flex items-center gap-1 bg-[var(--bg-main)]/60 p-1 rounded-xl border border-[var(--border)]/50">
        {modes.map((mode) => (
          <button
            key={mode.id}
            onClick={() => onUpdateSettings({ mode: mode.id })}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              settings.mode === mode.id
                ? 'bg-[var(--accent)] text-slate-950 shadow-sm font-semibold'
                : 'text-[var(--text-sub)] hover:text-[var(--text-main)] hover:bg-[var(--bg-card)]'
            }`}
          >
            {mode.icon}
            <span>{mode.label}</span>
          </button>
        ))}
      </div>

      <div className="h-4 w-[1px] bg-[var(--border)] hidden sm:block"></div>

      {/* Sub-options depending on selected mode */}
      <div className="flex items-center gap-1 bg-[var(--bg-main)]/60 p-1 rounded-xl border border-[var(--border)]/50">
        {settings.mode === 'time' &&
          timeOptions.map((opt) => (
            <button
              key={opt}
              onClick={() => onUpdateSettings({ timeOption: opt })}
              className={`px-2.5 py-1 text-xs font-mono rounded-md transition-all ${
                settings.timeOption === opt
                  ? 'text-[var(--accent)] font-bold bg-[var(--accent)]/15 border border-[var(--accent)]/30'
                  : 'text-[var(--text-sub)] hover:text-[var(--text-main)]'
              }`}
            >
              {opt}s
            </button>
          ))}

        {settings.mode === 'words' &&
          wordOptions.map((opt) => (
            <button
              key={opt}
              onClick={() => onUpdateSettings({ wordOption: opt })}
              className={`px-2.5 py-1 text-xs font-mono rounded-md transition-all ${
                settings.wordOption === opt
                  ? 'text-[var(--accent)] font-bold bg-[var(--accent)]/15 border border-[var(--accent)]/30'
                  : 'text-[var(--text-sub)] hover:text-[var(--text-main)]'
              }`}
            >
              {opt}
            </button>
          ))}

        {settings.mode === 'quote' &&
          quoteOptions.map((opt) => (
            <button
              key={opt.id}
              onClick={() => onUpdateSettings({ quoteOption: opt.id })}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                settings.quoteOption === opt.id
                  ? 'text-[var(--accent)] font-bold bg-[var(--accent)]/15 border border-[var(--accent)]/30'
                  : 'text-[var(--text-sub)] hover:text-[var(--text-main)]'
              }`}
            >
              {opt.label}
            </button>
          ))}

        {settings.mode === 'code' &&
          codeOptions.map((opt) => (
            <button
              key={opt.id}
              onClick={() => onUpdateSettings({ codeOption: opt.id })}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                settings.codeOption === opt.id
                  ? 'text-[var(--accent)] font-bold bg-[var(--accent)]/15 border border-[var(--accent)]/30'
                  : 'text-[var(--text-sub)] hover:text-[var(--text-main)]'
              }`}
            >
              {opt.label}
            </button>
          ))}
      </div>

      {(settings.mode === 'time' || settings.mode === 'words') && (
        <>
          <div className="h-4 w-[1px] bg-[var(--border)] hidden sm:block"></div>
          <div className="flex items-center gap-1 bg-[var(--bg-main)]/60 p-1 rounded-xl border border-[var(--border)]/50">
            <button
              onClick={() => onUpdateSettings({ punctuation: !settings.punctuation })}
              className={`flex items-center gap-1 px-2.5 py-1 text-xs rounded-md transition-all ${
                settings.punctuation
                  ? 'text-[var(--accent)] font-bold bg-[var(--accent)]/15 border border-[var(--accent)]/30'
                  : 'text-[var(--text-sub)] hover:text-[var(--text-main)]'
              }`}
              title="Toggle Punctuation"
            >
              <AtSign className="w-3 h-3" />
              <span>punc</span>
            </button>

            <button
              onClick={() => onUpdateSettings({ numbers: !settings.numbers })}
              className={`flex items-center gap-1 px-2.5 py-1 text-xs rounded-md transition-all ${
                settings.numbers
                  ? 'text-[var(--accent)] font-bold bg-[var(--accent)]/15 border border-[var(--accent)]/30'
                  : 'text-[var(--text-sub)] hover:text-[var(--text-main)]'
              }`}
              title="Toggle Numbers"
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
