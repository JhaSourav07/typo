import React, { useRef, useEffect, useState, useCallback } from 'react';
import type { WordData, TestSettings, EngineStatus } from '../../types/typing';
import { WordDisplay } from './WordDisplay';
import { Caret } from './Caret';
import { LiveMetrics } from './LiveMetrics';
import { FocusOverlay } from './FocusOverlay';
import { ModeSelector } from '../controls/ModeSelector';

interface TypingAreaProps {
  words: WordData[];
  currentWordIndex: number;
  currentCharIndex: number;
  settings: TestSettings;
  onUpdateSettings: (partial: Partial<TestSettings>) => void;
  status: EngineStatus;
  timeLeft: number;
  timeElapsed: number;
  liveWpm: number;
  liveAccuracy: number;
  isFocused: boolean;
  setIsFocused: (focused: boolean) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
}

export const TypingArea: React.FC<TypingAreaProps> = ({
  words,
  currentWordIndex,
  currentCharIndex,
  settings,
  onUpdateSettings,
  status,
  timeLeft,
  timeElapsed,
  liveWpm,
  liveAccuracy,
  isFocused,
  setIsFocused,
  onKeyDown,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const activeCharNodeRef = useRef<HTMLSpanElement | null>(null);
  const activeWordNodeRef = useRef<HTMLDivElement | null>(null);

  const [caretPos, setCaretPos] = useState({ top: 12, left: 16, height: 32 });

  const updateCaretPosition = useCallback(() => {
    if (!containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();

    if (activeCharNodeRef.current) {
      const charRect = activeCharNodeRef.current.getBoundingClientRect();
      const top = charRect.top - containerRect.top + containerRef.current.scrollTop;
      const left = charRect.left - containerRect.left;
      const height = charRect.height || 32;

      setCaretPos({ top, left, height });

      const lineTop = charRect.top - containerRect.top;
      if (lineTop > 95) {
        containerRef.current.scrollTop += 48;
      } else if (lineTop < 10) {
        containerRef.current.scrollTop = Math.max(0, containerRef.current.scrollTop - 48);
      }
    } else if (activeWordNodeRef.current) {
      const wordRect = activeWordNodeRef.current.getBoundingClientRect();
      const top = wordRect.top - containerRect.top + containerRef.current.scrollTop;
      const left = wordRect.right - containerRect.left;
      const height = wordRect.height || 32;

      setCaretPos({ top, left, height });
    }
  }, []);

  useEffect(() => {
    updateCaretPosition();
  }, [currentWordIndex, currentCharIndex, words, updateCaretPosition]);

  useEffect(() => {
    window.addEventListener('resize', updateCaretPosition);
    return () => window.removeEventListener('resize', updateCaretPosition);
  }, [updateCaretPosition]);

  const handleContainerClick = () => {
    setIsFocused(true);
    if (containerRef.current) {
      containerRef.current.focus();
    }
  };

  const fontClass = `font-${settings.fontFamily}`;

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center justify-center my-auto py-4 sm:py-8 px-2 sm:px-4">
      {/* 1. Mode Configuration Controls (Above Text Area) */}
      <div className={`mb-8 transition-opacity duration-200 ${status === 'running' ? 'opacity-20 pointer-events-none' : 'opacity-100'}`}>
        <ModeSelector settings={settings} onUpdateSettings={onUpdateSettings} />
      </div>

      {/* 2. Primary Typing Text Canvas (Center & Visually Dominant) */}
      <div
        ref={containerRef}
        tabIndex={0}
        onClick={handleContainerClick}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onKeyDown={onKeyDown}
        className={`relative w-full h-[160px] overflow-hidden p-2 text-2xl sm:text-3xl leading-[3.2rem] select-none focus:outline-none transition-all duration-200 ${fontClass} ${
          isFocused ? 'opacity-100' : 'opacity-40 blur-[1px]'
        }`}
      >
        <FocusOverlay isFocused={isFocused} onFocus={handleContainerClick} />

        {isFocused && status !== 'completed' && (
          <Caret
            style={settings.caretStyle}
            top={caretPos.top}
            left={caretPos.left}
            height={caretPos.height}
          />
        )}

        <div className="flex flex-wrap items-center content-start min-h-[135px]">
          {words.map((wordData, wordIndex) => {
            const isCurrentWord = wordIndex === currentWordIndex;
            return (
              <WordDisplay
                key={wordData.id}
                wordData={wordData}
                isCurrentWord={isCurrentWord}
                currentCharIndex={currentCharIndex}
                wordRef={(node) => {
                  if (isCurrentWord) {
                    activeWordNodeRef.current = node;
                  }
                }}
                charRefCallback={(charIdx, node) => {
                  if (isCurrentWord && charIdx === currentCharIndex) {
                    activeCharNodeRef.current = node;
                  }
                }}
              />
            );
          })}
        </div>
      </div>

      {/* 3. Live Metrics (Below Text Area) */}
      <LiveMetrics
        settings={settings}
        status={status}
        timeLeft={timeLeft}
        timeElapsed={timeElapsed}
        liveWpm={liveWpm}
        liveAccuracy={liveAccuracy}
        currentWordIndex={currentWordIndex}
        totalWords={words.length}
      />
    </div>
  );
};
