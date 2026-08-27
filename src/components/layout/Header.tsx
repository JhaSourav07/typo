import React from 'react';
import { Settings, Volume2, VolumeX, Keyboard } from 'lucide-react';
import type { TestSettings } from '../../types/typing';
import { ModeSelector } from '../controls/ModeSelector';

interface HeaderProps {
  settings: TestSettings;
  onUpdateSettings: (partial: Partial<TestSettings>) => void;
  onOpenSettings: () => void;
  onOpenShortcuts: () => void;
  status: 'idle' | 'running' | 'completed';
}

export const Header: React.FC<HeaderProps> = ({
  settings,
  onUpdateSettings,
  onOpenSettings,
  onOpenShortcuts,
  status,
}) => {
  const isMuted = settings.soundProfile === 'off';

  const toggleSound = () => {
    onUpdateSettings({
      soundProfile: isMuted ? 'thock' : 'off',
    });
  };

  return (
    <header className="w-full py-4 px-4 sm:px-8 border-b border-[var(--border)] bg-[var(--bg-main)]/80 backdrop-blur-md sticky top-0 z-30 transition-all duration-300">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[var(--accent)] to-amber-300 flex items-center justify-center text-slate-950 font-extrabold font-mono text-lg shadow-lg shadow-[var(--accent-glow)]">
            T
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-wider text-[var(--text-main)] font-mono">TYPO</span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-[var(--accent)]/15 text-[var(--accent)] border border-[var(--accent)]/30">
                Phase 1
              </span>
            </div>
            <p className="text-[11px] text-[var(--text-sub)] hidden sm:block">Competitive Typing Engine</p>
          </div>
        </div>

        {/* Mode Selector Toolbar */}
        <div className={`transition-opacity duration-300 ${status === 'running' ? 'opacity-40 pointer-events-none' : 'opacity-100'}`}>
          <ModeSelector settings={settings} onUpdateSettings={onUpdateSettings} />
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleSound}
            title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
            className="p-2 rounded-lg text-[var(--text-sub)] hover:text-[var(--text-main)] hover:bg-[var(--bg-sub)] transition border border-transparent hover:border-[var(--border)]"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-[var(--accent)]" />}
          </button>

          <button
            onClick={onOpenShortcuts}
            title="Keyboard Shortcuts"
            className="p-2 rounded-lg text-[var(--text-sub)] hover:text-[var(--text-main)] hover:bg-[var(--bg-sub)] transition border border-transparent hover:border-[var(--border)]"
          >
            <Keyboard className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenSettings}
            title="Settings & Appearance"
            className="p-2 rounded-lg text-[var(--text-sub)] hover:text-[var(--text-main)] hover:bg-[var(--bg-sub)] transition border border-transparent hover:border-[var(--border)]"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
