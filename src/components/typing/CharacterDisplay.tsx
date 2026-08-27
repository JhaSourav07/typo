import React, { memo } from 'react';
import type { CharData } from '../../types/typing';

interface CharacterDisplayProps {
  charData: CharData;
  isCurrent?: boolean;
  refCallback?: (node: HTMLSpanElement | null) => void;
}

export const CharacterDisplay: React.FC<CharacterDisplayProps> = memo(({
  charData,
  refCallback,
}) => {
  const { char, state, typedChar } = charData;

  let colorStyle = 'text-[var(--text-untyped)]';
  let bgStyle = '';

  if (state === 'correct') {
    colorStyle = 'text-[var(--correct)] font-medium';
  } else if (state === 'incorrect') {
    colorStyle = 'text-[var(--error)] underline decoration-2 decoration-red-500/80';
    bgStyle = 'bg-[var(--error-bg)] rounded-xs';
  } else if (state === 'extra') {
    colorStyle = 'text-red-400 opacity-80';
    bgStyle = 'bg-red-500/20 rounded-xs';
  }

  return (
    <span
      ref={refCallback}
      className={`relative inline-block transition-colors duration-75 ${colorStyle} ${bgStyle}`}
    >
      {state === 'extra' ? typedChar : char}
    </span>
  );
});
