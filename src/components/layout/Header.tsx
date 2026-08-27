import React from 'react';
import { Settings, Volume2, VolumeX, Keyboard } from 'lucide-react';
import type { TestSettings } from '../../types/typing';
import { ModeSelector } from '../controls/ModeSelector';
import { IconButton } from '../ui/IconButton';

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
    <header className="w-full py-4 px-4 sm:px-8 border-b border-[var(--border)] bg-[var(--bg-main)]/90 backdrop-blur-xs sticky top-0 z-30 transition-all duration-200">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-3 select-none">
          <div className="w-8 h-8 rounded-md bg-[var(--accent)] flex items-center justify-center text-white font-extrabold font-mono text-base shadow-sm">
            T
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg tracking-wider text-[var(--text-main)] font-mono">TYPO</span>
            <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded-[4px] bg-[var(--accent)]/15 text-[var(--accent)] border border-[var(--accent)]/30">
              Phase 1
            </span>
          </div>
        </div>

        {/* Mode Selector Toolbar */}
        <div className={`transition-opacity duration-200 ${status === 'running' ? 'opacity-30 pointer-events-none' : 'opacity-100'}`}>
          <ModeSelector settings={settings} onUpdateSettings={onUpdateSettings} />
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-1.5">
          <IconButton
            icon={isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-[var(--accent)]" />}
            label={isMuted ? 'Unmute Sound' : 'Mute Sound'}
            onClick={toggleSound}
          />

          <IconButton
            icon={<Keyboard className="w-4 h-4" />}
            label="Keyboard Shortcuts"
            onClick={onOpenShortcuts}
          />

          <IconButton
            icon={<Settings className="w-4 h-4" />}
            label="Settings & Theme"
            onClick={onOpenSettings}
          />
        </div>
      </div>
    </header>
  );
};
