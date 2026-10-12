import React, { useState, useEffect } from 'react';
import { 
  X, 
  MagnifyingGlass, 
  Lock, 
  Globe, 
  ArrowClockwise, 
  Code, 
  ArrowRight, 
  GitBranch, 
  Calendar, 
  GitFork 
} from '@phosphor-icons/react';
import GithubIcon from './GithubIcon';

export default function RepoSelectorModal({ isOpen, onClose, repos = [], isLoading, onRefresh, onSelectRepo }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all'); // 'all', 'public', 'private'

  // Escape key handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const publicCount = repos.filter(r => !r.private).length;
  const privateCount = repos.filter(r => r.private).length;

  const filteredRepos = repos.filter(repo => {
    const matchesFilter =
      filterType === 'all' ? true : filterType === 'private' ? repo.private : !repo.private;

    const matchesSearch =
      repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      repo.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (repo.description && repo.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (repo.language && repo.language.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesFilter && matchesSearch;
  });

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="repo-modal-title"
    >
      <div className="glass-panel w-full max-w-3xl rounded-2xl p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-white/[0.08] relative flex flex-col max-h-[85vh]">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/[0.06] pb-4 mb-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-500 dark:text-emerald-400">
              <GitFork size={20} weight="bold" />
            </div>
            <div>
              <h3 id="repo-modal-title" className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                My GitHub Repositories
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Select a public or private repository to scan for carbon emissions
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onRefresh}
              disabled={isLoading}
              className="btn-press p-2 rounded-xl text-slate-500 hover:text-emerald-500 dark:text-slate-400 dark:hover:text-emerald-400 hover:bg-slate-200/50 dark:hover:bg-white/[0.05] transition cursor-pointer disabled:opacity-50"
              title="Refresh Repository List"
              aria-label="Refresh repository list"
            >
              <ArrowClockwise size={18} weight="bold" className={isLoading ? 'animate-spin' : ''} />
            </button>
            <button
              onClick={onClose}
              className="btn-press p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-white/[0.05] transition cursor-pointer"
              aria-label="Close modal"
            >
              <X size={20} weight="bold" />
            </button>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-4 shrink-0">
          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <MagnifyingGlass size={16} className="absolute left-3.5 top-2.5 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search repos by name, language..."
              aria-label="Search repositories"
              className="w-full glass-input rounded-xl pl-9 pr-4 py-2 text-xs font-mono outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1 bg-slate-200/60 dark:bg-white/[0.03] border border-slate-300/60 dark:border-white/[0.06] p-1 rounded-xl text-xs w-full sm:w-auto justify-stretch">
            <button
              onClick={() => setFilterType('all')}
              className={`btn-press flex-1 sm:flex-initial px-3 py-1.5 rounded-lg font-medium transition cursor-pointer text-xs ${
                filterType === 'all'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              All ({repos.length})
            </button>
            <button
              onClick={() => setFilterType('public')}
              className={`btn-press flex-1 sm:flex-initial px-3 py-1.5 rounded-lg font-medium transition cursor-pointer flex items-center justify-center gap-1.5 text-xs ${
                filterType === 'public'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Globe size={13} weight="bold" />
              Public ({publicCount})
            </button>
            <button
              onClick={() => setFilterType('private')}
              className={`btn-press flex-1 sm:flex-initial px-3 py-1.5 rounded-lg font-medium transition cursor-pointer flex items-center justify-center gap-1.5 text-xs ${
                filterType === 'private'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Lock size={13} weight="bold" />
              Private ({privateCount})
            </button>
          </div>
        </div>

        {/* Repository List Body */}
        <div className="overflow-y-auto flex-1 pr-1 space-y-2.5">
          {isLoading ? (
            <div className="p-12 text-center text-slate-500 dark:text-slate-400 flex flex-col items-center justify-center gap-3 font-mono text-xs">
              <ArrowClockwise size={24} weight="bold" className="animate-spin text-emerald-500" />
              <span>Fetching repositories from GitHub API...</span>
            </div>
          ) : filteredRepos.length === 0 ? (
            <div className="p-12 text-center text-slate-500 dark:text-slate-400 glass-card rounded-2xl flex flex-col items-center justify-center gap-2">
              <GithubIcon className="w-8 h-8 text-slate-400 dark:text-slate-600 mb-1" />
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-300">No repositories found</p>
              <p className="text-xs text-slate-500">
                {searchQuery ? `No matches for "${searchQuery}"` : 'No repositories available.'}
              </p>
            </div>
          ) : (
            filteredRepos.map((repo) => (
              <div
                key={repo.id}
                className="glass-card p-3.5 rounded-xl border border-slate-200/80 dark:border-white/[0.06] hover:border-emerald-500/40 hover:bg-emerald-500/[0.02] transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
              >
                <div className="flex flex-col gap-1 min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono font-semibold text-xs text-slate-900 dark:text-slate-100 group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition truncate">
                      {repo.full_name}
                    </span>

                    {repo.private ? (
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/25">
                        <Lock size={11} weight="bold" /> Private
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25">
                        <Globe size={11} weight="bold" /> Public
                      </span>
                    )}

                    {repo.language && (
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-200/70 dark:bg-white/[0.04] text-slate-700 dark:text-slate-400 border border-slate-300/80 dark:border-white/[0.06]">
                        <Code size={11} weight="bold" className="text-emerald-500 dark:text-emerald-400" />
                        {repo.language}
                      </span>
                    )}
                  </div>

                  {repo.description && (
                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-1">{repo.description}</p>
                  )}

                  <div className="flex items-center gap-4 text-[11px] font-mono text-slate-500 mt-0.5">
                    <span className="flex items-center gap-1">
                      <GitBranch size={13} className="text-slate-400 dark:text-slate-500" />
                      {repo.default_branch || 'main'}
                    </span>
                    {repo.updated_at && (
                      <span className="flex items-center gap-1">
                        <Calendar size={13} className="text-slate-400 dark:text-slate-500" />
                        Updated {new Date(repo.updated_at).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>

                {/* Audit Action Button */}
                <button
                  onClick={() => onSelectRepo(repo)}
                  className="btn-press bg-emerald-500/10 hover:bg-emerald-500 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 hover:text-slate-950 dark:hover:text-slate-950 font-bold px-3.5 py-1.5 rounded-lg text-xs transition cursor-pointer flex items-center justify-center gap-1.5 shrink-0"
                >
                  <span>Select and Scan</span>
                  <ArrowRight size={13} weight="bold" />
                </button>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}
