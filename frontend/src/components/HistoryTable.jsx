import React, { useState } from 'react';
import { 
  ClockCounterClockwise, 
  ArrowRight, 
  Code, 
  Calendar, 
  Database, 
  MagnifyingGlass, 
  ArrowClockwise, 
  Lightning, 
  CaretDown, 
  CaretUp, 
  Stack 
} from '@phosphor-icons/react';
import GithubIcon from './GithubIcon';

export default function HistoryTable({ historyList, handleLoadAnalysis, handleScanCurrentCode, setActivePage, scanningRepoUrl }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedRepoId, setExpandedRepoId] = useState(null);

  const filteredHistory = historyList.filter((repo) => {
    const term = searchQuery.toLowerCase();
    return (
      repo.name.toLowerCase().includes(term) ||
      repo.owner.toLowerCase().includes(term) ||
      (repo.language && repo.language.toLowerCase().includes(term))
    );
  });

  const toggleExpand = (repoId) => {
    setExpandedRepoId(prev => (prev === repoId ? null : repoId));
  };

  const getScoreColor = (score) => {
    if (!score) return 'text-slate-600 dark:text-slate-400 border-slate-200 dark:border-white/[0.08] bg-slate-100 dark:bg-white/[0.04]';
    if (score >= 85) return 'text-emerald-700 dark:text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
    if (score >= 70) return 'text-teal-700 dark:text-teal-400 border-teal-500/30 bg-teal-500/10';
    if (score >= 50) return 'text-amber-700 dark:text-amber-400 border-amber-500/30 bg-amber-500/10';
    return 'text-rose-700 dark:text-rose-400 border-rose-500/30 bg-rose-500/10';
  };

  return (
    <div className="glass-panel p-6 sm:p-8 rounded-3xl flex flex-col gap-6 animate-fade-up shadow-2xl">
      
      {/* Table Title & Summary Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-white/[0.06] pb-5">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
            <ClockCounterClockwise size={22} weight="bold" className="text-emerald-500 dark:text-emerald-400" />
            <span>Repository Audit History</span>
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            Historical carbon intensity scores, emissions breakdowns, and re-scan triggers for audited repositories.
          </p>
        </div>

        {/* Search Box & Stats */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <MagnifyingGlass size={15} className="absolute left-3.5 top-2.5 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search repositories..."
              aria-label="Search scan history"
              className="bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.08] focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/40 rounded-xl pl-9 pr-4 py-1.5 text-xs font-mono text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 outline-none w-48 sm:w-64 transition-all"
            />
          </div>

          <span className="text-xs font-mono text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.06] px-3 py-1.5 rounded-xl shrink-0 hidden md:inline">
            {historyList.length} Repos Archived
          </span>
        </div>
      </div>

      {/* Empty State */}
      {historyList.length === 0 ? (
        <div className="glass-card p-12 rounded-3xl text-center flex flex-col items-center justify-center gap-4 my-6 border border-slate-200 dark:border-white/[0.06]">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 dark:text-emerald-400">
            <Database size={28} weight="duotone" />
          </div>
          <div>
            <h4 className="text-base font-bold text-slate-900 dark:text-slate-200">No Scan History Found</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 max-w-sm mt-1">
              You haven't analyzed any repositories yet. Start your first scan to archive carbon intensity scores and code efficiency breakdowns here.
            </p>
          </div>
          <button
            onClick={() => setActivePage('dashboard')}
            className="btn-press mt-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold px-5 py-2.5 rounded-xl text-xs transition cursor-pointer shadow-sm"
          >
            Start First Carbon Scan
          </button>
        </div>
      ) : filteredHistory.length === 0 ? (
        <div className="p-12 text-center text-slate-500 dark:text-slate-400 glass-card rounded-2xl">
          <p className="text-sm font-semibold">No historical scans match "{searchQuery}"</p>
        </div>
      ) : (
        /* Repository Cards / Table List */
        <div className="flex flex-col gap-3">
          {filteredHistory.map((repo) => {
            const latestAnalysis = repo.history && repo.history.length > 0 ? repo.history[0] : null;
            const isScanningThisRepo = scanningRepoUrl && (scanningRepoUrl === repo.url || scanningRepoUrl.includes(repo.name));
            const isExpanded = expandedRepoId === repo.id;
            const totalEmissions = latestAnalysis
              ? (latestAnalysis.code_carbon + latestAnalysis.ci_carbon + latestAnalysis.infra_carbon).toFixed(2)
              : null;

            return (
              <div
                key={repo.id}
                className="glass-card rounded-2xl border border-slate-200 dark:border-white/[0.06] hover:border-emerald-500/30 transition-all overflow-hidden"
              >
                {/* Main Row */}
                <div className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  
                  {/* Left Column: Repository Info */}
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.06] text-slate-600 dark:text-slate-400 mt-0.5">
                      <GithubIcon className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono font-bold text-sm text-slate-800 dark:text-slate-200">
                          {repo.owner} / <strong className="text-slate-950 dark:text-white">{repo.name}</strong>
                        </span>

                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.06] text-[11px] font-mono rounded-lg text-slate-700 dark:text-slate-300">
                          <Code size={12} weight="bold" className="text-emerald-500 dark:text-emerald-400" />
                          {repo.language || 'Multi-language'}
                        </span>

                        {repo.history && repo.history.length > 1 && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-mono rounded-lg text-indigo-600 dark:text-indigo-400">
                            <Stack size={12} weight="bold" />
                            {repo.history.length} Audits
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-4 text-xs font-mono text-slate-500 dark:text-slate-400 mt-1.5">
                        <span className="flex items-center gap-1.5">
                          <Calendar size={13} className="text-slate-400 dark:text-slate-500" />
                          {new Date(repo.last_analyzed_at).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Middle Column: Score & Carbon Metrics */}
                  {latestAnalysis && (
                    <div className="flex items-center gap-3.5 py-2 px-3 rounded-xl bg-slate-100/70 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.06] self-start md:self-auto">
                      {/* Eco Score Pill */}
                      <div className="flex flex-col items-center">
                        <span className="text-[10px] font-mono text-slate-500 uppercase">Eco Score</span>
                        <span className={`px-2 py-0.5 rounded-lg border text-xs font-bold font-mono mt-0.5 ${getScoreColor(latestAnalysis.total_score)}`}>
                          {latestAnalysis.total_score.toFixed(1)} / 100
                        </span>
                      </div>

                      <div className="h-6 w-px bg-slate-200 dark:bg-white/[0.08]"></div>

                      {/* Carbon Emissions Pill */}
                      <div className="flex flex-col">
                        <span className="text-[10px] font-mono text-slate-500 uppercase">Emissions</span>
                        <span className="text-xs font-bold font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-0.5">
                          <Lightning size={13} weight="fill" />
                          {totalEmissions} g
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Right Column: Actions */}
                  <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
                    {/* Expand Multi-Run History Button */}
                    {repo.history && repo.history.length > 1 && (
                      <button
                        onClick={() => toggleExpand(repo.id)}
                        className="btn-press p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-white/[0.06] transition cursor-pointer border border-slate-200 dark:border-white/[0.06]"
                        title={isExpanded ? "Collapse History" : "View Scan History Runs"}
                        aria-label={isExpanded ? "Collapse history" : "Expand history runs"}
                      >
                        {isExpanded ? <CaretUp size={15} weight="bold" /> : <CaretDown size={15} weight="bold" />}
                      </button>
                    )}

                    {/* Scan Current Code Option */}
                    <button
                      onClick={() => handleScanCurrentCode(repo)}
                      disabled={isScanningThisRepo}
                      className="btn-press bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-3.5 py-2 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 shadow-sm disabled:opacity-50"
                      title="Re-scan current repo codebase on GitHub"
                    >
                      <ArrowClockwise size={13} weight="bold" className={isScanningThisRepo ? 'animate-spin' : ''} />
                      <span>Re-Scan</span>
                    </button>

                    {/* View Report Button */}
                    <button
                      onClick={() => handleLoadAnalysis(repo)}
                      className="btn-press bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.06] dark:hover:bg-white/[0.1] border border-slate-200 dark:border-white/[0.08] text-slate-800 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white px-3.5 py-2 rounded-xl text-xs font-medium transition cursor-pointer flex items-center gap-1.5"
                    >
                      <span>View</span>
                      <ArrowRight size={13} weight="bold" className="text-slate-400" />
                    </button>
                  </div>

                </div>

                {/* Expandable Multi-Run Audit History */}
                {isExpanded && repo.history && (
                  <div className="border-t border-slate-200 dark:border-white/[0.06] bg-slate-50/50 dark:bg-black/20 p-4 sm:p-5 flex flex-col gap-2.5 animate-fade-in">
                    <h5 className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-2 mb-1">
                      <Stack size={14} weight="bold" className="text-emerald-500 dark:text-emerald-400" />
                      All Scan Versions ({repo.history.length})
                    </h5>

                    <div className="space-y-2">
                      {repo.history.map((analysisRun, idx) => (
                        <div
                          key={analysisRun.id}
                          className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.05] text-xs font-mono"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-slate-500">Run #{repo.history.length - idx}</span>
                            <span className="text-slate-600 dark:text-slate-400">
                              {new Date(analysisRun.created_at).toLocaleString()}
                            </span>
                            {idx === 0 && (
                              <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25 text-[10px]">
                                Latest
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-4">
                            <span className={`px-2 py-0.5 rounded border text-[11px] font-bold ${getScoreColor(analysisRun.total_score)}`}>
                              Score: {analysisRun.total_score.toFixed(1)}
                            </span>
                            <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                              {(analysisRun.code_carbon + analysisRun.ci_carbon + analysisRun.infra_carbon).toFixed(2)} g CO2e
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
