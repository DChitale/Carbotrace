import React from 'react';
import { CheckCircle2, Loader2, Sparkles, Leaf } from 'lucide-react';

const STAGES = [
  'Cloning repository statically (shallow depth=1)...',
  'Detecting files and parsing imports/dependencies...',
  'Scanning AST with tree-sitter & checking loop levels...',
  'Analyzing GitHub Actions workflows & Dockerfiles...',
  'Calculating carbon coefficients & running scoring engine...',
  'Running LLM recommendation engine...'
];

export default function LoadingState({ loadingStage }) {
  const currentIndex = STAGES.indexOf(loadingStage) !== -1 
    ? STAGES.indexOf(loadingStage) 
    : 0;

  return (
    <div className="glass-panel-accent p-8 md:p-12 rounded-2xl flex flex-col items-center justify-center text-center gap-8 py-16 animate-fade-scale my-4 shadow-2xl relative overflow-hidden">
      
      {/* Central Animated Indicator */}
      <div className="relative flex items-center justify-center">
        <div className="w-20 h-20 rounded-full border-4 border-emerald-500/20 border-t-emerald-500 animate-spin"></div>
        <div className="absolute w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
          <Leaf className="w-6 h-6 text-emerald-500 dark:text-emerald-400 animate-pulse" />
        </div>
      </div>

      <div className="flex flex-col items-center gap-1 max-w-md">
        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <span>Auditing Repository</span>
          <Sparkles className="w-4 h-4 text-emerald-500 dark:text-emerald-400 animate-bounce" />
        </h3>
        <p className="text-xs text-slate-600 dark:text-slate-400">
          Running static code analysis, dependency caching & GreenOps scoring engine...
        </p>
      </div>

      {/* Vertical Stepper Timeline */}
      <div className="w-full max-w-lg bg-slate-100/90 dark:bg-[#070c18]/80 p-5 rounded-2xl border border-slate-200 dark:border-slate-800/80 flex flex-col gap-3 text-left shadow-inner">
        {STAGES.map((stage, idx) => {
          const isDone = idx < currentIndex;
          const isCurrent = idx === currentIndex;
          const isPending = idx > currentIndex;

          return (
            <div 
              key={idx} 
              className={`flex items-center gap-3 transition-all duration-300 ${
                isCurrent 
                  ? 'text-emerald-600 dark:text-emerald-300 font-semibold' 
                  : isDone 
                  ? 'text-slate-600 dark:text-slate-400' 
                  : 'text-slate-400 dark:text-slate-600 opacity-60'
              }`}
            >
              <div className="shrink-0 flex items-center justify-center w-5 h-5">
                {isDone && <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />}
                {isCurrent && <Loader2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400 animate-spin" />}
                {isPending && <div className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-700"></div>}
              </div>
              <span className="text-xs font-mono tracking-tight">{stage}</span>
            </div>
          );
        })}
      </div>

    </div>
  );
}
