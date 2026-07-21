import React from 'react';
import { Sparkles, TrendingDown } from 'lucide-react';

export default function RecommendationCard({ recommendations }) {
  if (!recommendations || recommendations.length === 0) return null;

  return (
    <div className="glass-panel p-6 rounded-2xl flex flex-col gap-5 shadow-xl">
      
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800/80 pb-3">
        <h3 className="text-xs font-bold tracking-wider text-slate-700 dark:text-slate-300 uppercase flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
          <span>GreenOps AI Optimization Recommendations ({recommendations.length})</span>
        </h3>
        <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
          Powered by Ollama Qwen 2.5
        </span>
      </div>

      <div className="flex flex-col gap-4">
        {recommendations.map((rec, index) => {
          const isHigh = rec.priority === 'HIGH';
          const isMed = rec.priority === 'MEDIUM';

          return (
            <div 
              key={index} 
              className="glass-card p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-5 border border-slate-200 dark:border-slate-800/80 hover:border-emerald-500/30 transition-all duration-200"
            >
              <div className="flex items-start gap-3.5 flex-1">
                {/* Number Badge */}
                <div className="w-7 h-7 rounded-xl bg-slate-200/80 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-xs font-mono font-bold text-slate-700 dark:text-slate-300 flex items-center justify-center shrink-0 mt-0.5">
                  {index + 1}
                </div>

                <div className="flex flex-col gap-1">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    {rec.issue}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mt-1">
                    {rec.description}
                  </p>
                </div>
              </div>

              {/* Badges and Impact visual */}
              <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center gap-2.5 shrink-0 border-t md:border-t-0 border-slate-200 dark:border-slate-800/60 pt-3 md:pt-0 min-w-[140px]">
                
                {/* Priority */}
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${
                  isHigh 
                    ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30' 
                    : isMed 
                    ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30'
                    : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                }`}>
                  {rec.priority} Priority
                </span>

                {/* Savings indicator */}
                <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/25 px-3 py-1 rounded-xl">
                  <TrendingDown className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                  <span className="text-xs font-mono text-slate-500 dark:text-slate-400">Est. Savings:</span>
                  <span className="text-sm font-extrabold font-mono text-emerald-600 dark:text-emerald-400">
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
