import React from 'react';
import { Home, Search, History, ExternalLink, Sun, Moon, Leaf } from 'lucide-react';
import GithubIcon from './GithubIcon';

export default function Navbar({ activePage, setActivePage, theme, toggleTheme }) {
  return (
    <header className="glass-panel sticky top-0 z-50 border-b border-slate-200/80 dark:border-slate-800/80 px-4 sm:px-6 py-3.5 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        
        {/* Brand Identity */}
        <div 
          className="flex items-center gap-2.5 cursor-pointer group" 
          onClick={() => setActivePage('home')}
        >
          <div className="relative flex items-center justify-center">
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl blur-sm opacity-40 group-hover:opacity-80 transition duration-300"></div>
            <div className="relative bg-emerald-500/10 p-2 rounded-xl border border-emerald-500/30 text-emerald-500 dark:text-emerald-400">
              <Leaf className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 dark:from-emerald-300 dark:via-teal-200 dark:to-cyan-300 bg-clip-text text-transparent">
                Carbotrace
              </h1>
              <span className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                v1.0
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium tracking-wide hidden sm:block">
              Carbon-Aware Software Analytics
            </p>
          </div>
        </div>

        {/* Navigation & Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Page Tabs */}
          <nav className="flex items-center bg-slate-200/70 dark:bg-[#090e1a]/80 p-1 rounded-xl border border-slate-300/80 dark:border-slate-800/80">
            
            <button 
              onClick={() => setActivePage('home')}
              className={`px-3 sm:px-4 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                activePage === 'home' 
                  ? 'bg-white dark:bg-slate-800/90 text-emerald-600 dark:text-emerald-300 shadow-sm border border-slate-200 dark:border-slate-700/80' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800/40'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              <span>Home</span>
            </button>

            <button 
              onClick={() => setActivePage('dashboard')}
              className={`px-3 sm:px-4 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                activePage === 'dashboard' 
                  ? 'bg-white dark:bg-slate-800/90 text-emerald-600 dark:text-emerald-300 shadow-sm border border-slate-200 dark:border-slate-700/80' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800/40'
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </button>

            <button 
              onClick={() => setActivePage('history')}
              className={`px-3 sm:px-4 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                activePage === 'history' 
                  ? 'bg-white dark:bg-slate-800/90 text-emerald-600 dark:text-emerald-300 shadow-sm border border-slate-200 dark:border-slate-700/80' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800/40'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>History</span>
            </button>
          </nav>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle Theme"
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-200/70 dark:bg-slate-800/60 hover:bg-slate-300/80 dark:hover:bg-slate-800 border border-slate-300/80 dark:border-slate-800 transition cursor-pointer flex items-center justify-center"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-600" />
            )}
          </button>

          {/* GitHub Link */}
          <a 
            href="https://github.com" 
            target="_blank" 
            rel="noreferrer"
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 bg-slate-200/60 dark:bg-slate-800/40 hover:bg-slate-300/80 dark:hover:bg-slate-800/80 border border-slate-300/80 dark:border-slate-800 transition"
          >
            <GithubIcon className="w-3.5 h-3.5" />
            <span>GitHub</span>
            <ExternalLink className="w-3 h-3 text-slate-400 dark:text-slate-500" />
          </a>

        </div>

      </div>
    </header>
  );
}
