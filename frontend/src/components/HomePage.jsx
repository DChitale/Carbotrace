import React from 'react';
import { 
  Leaf, Play, ArrowRight, Code, Cpu, Server, Shield, Sparkles, 
  CheckCircle2, Zap, BarChart3, Database, GitPullRequest, Terminal, HelpCircle 
} from 'lucide-react';
import GithubIcon from './GithubIcon';

export default function HomePage({ onGoToDashboard }) {
  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col gap-12 py-4 animate-fade-up">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden glass-panel-accent p-8 md:p-14 rounded-3xl flex flex-col items-center text-center gap-6 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Top Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold tracking-wide">
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          <span>Production-Grade Software Carbon Analytics Platform</span>
        </div>

        {/* Main Title */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 max-w-4xl leading-[1.15]">
          Measure & Reduce your Software's{' '}
          <span className="bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
            Carbon Footprint
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-sm sm:text-base md:text-lg text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
          Carbotrace provides GreenOps teams and developers with unified visibility into carbon severity across **Code-level patterns**, **CI/CD build pipelines**, and **Cloud Infrastructure**.
        </p>

        {/* Call to Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mt-2">
          <button
            onClick={onGoToDashboard}
            className="w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold px-8 py-3.5 rounded-2xl transition duration-200 flex items-center justify-center gap-3 text-sm cursor-pointer shadow-lg shadow-emerald-500/25 active:scale-95 group"
          >
            <Play className="w-4 h-4 fill-slate-950 text-slate-950" />
            <span>Go to Dashboard & Scan Repo</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={() => scrollToSection('three-layers')}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-200/60 dark:bg-slate-800/60 hover:bg-slate-300/80 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700/80 transition cursor-pointer"
          >
            Explore 3-Layer Model
          </button>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl mt-6 pt-6 border-t border-slate-200/80 dark:border-slate-800/80">
          <div className="flex flex-col items-center">
            <span className="text-xl md:text-2xl font-extrabold font-mono text-emerald-500 dark:text-emerald-400">3 Layers</span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">Code • CI/CD • Infra</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-xl md:text-2xl font-extrabold font-mono text-teal-500 dark:text-teal-400">0.0 - 10.0</span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">Carbon Severity Score</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-xl md:text-2xl font-extrabold font-mono text-cyan-500 dark:text-cyan-400">Local LLM</span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">Ollama Qwen 2.5 Coder</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-xl md:text-2xl font-extrabold font-mono text-amber-500 dark:text-amber-400">TimescaleDB</span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">Cached Analytics</span>
          </div>
        </div>

      </section>

      {/* Three-Layer Carbon Model Section */}
      <section id="three-layers" className="flex flex-col gap-6 scroll-mt-20">
        <div className="text-center max-w-2xl mx-auto flex flex-col items-center gap-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            The Three-Layer Carbon Model
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Carbotrace bridges isolated developer silos by unifying AST code scanning, CI pipeline execution, and infrastructure hardware maps into a single metric.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Layer 1: Code */}
          <div className="glass-card p-6 rounded-2xl border-t-4 border-t-emerald-500 flex flex-col gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Code className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-mono font-bold text-emerald-500 uppercase tracking-wider block mb-1">
                Layer 1
              </span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Code-Level Carbon</h3>
            </div>
            <ul className="flex flex-col gap-2.5 text-xs text-slate-600 dark:text-slate-300 flex-1">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Abstract Syntax Tree (AST) pattern scanning using <strong className="text-slate-800 dark:text-slate-100">tree-sitter</strong> (detecting nested loops, N+1 query patterns).</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Package dependency size & registry metrics (PyPI, npm, Maven, RubyGems).</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Test suite execution footprint & CodeCarbon physical runtime parsing.</span>
              </li>
            </ul>
          </div>

          {/* Layer 2: CI/CD */}
          <div className="glass-card p-6 rounded-2xl border-t-4 border-t-amber-500 flex flex-col gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-mono font-bold text-amber-500 uppercase tracking-wider block mb-1">
                Layer 2
              </span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">CI/CD Pipeline Carbon</h3>
            </div>
            <ul className="flex flex-col gap-2.5 text-xs text-slate-600 dark:text-slate-300 flex-1">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span>GitHub Actions workflow structure & run frequency matrix analysis.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span>Runner hardware power profile estimations (Ubuntu vs macOS Apple Silicon vs Windows).</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span>Redundant PR build calculations & package caching penalty checks.</span>
              </li>
            </ul>
          </div>

          {/* Layer 3: Infra */}
          <div className="glass-card p-6 rounded-2xl border-t-4 border-t-blue-500 flex flex-col gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Server className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-mono font-bold text-blue-500 uppercase tracking-wider block mb-1">
                Layer 3
              </span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Infrastructure Carbon</h3>
            </div>
            <ul className="flex flex-col gap-2.5 text-xs text-slate-600 dark:text-slate-300 flex-1">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                <span>Infrastructure-as-Code (IaC) parsing for Terraform (<code className="font-mono text-[11px] px-1 py-0.5 rounded bg-slate-200 dark:bg-slate-800">.tf</code>) & CloudFormation.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                <span>Live grid carbon intensity queries via <strong className="text-slate-800 dark:text-slate-100">Electricity Maps API</strong> (with regional PUE maps).</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                <span>AWS Cost Explorer integration for actual cloud instance usage.</span>
              </li>
            </ul>
          </div>

        </div>
      </section>

      {/* Carbon Scoring Formula Section */}
      <section className="glass-panel p-8 rounded-3xl flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <span className="text-xs font-mono font-bold text-emerald-500 uppercase tracking-wider">Scoring Framework</span>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Master Carbon Severity Score (0.0 to 10.0)</h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 max-w-2xl">
            The Carbon Severity Index normalizes multi-layer carbon footprints into a single 10-point scale for easy tracking in pull requests and GreenOps reports.
          </p>
        </div>

        {/* Formula Box */}
        <div className="bg-slate-900 text-emerald-400 p-5 rounded-2xl font-mono text-xs overflow-x-auto border border-emerald-500/30 shadow-inner">
          <p className="text-slate-400 text-[11px] mb-1">// Standardized Carbon Severity Formula</p>
          <p className="font-bold text-emerald-300">
            Total Score = min(10.0, max(0.0, (Code_Carbon / 1000) * 3 + (CI_Carbon / 800) * 2 + (Infra_Carbon / 10000) * 5))
          </p>
        </div>

        {/* Severity Scale Legend */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-emerald-500 shrink-0"></div>
            <div>
              <span className="text-xs font-bold text-emerald-500 block">Grade A (0.0 - 2.9)</span>
              <span className="text-[11px] text-slate-600 dark:text-slate-400">Low carbon footprint & optimized code patterns.</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-amber-500 shrink-0"></div>
            <div>
              <span className="text-xs font-bold text-amber-500 block">Grade B (3.0 - 5.9)</span>
              <span className="text-[11px] text-slate-600 dark:text-slate-400">Moderate carbon severity. Caching optimization advised.</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-rose-500 shrink-0"></div>
            <div>
              <span className="text-xs font-bold text-rose-500 block">Grade C (6.0 - 10.0)</span>
              <span className="text-[11px] text-slate-600 dark:text-slate-400">High carbon severity. Heavy loop nesting or uncached builds.</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="glass-card p-6 rounded-2xl flex flex-col gap-3">
          <div className="p-2 w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <Shield className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Privacy-First Local LLM</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Recommendations are generated locally via Ollama (<code className="font-mono text-[11px]">qwen2.5-coder:1.5b</code>) with **zero code leakage** to external endpoints.
          </p>
        </div>

        <div className="glass-card p-6 rounded-2xl flex flex-col gap-3">
          <div className="p-2 w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center justify-center">
            <GitPullRequest className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">GitHub Action PR Diff</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Automatically posts PR comments comparing base vs head branch carbon delta, warning developers if carbon score exceeds threshold.
          </p>
        </div>

        <div className="glass-card p-6 rounded-2xl flex flex-col gap-3">
          <div className="p-2 w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
            <Database className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">TimescaleDB Caching</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            PostgreSQL-backed cache for PyPI, npm, Maven, and RubyGems package sizes ensure sub-second repo audit times.
          </p>
        </div>

      </section>

      {/* Bottom CTA Banner */}
      <section className="glass-panel-accent p-8 md:p-12 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col gap-2 max-w-xl text-center md:text-left">
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Ready to Audit your Repository?
          </h2>
          <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Paste any public GitHub repository URL to compute its instant carbon severity score and receiving actionable GreenOps recommendations.
          </p>
        </div>

        <button
          onClick={onGoToDashboard}
          className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold px-8 py-4 rounded-2xl transition duration-200 flex items-center justify-center gap-3 text-sm cursor-pointer shadow-lg shadow-emerald-500/30 shrink-0 group active:scale-95"
        >
          <Play className="w-4 h-4 fill-slate-950 text-slate-950" />
          <span>Go to Dashboard</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </section>

    </div>
  );
}
