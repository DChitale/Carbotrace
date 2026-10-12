import React from 'react';
import { Sparkle, TrendDown, CheckCircle } from '@phosphor-icons/react';

export default function RecommendationCard({ recommendations }) {
  if (!recommendations || recommendations.length === 0) {
    return (
      <div className="glass-panel p-5 sm:p-6 rounded-2xl flex flex-col gap-3 border border-emerald-500/20 shadow-lg">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/[0.06] pb-3">
          <h3 className="text-xs font-mono font-bold tracking-wider text-slate-700 dark:text-slate-300 uppercase flex items-center gap-2">
            <Sparkle size={15} weight="fill" className="text-emerald-500" />
            <span>GreenOps Recommendations</span>
          </h3>
          <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            Optimized
          </span>
        </div>
        <div className="flex items-center gap-3 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-700 dark:text-emerald-300">
          <CheckCircle size={18} weight="duotone" className="shrink-0 text-emerald-500" />
          <p className="leading-relaxed">
            No further optimizations recommended at this stage. Your workloads are aligned with current carbon minimization targets.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-panel p-5 sm:p-6 rounded-2xl flex flex-col gap-5 shadow-xl">
      
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/[0.06] pb-3">
        <h3 className="text-xs font-mono font-bold tracking-wider text-slate-700 dark:text-slate-300 uppercase flex items-center gap-2">
          <Sparkle size={15} weight="fill" className="text-emerald-500" />
          <span>AI Optimization Recommendations ({recommendations.length})</span>
        </h3>
        <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
          Ollama Local Inference
        </span>
      </div>

      <div className="flex flex-col gap-3">
        {recommendations.map((rec, index) => {
          const isHigh = rec.priority === 'HIGH';
          const isMed = rec.priority === 'MEDIUM';

          return (
            <div 
              key={index} 
              className="glass-card p-4 sm:p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 border border-slate-200 dark:border-white/[0.06] hover:border-emerald-500/30 transition-all duration-200"
            >
              <div className="flex items-start gap-3 flex-1">
                {/* Number Badge */}
                <div className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-white/[0.06] border border-slate-200 dark:border-white/[0.08] text-xs font-mono font-bold text-slate-700 dark:text-slate-300 flex items-center justify-center shrink-0 mt-0.5">
                  {index + 1}
                </div>

                <div className="flex flex-col gap-1">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {rec.issue}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {rec.description}
                  </p>
                </div>
              </div>

              {/* Badges and Impact visual */}
              <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center gap-2 shrink-0 border-t md:border-t-0 border-slate-200 dark:border-white/[0.04] pt-2.5 md:pt-0 min-w-[130px]">
                
                {/* Priority */}
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${
                  isHigh 
                    ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/25' 
                    : isMed 
                    ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/25'
                    : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/25'
                }`}>
                  {rec.priority}
                </span>

                {/* Savings indicator */}
                <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-xl">
                  <TrendDown size={14} weight="bold" className="text-emerald-500" />
                  <span className="text-xs font-mono text-slate-500">Savings:</span>
                  <span className="text-xs font-bold font-mono text-emerald-600 dark:text-emerald-400">
                    -{rec.savings_percent}%
                  </span>
                </div>

              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
