import React from 'react';
import { 
  House, 
  MagnifyingGlass, 
  ClockCounterClockwise, 
  Globe, 
  Sun, 
  Moon, 
  Leaf 
} from '@phosphor-icons/react';
import GithubIcon from './GithubIcon';

export default function Navbar({ activePage, setActivePage, theme, toggleTheme, githubUser, onOpenAuthModal, onOpenRepoModal }) {
  return (
    <header className="glass-panel sticky top-0 z-50 border-b border-slate-200/80 dark:border-white/[0.06] px-4 sm:px-6 py-2.5 backdrop-blur-2xl">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        
        {/* Brand Identity */}
        <div 
          className="flex items-center gap-2.5 cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-xl p-1" 
          onClick={() => setActivePage('home')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setActivePage('home'); }}
        >
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-500 dark:text-emerald-400 group-hover:border-emerald-500/50 transition duration-200">
            <Leaf size={18} weight="fill" />
          </div>
          <div className="flex flex-col">
            <span className="text-[15px] font-bold tracking-tight text-slate-900 dark:text-white">
              Carbotrace
            </span>
            <span className="text-[10px] font-mono text-slate-500 tracking-wider hidden sm:block uppercase">
              Carbon Intelligence
            </span>
          </div>
        </div>

        {/* Navigation Tabs & Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Segmented Page Tabs */}
          <nav className="flex items-center bg-slate-100 dark:bg-white/[0.04] p-1 rounded-xl border border-slate-200 dark:border-white/[0.06]" aria-label="Main Navigation">
            <button 
              onClick={() => setActivePage('home')}
              className={`btn-press px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                activePage === 'home' 
                  ? 'bg-white dark:bg-white/[0.1] text-emerald-600 dark:text-emerald-400 font-semibold shadow-sm border border-slate-200 dark:border-white/[0.08]' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <House size={14} weight={activePage === 'home' ? 'fill' : 'regular'} />
              <span>Home</span>
            </button>

            <button 
              onClick={() => setActivePage('dashboard')}
              className={`btn-press px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                activePage === 'dashboard' 
                  ? 'bg-white dark:bg-white/[0.1] text-emerald-600 dark:text-emerald-400 font-semibold shadow-sm border border-slate-200 dark:border-white/[0.08]' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <MagnifyingGlass size={14} weight={activePage === 'dashboard' ? 'bold' : 'regular'} />
              <span>Dashboard</span>
            </button>

            <button 
              onClick={() => setActivePage('grid-map')}
              className={`btn-press px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                activePage === 'grid-map' 
                  ? 'bg-white dark:bg-white/[0.1] text-emerald-600 dark:text-emerald-400 font-semibold shadow-sm border border-slate-200 dark:border-white/[0.08]' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Globe size={14} weight={activePage === 'grid-map' ? 'bold' : 'regular'} />
              <span>Grid Map</span>
            </button>

            <button 
              onClick={() => setActivePage('history')}
              className={`btn-press px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                activePage === 'history' 
                  ? 'bg-white dark:bg-white/[0.1] text-emerald-600 dark:text-emerald-400 font-semibold shadow-sm border border-slate-200 dark:border-white/[0.08]' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <ClockCounterClockwise size={14} weight={activePage === 'history' ? 'bold' : 'regular'} />
              <span>History</span>
            </button>
          </nav>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            className="btn-press p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.06] transition cursor-pointer flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            {theme === 'dark' ? (
              <Sun size={16} weight="fill" className="text-amber-400" />
            ) : (
              <Moon size={16} weight="fill" className="text-slate-700" />
            )}
          </button>

          {/* GitHub Auth Section */}
          {githubUser ? (
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenRepoModal}
                className="btn-press bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/25 text-emerald-600 dark:text-emerald-400 px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
              >
                <GithubIcon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">My Repositories</span>
              </button>

              <button
                onClick={onOpenAuthModal}
                className="btn-press flex items-center gap-2 p-1 pl-1.5 pr-2.5 rounded-xl bg-slate-100 dark:bg-white/[0.04] hover:bg-slate-200 dark:hover:bg-white/[0.08] border border-slate-200 dark:border-white/[0.06] transition cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                title="Account Settings"
                aria-label={`Account settings for ${githubUser.login}`}
              >
                <img
                  src={githubUser.avatar_url}
                  alt={`${githubUser.login}'s profile picture`}
                  className="w-5 h-5 rounded-md border border-emerald-500/40 object-cover"
                />
                <span className="text-xs font-mono font-medium text-slate-700 dark:text-slate-300 hidden md:inline">
                  @{githubUser.login}
                </span>
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuthModal}
              className="btn-press flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-950 bg-emerald-500 hover:bg-emerald-400 shadow-sm transition cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
            >
              <GithubIcon className="w-3.5 h-3.5" />
              <span>Connect GitHub</span>
            </button>
          )}
        </div>

      </div>
    </header>
  );
}
