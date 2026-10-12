import React from 'react';
import { Warning, CheckCircle } from '@phosphor-icons/react';

export default function RiskList({ risks }) {
  if (!risks || risks.length === 0) {
    return (
      <div className="glass-panel p-5 sm:p-6 rounded-2xl flex flex-col gap-3 border border-emerald-500/20 shadow-lg">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/[0.06] pb-3">
          <h3 className="text-xs font-mono font-bold tracking-wider text-emerald-600 dark:text-emerald-400 uppercase flex items-center gap-2">
            <CheckCircle size={15} weight="fill" className="text-emerald-500" />
            <span>Carbon Risk Indicators</span>
          </h3>
          <span className="text-[10px] font-mono text-emerald-500">Status: Clean</span>
        </div>
        <div className="flex items-center gap-3 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-700 dark:text-emerald-300">
          <CheckCircle size={18} weight="duotone" className="shrink-0 text-emerald-500" />
          <p className="leading-relaxed">
            No critical carbon risk indicators detected. Your repository meets baseline GreenOps efficiency guidelines.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-panel p-5 sm:p-6 rounded-2xl flex flex-col gap-4 border border-rose-500/20 shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/[0.06] pb-3">
        <h3 className="text-xs font-mono font-bold tracking-wider text-rose-600 dark:text-rose-300 uppercase flex items-center gap-2">
          <Warning size={15} weight="fill" className="text-rose-500 dark:text-rose-400" />
          <span>Carbon Risk Indicators ({risks.length})</span>
        </h3>
        <span className="text-[10px] font-mono text-rose-500">Action Recommended</span>
      </div>

      <div className="flex flex-col gap-2.5">
        {risks.map((risk, index) => {
          const isHigh = risk.severity === 'HIGH';
          return (
            <div 
              key={index} 
              className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl border text-xs transition-all ${
                isHigh 
                  ? 'bg-rose-500/[0.07] dark:bg-rose-950/20 border-rose-500/25 text-rose-900 dark:text-rose-200' 
                  : 'bg-amber-500/[0.07] dark:bg-amber-950/20 border-amber-500/25 text-amber-900 dark:text-amber-200'
              }`}
            >
              <div className="flex items-start gap-3">
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold shrink-0 mt-0.5 border ${
                  isHigh 
                    ? 'bg-rose-500/20 text-rose-700 dark:text-rose-300 border-rose-500/30' 
                    : 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500/30'
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
