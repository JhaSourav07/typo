import React from 'react';
import type { WordData } from '../../types/typing';
import { CharacterDisplay } from './CharacterDisplay';

interface WordDisplayProps {
  wordData: WordData;
  isCurrentWord: boolean;
  currentCharIndex: number;
  wordRef?: (node: HTMLDivElement | null) => void;
  charRefCallback?: (charIndex: number, node: HTMLSpanElement | null) => void;
}

export const WordDisplay: React.FC<WordDisplayProps> = ({
  wordData,
  isCurrentWord,
  currentCharIndex,
  wordRef,
  charRefCallback,
}) => {
  const hasErrors = wordData.chars.some((c) => c.state === 'incorrect' || c.state === 'extra');

  return (
    <div
      ref={wordRef}
      className={`relative inline-flex items-center mx-2 my-1 tracking-wide transition-all ${
        isCurrentWord
          ? 'border-b-2 border-[var(--accent)] pb-0.5'
          : hasErrors
          ? 'border-b-2 border-red-500/40'
          : ''
      }`}
    >
      {wordData.chars.map((charData, charIndex) => {
        const isCurrentChar = isCurrentWord && charIndex === currentCharIndex;
        return (
          <CharacterDisplay
            key={`${wordData.id}-c-${charIndex}`}
            charData={charData}
            isCurrent={isCurrentChar}
            refCallback={(node) => {
              if (isCurrentChar && charRefCallback) {
                charRefCallback(charIndex, node);
              }
            }}
          />
        );
      })}
    </div>
  );
};
