import React from 'react';
import type { CaretStyle } from '../../types/typing';

interface CaretProps {
  style: CaretStyle;
  top: number;
  left: number;
  height: number;
}

export const Caret: React.FC<CaretProps> = ({ style, top, left, height }) => {
  const isPulse = style === 'pulse';
  const isBlock = style === 'block';
  const isUnderline = style === 'underline';

  return (
    <div
      className={`absolute caret-smooth pointer-events-none z-10 ${
        isPulse ? 'caret-pulse' : ''
      }`}
      style={{
        top: `${top}px`,
        left: `${left}px`,
        width: isBlock ? '0.7em' : '2px',
        height: isUnderline ? '3px' : `${height}px`,
        marginTop: isUnderline ? `${height - 3}px` : '0px',
        backgroundColor: 'var(--caret)',
        boxShadow: '0 0 10px var(--accent-glow)',
        opacity: isBlock ? 0.35 : 1,
        borderRadius: '1px',
      }}
    />
  );
};
