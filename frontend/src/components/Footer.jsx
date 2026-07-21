import React from 'react';
import { Leaf, Shield } from 'lucide-react';
import GithubIcon from './GithubIcon';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800/80 bg-slate-100/90 dark:bg-[#070b14]/90 py-8 px-6 mt-12 backdrop-blur-md relative z-10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-600 dark:text-slate-400">
        
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-md bg-emerald-500/10 text-emerald-500 dark:text-emerald-400">
            <Leaf className="w-4 h-4" />
          </div>
          <span className="font-bold text-slate-900 dark:text-slate-200">Carbotrace</span>
          <span>— Carbon-Aware Software Analytics Dashboard</span>
        </div>

        <div className="flex items-center gap-6 font-mono text-[11px] text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1">
            <Shield className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
            MIT Licensed
          </span>
          <span>FastAPI + TimescaleDB + React</span>
          <a 
            href="https://github.com" 
            target="_blank" 
            rel="noreferrer" 
            className="hover:text-emerald-600 dark:hover:text-emerald-300 transition flex items-center gap-1"
          >
            <GithubIcon className="w-3.5 h-3.5" />
            <span>Repository</span>
          </a>
        </div>

      </div>
    </footer>
  );
}
