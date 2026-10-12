import React from 'react';

export default function ScoreGauge({ totalScore }) {
  const score = totalScore ? Number(totalScore) : 0;
  
  // Calculate SVG stroke offset (0-100 scale, higher = better)
  const radius = 68;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - Math.min(score, 100) / 100.0);

  // Color dynamics based on eco-score
  const getScoreTheme = () => {
    if (score >= 85) return {
      color: '#10b981',
      badge: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/25',
      label: 'Grade A - Excellent Eco-Score',
      gradient: 'from-emerald-500 to-teal-400 dark:from-emerald-400 dark:to-teal-300'
    };
    if (score >= 60) return {
      color: '#f59e0b',
      badge: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/25',
      label: 'Grade B - Moderate Eco-Score',
      gradient: 'from-amber-500 to-yellow-400 dark:from-amber-400 dark:to-yellow-300'
    };
    return {
      color: '#f43f5e',
      badge: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/25',
      label: 'Grade C - Needs Improvement',
      gradient: 'from-rose-500 to-pink-500 dark:from-rose-400 dark:to-pink-400'
    };
  };

  const theme = getScoreTheme();

  return (
    <div 
      className="glass-panel p-6 rounded-2xl flex flex-col items-center text-center gap-4 relative overflow-hidden transition-all"
      role="region"
      aria-label="Repository Eco-Score Meter"
    >
      <div className="flex items-center justify-between w-full border-b border-slate-200 dark:border-white/[0.06] pb-3">
        <h3 className="text-xs font-mono font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase">
          Eco-Score Rating
        </h3>
        <span className="text-[10px] font-mono text-slate-400">Scale: 0 - 100</span>
      </div>

      {/* SVG Circular Gauge */}
      <div 
        className="relative flex items-center justify-center my-1"
        role="meter"
        aria-valuenow={score}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Eco-Score ${score.toFixed(1)} out of 100`}
      >
        <svg className="w-44 h-44 transform -rotate-90">
          <defs>
            <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={score >= 85 ? '#10b981' : score >= 60 ? '#f59e0b' : '#f43f5e'} />
              <stop offset="100%" stopColor={score >= 85 ? '#14b8a6' : score >= 60 ? '#fbbf24' : '#e11d48'} />
            </linearGradient>
          </defs>
          <circle
            cx="88"
            cy="88"
            r={radius}
            stroke="currentColor"
            className="text-slate-200 dark:text-white/[0.08]"
            strokeWidth="10"
            fill="none"
          />
          <circle
            cx="88"
            cy="88"
            r={radius}
            stroke="url(#scoreGradient)"
            strokeWidth="10"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Central Display */}
        <div className="absolute flex flex-col items-center justify-center">
          <span className="text-4xl font-extrabold tracking-tight font-mono text-slate-900 dark:text-white">
            {score.toFixed(1)}
          </span>
          <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 tracking-wider uppercase mt-0.5">
            Eco-Score
          </span>
        </div>
      </div>

      {/* Grade Badge */}
      <div className={`px-3.5 py-1 rounded-full border text-xs font-semibold ${theme.badge}`}>
        {theme.label}
      </div>

      <p className="text-[11px] text-slate-500 dark:text-slate-400 text-center max-w-[260px] leading-relaxed">
        SCI-standardized eco-score combining code AST weight, CI/CD runner wattage, and cloud infrastructure grid intensity.
      </p>

    </div>
  );
}
