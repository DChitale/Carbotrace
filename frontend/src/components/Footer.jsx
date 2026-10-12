import React from 'react';
import { Leaf, ShieldCheck } from '@phosphor-icons/react';
import GithubIcon from './GithubIcon';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-white/[0.06] bg-slate-50/80 dark:bg-[#08090d]/80 py-8 px-6 mt-16 backdrop-blur-md relative z-10 transition-colors duration-250">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
        
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-md bg-emerald-500/10 text-emerald-500 dark:text-emerald-400">
            <Leaf size={15} weight="fill" />
          </div>
          <span className="font-bold text-slate-900 dark:text-white">Carbotrace</span>
          <span className="text-slate-400 dark:text-slate-600">/</span>
          <span>Carbon-Aware Software Analytics</span>
        </div>

        <div className="flex items-center gap-6 font-mono text-[11px] text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1.5">
            <ShieldCheck size={14} weight="bold" className="text-emerald-500 dark:text-emerald-400" />
            MIT Licensed
          </span>
          <span className="hidden sm:inline">FastAPI + TimescaleDB + React</span>
          <a 
            href="https://github.com/DChitale/Carbotrace" 
            target="_blank" 
            rel="noreferrer" 
            className="hover:text-emerald-600 dark:hover:text-emerald-400 transition flex items-center gap-1.5 font-sans"
            aria-label="View Carbotrace repository on GitHub"
          >
            <GithubIcon className="w-3.5 h-3.5" />
            <span>Repository</span>
          </a>
        </div>

      </div>
    </footer>
  );
}
