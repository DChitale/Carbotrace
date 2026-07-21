import React from 'react';
import { Search, Play, RefreshCw, AlertTriangle, Code, Cpu, Server, Sparkles } from 'lucide-react';
import GithubIcon from './GithubIcon';

const PRESET_REPOS = [
  { label: 'facebook/react', url: 'https://github.com/facebook/react' },
  { label: 'expressjs/express', url: 'https://github.com/expressjs/express' },
  { label: 'pallets/flask', url: 'https://github.com/pallets/flask' },
  { label: 'fastapi/fastapi', url: 'https://github.com/fastapi/fastapi' }
];

export default function HeroSearch({ 
  repoUrl, 
  setRepoUrl, 
  handleAnalyze, 
  isLoading, 
  errorMsg, 
  hasAnalysis 
}) {
  return (
    <div className={`flex flex-col gap-6 transition-all duration-500 ${!hasAnalysis ? 'py-2' : ''}`}>
      
      {/* Hero Header (Shown prominent on empty dashboard) */}
      {!hasAnalysis && (
        <div className="text-center max-w-3xl mx-auto flex flex-col items-center gap-3 animate-fade-up">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 dark:text-emerald-400 text-xs font-semibold tracking-wide">
            <Sparkles className="w-3.5 h-3.5" />
            <span>GreenOps Static & Runtime Carbon Engine</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 leading-tight">
            Measure & Reduce your Software's{' '}
            <span className="bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 dark:from-emerald-400 dark:via-teal-300 dark:to-cyan-400 bg-clip-text text-transparent">
              Carbon Footprint
            </span>
          </h2>
          <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 max-w-xl leading-relaxed">
            Audit AST code patterns, CI/CD pipeline triggers, and cloud infrastructure directly from any GitHub repository.
          </p>
        </div>
      )}

      {/* Search Bar Panel */}
      <div className="glass-panel p-6 rounded-2xl flex flex-col gap-4 animate-fade-up delay-100 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-200 flex items-center gap-2">
            <GithubIcon className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
            <span>Target Repository</span>
          </h3>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">Public GitHub Repositories Supported</span>
        </div>

        <form onSubmit={handleAnalyze} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
            <input
              type="url"
              placeholder="https://github.com/owner/repository"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              required
              className="w-full glass-input rounded-xl py-3 pl-11 pr-4 text-sm placeholder-slate-400 dark:placeholder-slate-500 font-mono focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="relative group bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold px-6 py-3 rounded-xl transition duration-200 flex items-center justify-center gap-2 disabled:opacity-50 text-sm cursor-pointer shadow-lg shadow-emerald-500/20 active:scale-95 shrink-0"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-slate-950 text-slate-950" />
                <span>Run Carbon Audit</span>
              </>
            )}
          </button>
        </form>

        {/* Preset Repositories Quick-Select */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-200 dark:border-slate-800/60">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Try quick sample:</span>
          {PRESET_REPOS.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setRepoUrl(preset.url)}
              className="text-xs font-mono px-2.5 py-1 rounded-lg bg-slate-200/60 hover:bg-slate-300/80 dark:bg-slate-800/40 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700/60 text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-300 transition cursor-pointer"
            >
              {preset.label}
            </button>
          ))}
        </div>

        {errorMsg && (
          <div className="bg-rose-500/10 border border-rose-500/25 text-rose-600 dark:text-rose-300 px-4 py-3 rounded-xl text-xs flex items-center gap-2.5 animate-fade-scale">
            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-500 dark:text-rose-400" />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>

      {/* Feature Showcase Grid (Shown on empty dashboard) */}
      {!hasAnalysis && !isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 animate-fade-up delay-200 mt-2">
          
          <div className="glass-card p-5 rounded-2xl flex flex-col gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 dark:text-emerald-400">
              <Code className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">Layer 1: AST Code Footprint</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Scans Abstract Syntax Trees via tree-sitter to detect nested loops, heavy package imports, and unoptimized test runs.
            </p>
          </div>

          <div className="glass-card p-5 rounded-2xl flex flex-col gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 dark:text-amber-400">
              <Cpu className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">Layer 2: CI/CD Pipeline Carbon</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Calculates workflow matrix execution times, hardware wattages, caching penalties, and redundant PR build costs.
            </p>
          </div>

          <div className="glass-card p-5 rounded-2xl flex flex-col gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 dark:text-blue-400">
              <Server className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">Layer 3: Infrastructure IaC</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Parses Terraform and CloudFormation for cloud instance types, grid carbon intensity (Electricity Maps), and embodied carbon.
            </p>
          </div>

        </div>
      )}

    </div>
  );
}
