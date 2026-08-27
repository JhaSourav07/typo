import React from 'react';
import { Modal } from '../ui/Modal';
import { Toggle } from '../ui/Toggle';
import type {
  TestSettings,
  ThemeId,
  FontFamily,
  CaretStyle,
  SoundProfile,
} from '../../types/typing';
import { Palette, Type, MousePointer, Volume2, ShieldAlert } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: TestSettings;
  onUpdateSettings: (partial: Partial<TestSettings>) => void;
  onResetSettings: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onResetSettings,
}) => {
  const themes: { id: ThemeId; name: string; color: string }[] = [
    { id: 'obsidian', name: 'Obsidian Amber', color: '#f59e0b' },
    { id: 'cyber', name: 'Cyber Neon', color: '#06b6d4' },
    { id: 'nord', name: 'Nord Slate', color: '#88c0d0' },
    { id: 'monokai', name: 'Monokai Dark', color: '#ffd866' },
    { id: 'pure-minimal', name: 'Pure Minimal', color: '#10b981' },
  ];

  const fonts: { id: FontFamily; name: string; sample: string }[] = [
    { id: 'jetbrains', name: 'JetBrains Mono', sample: 'the quick brown fox' },
    { id: 'firacode', name: 'Fira Code', sample: 'const fn = () => {};' },
    { id: 'robotomono', name: 'Roboto Mono', sample: '1234567890' },
    { id: 'inter', name: 'Inter (Sans)', sample: 'Clean modern layout' },
  ];

  const carets: { id: CaretStyle; name: string }[] = [
    { id: 'line', name: 'Line Caret' },
    { id: 'block', name: 'Solid Block' },
    { id: 'underline', name: 'Underline' },
    { id: 'pulse', name: 'Pulsing Line' },
  ];

  const sounds: { id: SoundProfile; name: string; desc: string }[] = [
    { id: 'thock', name: 'Mechanical Thock', desc: 'Deep linear switch pop' },
    { id: 'clicky', name: 'Clicky Switch', desc: 'Crisp Cherry MX Blue click' },
    { id: 'soft', name: 'Soft Tactile', desc: 'Gentle low-frequency bump' },
    { id: 'typewriter', name: 'Typewriter', desc: 'Vintage mechanical spring' },
    { id: 'off', name: 'Mute', desc: 'Silent mode' },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Settings & Customization">
      <div className="space-y-6 text-sm">
        {/* Theme Picker */}
        <div>
          <div className="flex items-center gap-2 mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--text-sub)]">
            <Palette className="w-4 h-4 text-[var(--accent)]" />
            <span>Visual Theme</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {themes.map((t) => (
              <button
                key={t.id}
                onClick={() => onUpdateSettings({ theme: t.id })}
                className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                  settings.theme === t.id
                    ? 'border-[var(--accent)] bg-[var(--bg-card)] shadow-md'
                    : 'border-[var(--border)] bg-[var(--bg-sub)] hover:border-[var(--text-sub)]'
                }`}
              >
                <span className="font-medium text-xs text-[var(--text-main)]">{t.name}</span>
                <span
                  className="w-3.5 h-3.5 rounded-full border border-black/20"
                  style={{ backgroundColor: t.color }}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Font Family */}
        <div>
          <div className="flex items-center gap-2 mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--text-sub)]">
            <Type className="w-4 h-4 text-[var(--accent)]" />
            <span>Typing Font</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {fonts.map((f) => (
              <button
                key={f.id}
                onClick={() => onUpdateSettings({ fontFamily: f.id })}
                className={`p-3 rounded-xl border text-left transition-all ${
                  settings.fontFamily === f.id
                    ? 'border-[var(--accent)] bg-[var(--bg-card)]'
                    : 'border-[var(--border)] bg-[var(--bg-sub)] hover:border-[var(--text-sub)]'
                }`}
              >
                <div className="font-medium text-xs text-[var(--text-main)] mb-1">{f.name}</div>
                <div className={`text-xs text-[var(--text-sub)] font-${f.id}`}>{f.sample}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Caret Style */}
        <div>
          <div className="flex items-center gap-2 mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--text-sub)]">
            <MousePointer className="w-4 h-4 text-[var(--accent)]" />
            <span>Caret Style</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {carets.map((c) => (
              <button
                key={c.id}
                onClick={() => onUpdateSettings({ caretStyle: c.id })}
                className={`p-2.5 rounded-xl border text-xs font-medium transition-all text-center ${
                  settings.caretStyle === c.id
                    ? 'border-[var(--accent)] bg-[var(--accent)]/15 text-[var(--accent)] font-semibold'
                    : 'border-[var(--border)] bg-[var(--bg-sub)] text-[var(--text-sub)] hover:text-[var(--text-main)]'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>

        {/* Mechanical Sound Effects */}
        <div>
          <div className="flex items-center gap-2 mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--text-sub)]">
            <Volume2 className="w-4 h-4 text-[var(--accent)]" />
            <span>Key Switch Audio</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
            {sounds.map((s) => (
              <button
                key={s.id}
                onClick={() => onUpdateSettings({ soundProfile: s.id })}
                className={`p-3 rounded-xl border text-left transition-all ${
                  settings.soundProfile === s.id
                    ? 'border-[var(--accent)] bg-[var(--bg-card)]'
                    : 'border-[var(--border)] bg-[var(--bg-sub)] hover:border-[var(--text-sub)]'
                }`}
              >
                <div className="font-medium text-xs text-[var(--text-main)]">{s.name}</div>
                <div className="text-[11px] text-[var(--text-sub)]">{s.desc}</div>
              </button>
            ))}
          </div>

          {settings.soundProfile !== 'off' && (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border)]">
              <span className="text-xs text-[var(--text-sub)] font-medium">Volume:</span>
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.05"
                value={settings.soundVolume}
                onChange={(e) => onUpdateSettings({ soundVolume: parseFloat(e.target.value) })}
                className="w-full accent-[var(--accent)] cursor-pointer"
              />
              <span className="text-xs font-mono text-[var(--text-main)] w-8 text-right">
                {Math.round(settings.soundVolume * 100)}%
              </span>
            </div>
          )}
        </div>

        {/* Behavior Toggles */}
        <div className="pt-2 border-t border-[var(--border)] space-y-2">
          <Toggle
            checked={settings.strictMode}
            onChange={(val) => onUpdateSettings({ strictMode: val })}
            label="Strict Mode"
            sublabel="Must correct errors before advancing to the next word"
          />
          <Toggle
            checked={settings.blindMode}
            onChange={(val) => onUpdateSettings({ blindMode: val })}
            label="Blind Mode"
            sublabel="Hide real-time WPM and accuracy metrics during typing"
          />
        </div>

        {/* Reset button */}
        <div className="pt-4 border-t border-[var(--border)] flex justify-between items-center">
          <button
            onClick={onResetSettings}
            className="text-xs text-red-400 hover:underline flex items-center gap-1"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[var(--accent)] text-slate-950 font-semibold rounded-xl text-xs hover:brightness-110 transition"
          >
            Done
          </button>
        </div>
      </div>
    </Modal>
  );
};
