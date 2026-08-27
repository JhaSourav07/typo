import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { RefreshCw, RotateCcw, Copy, Check } from 'lucide-react';
import type { TestResult } from '../../types/typing';

interface ResultActionsProps {
  result: TestResult;
  onNextTest: () => void;
  onRestartSame: () => void;
}

export const ResultActions: React.FC<ResultActionsProps> = ({
  result,
  onNextTest,
  onRestartSame,
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
      <Button variant="accent" size="lg" onClick={onNextTest}>
        <RefreshCw className="w-4 h-4" />
        <span>Next Test</span>
        <kbd className="ml-1.5 px-1.5 py-0.5 text-[10px] font-mono rounded bg-slate-950/20 text-slate-950 font-bold">
          Tab + Enter
        </kbd>
      </Button>

      <Button variant="secondary" size="lg" onClick={onRestartSame}>
        <RotateCcw className="w-4 h-4" />
        <span>Retry Same</span>
      </Button>

      <Button variant="secondary" size="lg" onClick={copyResultSummary}>
        {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
        <span>{copied ? 'Copied to Clipboard!' : 'Copy Summary'}</span>
      </Button>
    </div>
  );
};
