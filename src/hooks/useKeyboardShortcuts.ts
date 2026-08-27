import { useEffect } from 'react';

interface ShortcutOptions {
  onRestart: () => void;
  onToggleSettings?: () => void;
  onToggleShortcuts?: () => void;
}

export function useKeyboardShortcuts({
  onRestart,
  onToggleSettings,
  onToggleShortcuts,
}: ShortcutOptions) {
  useEffect(() => {
    let tabPressed = false;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.key === 'Tab') {
        tabPressed = true;
      }

      if (e.key === 'Enter' && tabPressed) {
        e.preventDefault();
        onRestart();
        tabPressed = false;
        return;
      }

      if (e.key === 'Escape') {
        e.preventDefault();
        if (onToggleSettings) onToggleSettings();
      }

      if (e.key === '?' && e.shiftKey) {
        e.preventDefault();
        if (onToggleShortcuts) onToggleShortcuts();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        tabPressed = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [onRestart, onToggleSettings, onToggleShortcuts]);
}
