import React from 'react';
import { Modal } from '../ui/Modal';
import { Keyboard } from 'lucide-react';

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShortcutsModal: React.FC<ShortcutsModalProps> = ({ isOpen, onClose }) => {
  const shortcuts = [
    { key: 'Tab + Enter', desc: 'Instant test restart' },
    { key: 'Esc', desc: 'Open / Close settings modal' },
    { key: 'Space', desc: 'Advance to next word' },
    { key: 'Backspace', desc: 'Delete previous character' },
    { key: 'Ctrl + Backspace', desc: 'Delete current word' },
    { key: 'Shift + ?', desc: 'Toggle keyboard shortcuts window' },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Keyboard Shortcuts">
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs text-[var(--text-sub)] mb-2">
          <Keyboard className="w-4 h-4 text-[var(--accent)]" />
          <span>Keep your hands on the home row for maximum velocity.</span>
        </div>
        <div className="divide-y divide-[var(--border)] border border-[var(--border)] rounded-xl overflow-hidden bg-[var(--bg-sub)]">
          {shortcuts.map((sc, i) => (
            <div key={i} className="flex items-center justify-between p-3 text-xs">
              <span className="text-[var(--text-sub)]">{sc.desc}</span>
              <kbd className="px-2 py-1 rounded bg-[var(--bg-card)] border border-[var(--border)] font-mono text-[var(--accent)] font-semibold shadow-xs">
                {sc.key}
              </kbd>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
};
