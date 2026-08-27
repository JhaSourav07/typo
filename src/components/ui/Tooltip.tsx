import React, { useState } from 'react';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
}

export const Tooltip: React.FC<TooltipProps> = ({ content, children }) => {
  const [visible, setVisible] = useState(false);

  return (
    <div
      className="relative inline-flex items-center"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && (
        <div className="absolute bottom-full mb-1.5 left-1/2 -translate-x-1/2 z-50 whitespace-nowrap rounded-[4px] bg-[var(--bg-elevated)] border border-[var(--border)] px-2 py-1 text-[11px] font-medium text-[var(--text-main)] shadow-lg pointer-events-none animate-fade-in">
          {content}
        </div>
      )}
    </div>
  );
};
