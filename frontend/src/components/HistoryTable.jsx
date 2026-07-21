import React from 'react';
import { History, ArrowRight, Code2, Calendar, Database } from 'lucide-react';
import GithubIcon from './GithubIcon';

export default function HistoryTable({ historyList, handleLoadAnalysis, setActivePage }) {
  return (
    <div className="glass-panel p-6 rounded-2xl flex flex-col gap-6 animate-fade-up shadow-2xl">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800/80 pb-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <History className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
            <span>Repository Scan History</span>
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            Previously analyzed public GitHub repositories stored in TimescaleDB cache.
          </p>
        </div>
        <span className="text-xs font-mono text-slate-500 self-start sm:self-auto">
          {historyList.length} Repositories Archived
        </span>
      </div>

      {historyList.length === 0 ? (
        <div className="glass-card p-12 rounded-2xl text-center flex flex-col items-center justify-center gap-4 my-6">
          <div className="w-14 h-14 rounded-2xl bg-slate-200/80 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700/60 flex items-center justify-center text-slate-500">
            <Database className="w-7 h-7" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-300">No Scan History Found</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 max-w-sm mt-1">
              You haven't scanned any repositories yet. Analyze your first repo to see saved scores and carbon breakdowns here.
            </p>
          </div>
          <button
            onClick={() => setActivePage('dashboard')}
            className="mt-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-5 py-2 rounded-xl text-xs transition cursor-pointer"
          >
            Start First Scan
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800/80">
          <table className="w-full text-left text-sm text-slate-700 dark:text-slate-300">
            <thead className="text-[11px] uppercase tracking-wider font-mono bg-slate-100 dark:bg-[#090e1a] text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-6 py-3.5">Repository</th>
                <th className="px-6 py-3.5">Ecosystem</th>
                <th className="px-6 py-3.5">Last Audited</th>
                <th className="px-6 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60 bg-white/40 dark:bg-[#0c1220]/60">
              {historyList.map((repo) => (
                <tr key={repo.id} className="hover:bg-slate-100/60 dark:hover:bg-slate-800/30 transition-colors group">
                  <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-200">
                    <div className="flex items-center gap-2.5">
                      <GithubIcon className="w-4 h-4 text-slate-500 group-hover:text-emerald-500 transition" />
                      <span className="font-mono text-xs text-slate-700 dark:text-slate-200">{repo.owner} / <strong className="text-slate-900 dark:text-white">{repo.name}</strong></span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-200/70 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700/80 text-[11px] font-mono rounded-lg text-slate-700 dark:text-slate-300">
                      <Code2 className="w-3 h-3 text-slate-500 dark:text-slate-400" />
                      {repo.language || 'Multi-language'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs font-mono text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                      <span>{new Date(repo.last_analyzed_at).toLocaleString()}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleLoadAnalysis(repo)}
                      className="bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ml-auto"
                    >
                      <span>Load Analysis</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}
