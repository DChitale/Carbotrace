import React from 'react';
import { 
  MagnifyingGlass, 
  Play, 
  ArrowClockwise, 
  Warning, 
  Code, 
  Lightning, 
  HardDrives 
} from '@phosphor-icons/react';
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
  hasAnalysis,
  githubUser,
  onOpenRepoModal
}) {
  return (
    <div className={`flex flex-col gap-6 transition-all duration-300 ${!hasAnalysis ? 'py-1' : ''}`}>
      
      {/* Empty State Header (Shown on fresh dashboard load) */}
      {!hasAnalysis && (
        <div className="max-w-2xl flex flex-col gap-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-600 dark:text-emerald-400 text-xs font-mono font-medium tracking-wide self-start">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span>GREENOPS REPOSITORY AUDIT</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Audit repository emissions
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Run static AST analysis, CI/CD power curves, and cloud grid carbon telemetry for any GitHub repository.
          </p>
        </div>
      )}

      {/* Command Bar Search Panel */}
      <div className="glass-panel p-5 sm:p-6 rounded-2xl flex flex-col gap-4 shadow-xl relative overflow-hidden">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
            <GithubIcon className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
            <span>Target Repository</span>
          </span>
          <div className="flex items-center gap-2.5">
            {githubUser && (
              <button
                type="button"
                onClick={onOpenRepoModal}
                className="btn-press text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 bg-emerald-500/10 border border-emerald-500/25 px-2.5 py-1 rounded-lg transition cursor-pointer flex items-center gap-1.5"
              >
                <GithubIcon className="w-3 h-3" />
                <span>Select from My Repositories</span>
              </button>
            )}
            <span className="text-[11px] text-slate-500 font-mono hidden sm:inline">Public & Private Supported</span>
          </div>
        </div>

        <form onSubmit={handleAnalyze} className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <MagnifyingGlass size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
            <input
              type="url"
              placeholder="https://github.com/owner/repository"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              required
              aria-label="GitHub Repository URL"
              className="w-full glass-input rounded-xl py-2.5 pl-10 pr-4 text-xs sm:text-sm placeholder-slate-400 dark:placeholder-slate-500 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="btn-press bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold px-5 py-2.5 rounded-xl transition flex items-center justify-center gap-2 disabled:opacity-50 text-xs sm:text-sm cursor-pointer shadow-sm active:scale-98 shrink-0"
          >
            {isLoading ? (
              <>
                <ArrowClockwise size={15} weight="bold" className="animate-spin text-slate-950" />
                <span>Auditing...</span>
              </>
            ) : (
              <>
                <Play size={14} weight="fill" className="text-slate-950" />
                <span>Run Carbon Audit</span>
              </>
            )}
          </button>
        </form>

        {/* Preset Repositories Quick-Select */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-200/80 dark:border-white/[0.06]">
          <span className="text-[11px] font-mono text-slate-500">Samples:</span>
          {PRESET_REPOS.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setRepoUrl(preset.url)}
              className="btn-press text-[11px] font-mono px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.04] dark:hover:bg-white/[0.08] border border-slate-200 dark:border-white/[0.06] text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition cursor-pointer"
            >
              {preset.label}
            </button>
          ))}
        </div>

        {errorMsg && (
          <div className="bg-rose-500/10 border border-rose-500/25 text-rose-600 dark:text-rose-400 px-4 py-2.5 rounded-xl text-xs flex items-center gap-2.5 animate-fade-scale">
            <Warning size={16} weight="fill" className="shrink-0 text-rose-500" />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>

      {/* Asymmetric Overview Strip (Shown on empty dashboard) */}
      {!hasAnalysis && !isLoading && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 animate-fade-up mt-1">
          
          <div className="lg:col-span-5 glass-card p-5 rounded-2xl flex flex-col justify-between gap-3 border-l-4 border-l-emerald-500">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider">AST Analysis</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
                <Code size={16} weight="duotone" />
              </div>
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Layer 1: Code Carbon</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mt-1">
                Scans Abstract Syntax Trees via tree-sitter to detect nested algorithmic loops, package weights, and test durations.
              </p>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="glass-card p-5 rounded-2xl flex flex-col justify-between gap-3 border-l-4 border-l-amber-500">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono text-amber-600 dark:text-amber-400 font-bold uppercase tracking-wider">CI Execution</span>
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
                  <Lightning size={16} weight="duotone" />
                </div>
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Layer 2: CI/CD Pipeline</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mt-1">
                  Evaluates workflow matrix runner wattages, missing cache penalties, and PR rerun overhead.
                </p>
              </div>
            </div>

            <div className="glass-card p-5 rounded-2xl flex flex-col justify-between gap-3 border-l-4 border-l-sky-500">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono text-sky-600 dark:text-sky-400 font-bold uppercase tracking-wider">Cloud Energy</span>
                <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-500">
                  <HardDrives size={16} weight="duotone" />
                </div>
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Layer 3: Infrastructure</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mt-1">
                  Parses Terraform and CloudFormation for instance wattages and real-time regional grid carbon intensity.
                </p>
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
