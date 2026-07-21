import React from 'react';
import { AlertTriangle } from 'lucide-react';

export default function RiskList({ risks }) {
  if (!risks || risks.length === 0) return null;

  return (
    <div className="glass-panel p-6 rounded-2xl flex flex-col gap-4 border border-rose-500/20 shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800/80 pb-3">
        <h3 className="text-xs font-bold tracking-wider text-rose-600 dark:text-rose-300 uppercase flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-500 dark:text-rose-400" />
          <span>Carbon Risk Indicators ({risks.length})</span>
        </h3>
        <span className="text-[10px] font-mono text-rose-500 dark:text-rose-400/80">Action Required</span>
      </div>

      <div className="flex flex-col gap-3">
        {risks.map((risk, index) => {
          const isHigh = risk.severity === 'HIGH';
          return (
            <div 
              key={index} 
              className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl border text-xs transition-all ${
                isHigh 
                  ? 'bg-rose-500/10 dark:bg-rose-950/20 border-rose-500/30 text-rose-800 dark:text-rose-200' 
                  : 'bg-amber-500/10 dark:bg-amber-950/20 border-amber-500/30 text-amber-800 dark:text-amber-200'
              }`}
            >
              <div className="flex items-start gap-3">
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold shrink-0 mt-0.5 border ${
                  isHigh 
                    ? 'bg-rose-500/20 text-rose-700 dark:text-rose-300 border-rose-500/40' 
                    : 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500/40'
                }`}>
                  {risk.severity}
                </span>
                <div>
                  <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-0.5">
                    {risk.layer} Layer
                  </span>
                  <p className="text-xs font-medium text-slate-800 dark:text-slate-200 leading-snug">
                    {risk.message}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
