import React, { useState, useEffect } from 'react';
import { 
  X, 
  Key, 
  ShieldCheck, 
  ArrowSquareOut, 
  CircleNotch, 
  CheckCircle, 
  WarningCircle, 
  SignOut 
} from '@phosphor-icons/react';
import GithubIcon from './GithubIcon';
import { fetchGithubUser } from '../services/api';

export default function GithubAuthModal({ isOpen, onClose, githubToken, setGithubToken, githubUser, setGithubUser, onAuthSuccess }) {
  const [inputToken, setInputToken] = useState(githubToken || '');
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleVerifyToken = async (e) => {
    e.preventDefault();
    const token = inputToken.trim();
    if (!token) {
      setErrorMsg('Please enter a GitHub Personal Access Token.');
      return;
    }

    setIsVerifying(true);
    setErrorMsg('');

    try {
      const userData = await fetchGithubUser(token);
      setGithubToken(token);
      setGithubUser(userData);
      localStorage.setItem('carbotrace_github_token', token);
      localStorage.setItem('carbotrace_github_user', JSON.stringify(userData));
      if (onAuthSuccess) onAuthSuccess(token, userData);
      onClose();
    } catch (err) {
      setErrorMsg(err.message || 'Invalid GitHub token. Please verify token permissions.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSignOut = () => {
    setGithubToken('');
    setGithubUser(null);
    setInputToken('');
    localStorage.removeItem('carbotrace_github_token');
    localStorage.removeItem('carbotrace_github_user');
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      <div className="glass-panel w-full max-w-lg rounded-2xl p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-white/[0.08] relative flex flex-col gap-6">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close authentication modal"
          className="btn-press absolute top-5 right-5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-xl hover:bg-slate-200/50 dark:hover:bg-white/[0.06] transition cursor-pointer"
        >
          <X size={20} weight="bold" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-500 dark:text-emerald-400">
            <GithubIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 id="auth-modal-title" className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              Sign in with GitHub
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Access your public and private repositories for carbon audits
            </p>
          </div>
        </div>

        {/* If Already Signed In */}
        {githubUser ? (
          <div className="flex flex-col gap-4">
            <div className="glass-card p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 flex items-center gap-4">
              <img
                src={githubUser.avatar_url}
                alt={`${githubUser.login}'s profile avatar`}
                className="w-13 h-13 rounded-xl border border-emerald-500/40 shadow-sm object-cover"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-slate-900 dark:text-white truncate text-sm">{githubUser.name || githubUser.login}</h4>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25">
                    <CheckCircle size={12} weight="fill" /> Connected
                  </span>
                </div>
                <p className="text-xs font-mono text-slate-500 dark:text-slate-400 mt-0.5">@{githubUser.login}</p>
                <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-2 font-mono">
                  <span>{githubUser.public_repos || 0} Public Repos</span>
                  <span>•</span>
                  <span>{githubUser.total_private_repos || 0} Private Repos</span>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-2">
              <button
                onClick={handleSignOut}
                className="btn-press flex items-center gap-2 text-rose-500 dark:text-rose-400 hover:text-rose-600 dark:hover:text-rose-300 text-xs font-semibold px-4 py-2 rounded-xl hover:bg-rose-500/10 transition cursor-pointer border border-rose-500/20"
              >
                <SignOut size={16} weight="bold" />
                <span>Disconnect GitHub</span>
              </button>

              <button
                onClick={onClose}
                className="btn-press bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs transition cursor-pointer shadow-sm"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          /* Sign In Form */
          <form onSubmit={handleVerifyToken} className="flex flex-col gap-5">
            
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Key size={14} weight="bold" className="text-emerald-500 dark:text-emerald-400" />
                  GitHub Personal Access Token (PAT)
                </span>
                <a
                  href="https://github.com/settings/tokens/new?scopes=repo,read:user&description=Carbotrace%20Scan%20Access"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 font-normal"
                >
                  Create PAT on GitHub <ArrowSquareOut size={12} weight="bold" />
                </a>
              </label>

              <div className="relative">
                <input
                  type="password"
                  value={inputToken}
                  onChange={(e) => setInputToken(e.target.value)}
                  placeholder="ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                  aria-label="GitHub Personal Access Token"
                  className="w-full glass-input rounded-xl px-4 py-3 text-xs font-mono outline-none focus:ring-1 focus:ring-emerald-500 transition"
                />
              </div>
            </div>

            {/* Instruction Box */}
            <div className="bg-slate-100/80 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.06] rounded-xl p-4 text-xs text-slate-600 dark:text-slate-400 space-y-2">
              <div className="font-semibold text-slate-900 dark:text-slate-200 flex items-center gap-1.5 text-xs">
                <ShieldCheck size={16} weight="bold" className="text-emerald-500 dark:text-emerald-400" />
                How your token is used:
              </div>
              <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                <li>Enables fetching your <strong>private and public repositories</strong> for audit.</li>
                <li>Allows cloning private repositories during carbon intensity scans.</li>
                <li>Stored securely in your local browser storage. Never saved permanently on servers.</li>
                <li>Requires <code>repo</code> scope for private repo access.</li>
              </ul>
            </div>

            {/* Error message */}
            {errorMsg && (
              <div className="flex items-center gap-2 p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-600 dark:text-rose-400">
                <WarningCircle size={18} weight="fill" className="shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Submit Action */}
            <div className="flex justify-end gap-3 pt-2 border-t border-slate-200 dark:border-white/[0.06]">
              <button
                type="button"
                onClick={onClose}
                className="btn-press px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-white/[0.04] transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isVerifying}
                className="btn-press bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-6 py-2.5 rounded-xl text-xs transition flex items-center gap-2 cursor-pointer disabled:opacity-50 shadow-sm"
              >
                {isVerifying ? (
                  <>
                    <CircleNotch size={16} weight="bold" className="animate-spin" />
                    <span>Verifying Token...</span>
                  </>
                ) : (
                  <>
                    <GithubIcon className="w-4 h-4" />
                    <span>Connect and Load Repos</span>
                  </>
                )}
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}
