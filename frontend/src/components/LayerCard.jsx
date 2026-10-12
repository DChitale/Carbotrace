import React from 'react';
import { Cpu, Lightning, HardDrives } from '@phosphor-icons/react';

const round = (num, decimals = 1) => {
  if (num === null || num === undefined) return 0;
  const multiplier = Math.pow(10, decimals);
  return Math.round(num * multiplier) / multiplier;
};

export default function LayerCards({ codeCarbon, ciCarbon, infraCarbon }) {
  const codeVal = Number(codeCarbon) || 0;
  const ciVal = Number(ciCarbon) || 0;
  const infraVal = Number(infraCarbon) || 0;
  const total = codeVal + ciVal + infraVal || 1;

  const codePct = Math.round((codeVal / total) * 100);
  const ciPct = Math.round((ciVal / total) * 100);
  const infraPct = Math.max(0, 100 - codePct - ciPct);

  // Highest contributor
  const maxVal = Math.max(codeVal, ciVal, infraVal);

  return (
    <div className="flex flex-col gap-3">
      {/* Precision Emissions Distribution Bar */}
      <div className="glass-panel p-3.5 px-4 rounded-xl flex flex-col gap-2 border border-slate-200 dark:border-white/[0.06]">
        <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400">
          <span className="uppercase tracking-wider">Multi-Layer Emission Distribution</span>
          <span className="font-semibold text-slate-800 dark:text-slate-200">Total: {round(total, 1)} g CO2e</span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-slate-200 dark:bg-white/[0.06] overflow-hidden flex" role="progressbar" aria-label="Emissions distribution by layer">
          <div 
            style={{ width: `${codePct}%` }} 
            className="h-full bg-emerald-500 transition-all duration-500" 
            title={`Code: ${codePct}%`}
          />
          <div 
            style={{ width: `${ciPct}%` }} 
            className="h-full bg-amber-500 transition-all duration-500" 
            title={`CI/CD: ${ciPct}%`}
          />
          <div 
            style={{ width: `${infraPct}%` }} 
            className="h-full bg-sky-500 transition-all duration-500" 
            title={`Infra: ${infraPct}%`}
          />
        </div>
      </div>

      {/* Semantic Layer Telemetry Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        
        {/* Code Carbon Card */}
        <div className={`glass-card p-5 rounded-2xl border-l-4 border-l-emerald-500 flex flex-col justify-between gap-3 relative overflow-hidden transition-all ${
          codeVal === maxVal && maxVal > 0 ? 'ring-1 ring-emerald-500/20' : ''
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Layer 1: Code Carbon
            </span>
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border border-emerald-500/20">
              <Cpu size={16} weight="duotone" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline justify-between gap-1.5">
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white">{round(codeCarbon, 1)}</span>
                <span className="text-xs font-mono text-slate-400">g CO2e</span>
              </div>
              <span className="text-xs font-mono font-medium text-emerald-600 dark:text-emerald-400">
                {codePct}%
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
              AST loop complexity, package weights, and test run overhead.
            </p>
          </div>
        </div>

        {/* CI Carbon Card */}
        <div className={`glass-card p-5 rounded-2xl border-l-4 border-l-amber-500 flex flex-col justify-between gap-3 relative overflow-hidden transition-all ${
          ciVal === maxVal && maxVal > 0 ? 'ring-1 ring-amber-500/20' : ''
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Layer 2: CI/CD Pipeline
            </span>
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-500 dark:text-amber-400 border border-amber-500/20">
              <Lightning size={16} weight="duotone" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline justify-between gap-1.5">
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white">{round(ciCarbon, 1)}</span>
                <span className="text-xs font-mono text-slate-400">g CO2e</span>
              </div>
              <span className="text-xs font-mono font-medium text-amber-600 dark:text-amber-400">
                {ciPct}%
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
              GitHub Actions runner wattage and missing cache penalties.
            </p>
          </div>
        </div>

        {/* Infra Carbon Card */}
        <div className={`glass-card p-5 rounded-2xl border-l-4 border-l-sky-500 flex flex-col justify-between gap-3 relative overflow-hidden transition-all ${
          infraVal === maxVal && maxVal > 0 ? 'ring-1 ring-sky-500/20' : ''
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Layer 3: Infrastructure
            </span>
            <div className="p-1.5 rounded-lg bg-sky-500/10 text-sky-500 dark:text-sky-400 border border-sky-500/20">
              <HardDrives size={16} weight="duotone" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline justify-between gap-1.5">
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white">{round(infraCarbon, 1)}</span>
                <span className="text-xs font-mono text-slate-400">g CO2e</span>
              </div>
              <span className="text-xs font-mono font-medium text-sky-600 dark:text-sky-400">
                {infraPct}%
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
              IaC configuration topologies and regional grid intensity.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
