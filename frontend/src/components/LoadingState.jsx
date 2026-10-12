import React from 'react';
import { CheckCircle, CircleNotch, Leaf } from '@phosphor-icons/react';

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
    <div className="glass-panel-accent p-6 md:p-10 rounded-2xl flex flex-col items-center justify-center text-center gap-7 py-12 my-3 shadow-2xl relative overflow-hidden">
      
      {/* Central Indicator */}
      <div className="relative flex items-center justify-center">
        <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center">
          <Leaf size={28} weight="duotone" className="text-emerald-500 dark:text-emerald-400" />
        </div>
      </div>

      <div className="flex flex-col items-center gap-1 max-w-md">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          Auditing Repository Emissions
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Running static code analysis, dependency caching, and GreenOps scoring engine...
        </p>
      </div>

      {/* Stepper Timeline */}
      <div className="w-full max-w-md bg-slate-100/80 dark:bg-black/30 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-white/[0.06] flex flex-col gap-2.5 text-left shadow-inner">
        {STAGES.map((stage, idx) => {
          const isDone = idx < currentIndex;
          const isCurrent = idx === currentIndex;
          const isPending = idx > currentIndex;

          return (
            <div 
              key={idx} 
              className={`flex items-center gap-3 transition-colors duration-200 ${
                isCurrent 
                  ? 'text-emerald-600 dark:text-emerald-400 font-semibold' 
                  : isDone 
                  ? 'text-slate-600 dark:text-slate-400' 
                  : 'text-slate-400 dark:text-slate-600 opacity-50'
              }`}
            >
              <div className="shrink-0 flex items-center justify-center w-4 h-4">
                {isDone && <CheckCircle size={16} weight="fill" className="text-emerald-500" />}
                {isCurrent && <CircleNotch size={16} weight="bold" className="text-emerald-500 animate-spin" />}
                {isPending && <div className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-white/[0.2]"></div>}
              </div>
              <span className="text-xs font-mono tracking-tight">{stage}</span>
            </div>
          );
        })}
      </div>

      {/* Dashboard Skeletal Preview Wireframe */}
      <div className="w-full max-w-xl opacity-30 pointer-events-none mt-1" aria-hidden="true">
        <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-2">Preparing Dashboard View</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="h-20 rounded-xl bg-slate-200/50 dark:bg-white/[0.04] border border-slate-300/40 dark:border-white/[0.06] animate-pulse"></div>
          <div className="h-20 rounded-xl bg-slate-200/50 dark:bg-white/[0.04] border border-slate-300/40 dark:border-white/[0.06] animate-pulse delay-100"></div>
          <div className="h-20 rounded-xl bg-slate-200/50 dark:bg-white/[0.04] border border-slate-300/40 dark:border-white/[0.06] animate-pulse delay-200"></div>
        </div>
      </div>

    </div>
  );
}
