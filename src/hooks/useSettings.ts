import { useState, useEffect } from 'react';
import type { TestSettings } from '../types/typing';

const DEFAULT_SETTINGS: TestSettings = {
  mode: 'time',
  timeOption: 60,
  wordOption: 25,
  quoteOption: 'medium',
  codeOption: 'javascript',
  numbers: false,
  punctuation: false,
  strictMode: false,
  blindMode: false,
  fontFamily: 'jetbrains',
  theme: 'obsidian',
  caretStyle: 'line',
  soundProfile: 'thock',
  soundVolume: 0.5,
};

const SETTINGS_KEY = 'typo_user_settings_v1';

export function useSettings() {
  const [settings, setSettings] = useState<TestSettings>(() => {
    try {
      const saved = localStorage.getItem(SETTINGS_KEY);
      if (saved) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
      }
    } catch {
      // Fallback
    }
    return DEFAULT_SETTINGS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch {
      // Ignore storage errors
    }

    document.documentElement.setAttribute('data-theme', settings.theme);
  }, [settings]);

  const updateSettings = (partial: Partial<TestSettings>) => {
    setSettings((prev) => ({ ...prev, ...partial }));
  };

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
  };

  return {
    settings,
    updateSettings,
    resetSettings,
  };
}
