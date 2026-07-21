import React from 'react';
import { Cpu, Zap, Server } from 'lucide-react';

const round = (num, decimals = 1) => {
  if (num === null || num === undefined) return 0;
  const multiplier = Math.pow(10, decimals);
  return Math.round(num * multiplier) / multiplier;
};

export default function LayerCards({ codeCarbon, ciCarbon, infraCarbon }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      
      {/* Code Carbon Card */}
      <div className="glass-card p-5 rounded-2xl border-l-4 border-l-emerald-500 flex flex-col justify-between gap-3 relative overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Layer 1: Code Carbon</span>
          <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border border-emerald-500/20">
            <Cpu className="w-4 h-4" />
          </div>
        </div>
        <div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold font-mono text-slate-900 dark:text-slate-100">{round(codeCarbon, 1)}</span>
            <span className="text-xs font-mono text-slate-500 dark:text-slate-400">g CO2e</span>
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 leading-snug">
            AST patterns (tree-sitter), package sizes & test suite duration.
          </p>
        </div>
      </div>

      {/* CI Carbon Card */}
      <div className="glass-card p-5 rounded-2xl border-l-4 border-l-amber-500 flex flex-col justify-between gap-3 relative overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Layer 2: CI/CD Pipeline</span>
          <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-500 dark:text-amber-400 border border-amber-500/20">
            <Zap className="w-4 h-4" />
          </div>
        </div>
        <div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold font-mono text-slate-900 dark:text-slate-100">{round(ciCarbon, 1)}</span>
            <span className="text-xs font-mono text-slate-500 dark:text-slate-400">g CO2e</span>
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 leading-snug">
            GitHub Actions runner wattage, matrix builds & missing cache penalties.
          </p>
        </div>
      </div>

      {/* Infra Carbon Card */}
      <div className="glass-card p-5 rounded-2xl border-l-4 border-l-blue-500 flex flex-col justify-between gap-3 relative overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Layer 3: Infrastructure</span>
          <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-500 dark:text-blue-400 border border-blue-500/20">
            <Server className="w-4 h-4" />
          </div>
        </div>
        <div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold font-mono text-slate-900 dark:text-slate-100">{round(infraCarbon, 1)}</span>
            <span className="text-xs font-mono text-slate-500 dark:text-slate-400">g CO2e</span>
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 leading-snug">
            IaC active wattage maps (Terraform) & regional grid carbon intensity.
          </p>
        </div>
      </div>

    </div>
  );
}
