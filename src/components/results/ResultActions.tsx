import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { RefreshCw, Sliders, Copy, Check } from 'lucide-react';
import type { TestResult } from '../../types/typing';

interface ResultActionsProps {
  result: TestResult;
  onRestartTest: () => void;
  onChangeTest: () => void;
}

export const ResultActions: React.FC<ResultActionsProps> = ({
  result,
  onRestartTest,
  onChangeTest,
}) => {
  const [copied, setCopied] = useState(false);

  const copyResultSummary = () => {
    const summary = `⌨️ TYPO Result:
🚀 WPM: ${result.finalWpm} (Raw: ${result.rawWpm})
🎯 Accuracy: ${result.accuracy}%
⚡ Consistency: ${result.consistency}%
⏱️ Mode: ${result.modeSummary} (${result.timeElapsed}s)
Built on Typo Platform`;

    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
      <Button variant="primary" size="lg" onClick={onRestartTest}>
        <RefreshCw className="w-4 h-4" />
        <span>Restart Test</span>
        <kbd className="ml-1 px-1.5 py-0.5 text-[10px] font-mono rounded-[3px] bg-white/20 text-white font-bold">
          Tab + Enter
        </kbd>
      </Button>

      <Button variant="secondary" size="lg" onClick={onChangeTest}>
        <Sliders className="w-4 h-4" />
        <span>Change Mode</span>
      </Button>

      <Button variant="secondary" size="lg" onClick={copyResultSummary}>
        {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
        <span>{copied ? 'Copied!' : 'Copy Summary'}</span>
      </Button>
    </div>
  );
};
