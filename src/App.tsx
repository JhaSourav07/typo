import React, { useState } from 'react';
import { useSettings } from './hooks/useSettings';
import { useTypingEngine } from './hooks/useTypingEngine';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { TypingArea } from './components/typing/TypingArea';
import { ResultsView } from './components/results/ResultsView';
import { SettingsModal } from './components/controls/SettingsModal';
import { ShortcutsModal } from './components/controls/ShortcutsModal';

export const App: React.FC = () => {
  const { settings, updateSettings, resetSettings } = useSettings();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);

  const {
    status,
    words,
    currentWordIndex,
    currentCharIndex,
    timeLeft,
    timeElapsed,
    liveWpm,
    liveAccuracy,
    result,
    isFocused,
    setIsFocused,
    handleKeyDown,
    restartTest,
  } = useTypingEngine(settings);

  useKeyboardShortcuts({
    onRestart: restartTest,
    onToggleSettings: () => setIsSettingsOpen((prev) => !prev),
    onToggleShortcuts: () => setIsShortcutsOpen((prev) => !prev),
  });

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-main)] text-[var(--text-main)] transition-colors duration-200 font-sans">
      <Header
        settings={settings}
        onUpdateSettings={updateSettings}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenShortcuts={() => setIsShortcutsOpen(true)}
      />

      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 max-w-6xl mx-auto w-full">
        {status === 'completed' && result ? (
          <ResultsView
            result={result}
            onNextTest={restartTest}
            onRestartSame={restartTest}
          />
        ) : (
          <TypingArea
            words={words}
            currentWordIndex={currentWordIndex}
            currentCharIndex={currentCharIndex}
            settings={settings}
            onUpdateSettings={updateSettings}
            status={status}
            timeLeft={timeLeft}
            timeElapsed={timeElapsed}
            liveWpm={liveWpm}
            liveAccuracy={liveAccuracy}
            isFocused={isFocused}
            setIsFocused={setIsFocused}
            onKeyDown={handleKeyDown}
          />
        )}
      </main>

      <Footer onRestart={restartTest} />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={updateSettings}
        onResetSettings={resetSettings}
      />

      <ShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />
    </div>
  );
};

export default App;
