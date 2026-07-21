import React from 'react';

export default function ScoreGauge({ totalScore }) {
  const score = totalScore ? Number(totalScore) : 0;
  
  // Calculate SVG stroke offset
  const radius = 68;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - Math.min(score, 10) / 10.0);

  // Color dynamics based on score
  const getScoreTheme = () => {
    if (score < 3.0) return {
      color: '#10b981',
      badge: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
      label: 'Grade A — Low Carbon Severity',
      glow: 'shadow-[0_0_40px_rgba(16,185,129,0.12)]',
      gradient: 'from-emerald-500 to-teal-400 dark:from-emerald-400 dark:to-teal-300'
    };
    if (score < 6.0) return {
      color: '#f59e0b',
      badge: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30',
      label: 'Grade B — Moderate Carbon Severity',
      glow: 'shadow-[0_0_40px_rgba(245,158,11,0.12)]',
      gradient: 'from-amber-500 to-yellow-400 dark:from-amber-400 dark:to-yellow-300'
    };
    return {
      color: '#f43f5e',
      badge: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30',
      label: 'Grade C — High Carbon Severity',
      glow: 'shadow-[0_0_40px_rgba(244,63,94,0.12)]',
      gradient: 'from-rose-500 to-pink-500 dark:from-rose-400 dark:to-pink-400'
    };
  };

  const theme = getScoreTheme();

  return (
    <div className={`glass-panel p-6 rounded-2xl flex flex-col items-center text-center gap-4 relative overflow-hidden transition-all ${theme.glow}`}>
      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="flex items-center justify-between w-full border-b border-slate-200 dark:border-slate-800/80 pb-3">
        <h3 className="text-xs font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase flex items-center gap-1.5">
          <span>Carbon Severity Score</span>
        </h3>
        <span className="text-[10px] font-mono text-slate-500 dark:text-slate-500">Scale: 0.0 - 10.0</span>
      </div>

      {/* SVG Circular Gauge */}
      <div className="relative flex items-center justify-center my-1">
        <svg className="w-44 h-44 transform -rotate-90">
          <defs>
            <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={score < 3.0 ? '#10b981' : score < 6.0 ? '#f59e0b' : '#f43f5e'} />
              <stop offset="100%" stopColor={score < 3.0 ? '#14b8a6' : score < 6.0 ? '#fbbf24' : '#e11d48'} />
            </linearGradient>
          </defs>
          <circle
            cx="88"
            cy="88"
            r={radius}
            stroke="rgba(148, 163, 184, 0.25)"
            strokeWidth="11"
            fill="none"
          />
          <circle
            cx="88"
            cy="88"
            r={radius}
            stroke="url(#scoreGradient)"
            strokeWidth="11"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Central Display */}
        <div className="absolute flex flex-col items-center justify-center">
          <span className={`text-4xl font-extrabold tracking-tight font-mono-val bg-gradient-to-r ${theme.gradient} bg-clip-text text-transparent`}>
            {score.toFixed(2)}
          </span>
          <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 tracking-widest uppercase mt-0.5">
            Severity Index
          </span>
        </div>
      </div>

      {/* Grade Badge */}
      <div className={`px-4 py-1.5 rounded-full border text-xs font-bold ${theme.badge}`}>
        {theme.label}
      </div>

      <p className="text-[11px] text-slate-600 dark:text-slate-400 text-center max-w-[260px] leading-relaxed">
        Composite score weighted across AST pattern complexity, CI build frequencies, and Cloud infrastructure wattage. Lower is cleaner.
      </p>

    </div>
  );
}
