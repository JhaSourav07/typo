import React, { useRef, useEffect, useState, useCallback } from 'react';
import type { WordData, TestSettings, EngineStatus } from '../../types/typing';
import { WordDisplay } from './WordDisplay';
import { Caret } from './Caret';
import { LiveMetrics } from './LiveMetrics';
import { FocusOverlay } from './FocusOverlay';

interface TypingAreaProps {
  words: WordData[];
  currentWordIndex: number;
  currentCharIndex: number;
  settings: TestSettings;
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

  const [caretPos, setCaretPos] = useState({ top: 12, left: 16, height: 28 });

  const updateCaretPosition = useCallback(() => {
    if (!containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();

    if (activeCharNodeRef.current) {
      const charRect = activeCharNodeRef.current.getBoundingClientRect();
      const top = charRect.top - containerRect.top + containerRef.current.scrollTop;
      const left = charRect.left - containerRect.left;
      const height = charRect.height || 28;

      setCaretPos({ top, left, height });

      // Smooth line scrolling: keep active line in view
      const lineTop = charRect.top - containerRect.top;
      if (lineTop > 90) {
        containerRef.current.scrollTop += 45;
      } else if (lineTop < 10) {
        containerRef.current.scrollTop = Math.max(0, containerRef.current.scrollTop - 45);
      }
    } else if (activeWordNodeRef.current) {
      // Position caret at end of word when overtyping / awaiting space
      const wordRect = activeWordNodeRef.current.getBoundingClientRect();
      const top = wordRect.top - containerRect.top + containerRef.current.scrollTop;
      const left = wordRect.right - containerRect.left;
      const height = wordRect.height || 28;

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
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center justify-center my-auto py-6">
      {/* Live Metrics Header */}
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

      {/* Main Words Typing Container */}
      <div
        ref={containerRef}
        tabIndex={0}
        onClick={handleContainerClick}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onKeyDown={onKeyDown}
        className={`relative w-full h-[145px] overflow-hidden rounded-2xl bg-[var(--bg-sub)] border p-5 text-xl sm:text-2xl leading-[2.4rem] select-none focus:outline-none transition-all duration-300 ${fontClass} ${
          isFocused
            ? 'border-[var(--border)] shadow-xl'
            : 'border-[var(--border)]/50 opacity-70 blur-[1px]'
        }`}
      >
        {/* Focus Blur Overlay */}
        <FocusOverlay isFocused={isFocused} onFocus={handleContainerClick} />

        {/* Dynamic Smooth Caret */}
        {isFocused && status !== 'completed' && (
          <Caret
            style={settings.caretStyle}
            top={caretPos.top}
            left={caretPos.left}
            height={caretPos.height}
          />
        )}

        {/* Words Layout */}
        <div className="flex flex-wrap items-center content-start min-h-[120px] transition-transform duration-200">
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
    </div>
  );
};
