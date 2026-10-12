import React from 'react';
import { motion } from 'motion/react';
import { 
  Play, 
  ArrowRight, 
  Code, 
  HardDrives, 
  ShieldCheck, 
  CheckCircle, 
  Lightning, 
  Database, 
  GitPullRequest, 
  TerminalWindow
} from '@phosphor-icons/react';
import { useReducedMotion } from '../hooks/useReducedMotion';
import heroPreviewImg from '../assets/hero-preview.jpg';

export default function HomePage({ onGoToDashboard }) {
  const prefersReduced = useReducedMotion();
  const fadeUpProps = prefersReduced
    ? {}
    : {
        initial: { opacity: 0, y: 16 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: '-40px' },
        transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] }
      };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col gap-16 py-4">
      
      {/* Precision Hero Section */}
      <section className="relative overflow-hidden glass-panel-accent p-6 sm:p-10 md:p-12 rounded-3xl shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
          
          {/* Left Column: Value Prop & CTAs (~55% width) */}
          <div className="lg:col-span-7 flex flex-col items-start text-left gap-5">
            {/* Minimalist Eyebrow Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-600 dark:text-emerald-400 text-xs font-mono font-medium tracking-wide">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span>SOFTWARE CARBON INTELLIGENCE</span>
            </div>

            {/* Main Title - Tight, confident typography */}
            <h1 className="text-3xl sm:text-5xl md:text-5xl font-extrabold tracking-[-0.03em] text-slate-900 dark:text-white leading-[1.1]">
              Decarbonize your software stack from{' '}
              <span className="bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
                code to cloud.
              </span>
            </h1>

            {/* Subtitle (<= 20 words per Section 4.7) */}
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed">
              Unified carbon telemetry across AST code patterns, CI/CD runner wattages, and regional cloud infrastructure for modern engineering teams.
            </p>

            {/* Call to Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto pt-2">
              <button
                onClick={onGoToDashboard}
                className="btn-press w-full sm:w-auto bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold px-6 py-3 rounded-xl flex items-center justify-center gap-2 text-sm cursor-pointer shadow-md shadow-emerald-500/20 group"
              >
                <Play size={15} weight="fill" className="text-slate-950" />
                <span>Start Free Audit</span>
                <ArrowRight size={15} weight="bold" className="group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => scrollToSection('three-layers')}
                className="btn-press w-full sm:w-auto px-5 py-3 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-white/[0.04] hover:bg-slate-200 dark:hover:bg-white/[0.08] border border-slate-200 dark:border-white/[0.08] transition cursor-pointer"
              >
                Explore 3-Layer Model
              </button>
            </div>

            {/* Architecture Metrics Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full pt-6 mt-1 border-t border-slate-200 dark:border-white/[0.06]">
              <div className="flex flex-col">
                <span className="text-xl font-bold font-mono text-slate-900 dark:text-white">3 Layers</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">AST, CI/CD, Cloud</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold font-mono text-slate-900 dark:text-white">0.0 - 10.0</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Severity Score</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold font-mono text-slate-900 dark:text-white">Local LLM</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Qwen 2.5 Coder</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold font-mono text-slate-900 dark:text-white">Sub-second</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">TimescaleDB Cache</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Asset (~45% width) */}
          <div className="lg:col-span-5 w-full">
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-white/[0.1] shadow-2xl group bg-slate-950">
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent z-10 pointer-events-none" />
              <img 
                src={heroPreviewImg} 
                alt="Carbotrace carbon intelligence dashboard preview showing repository eco-score and real-time telemetry"
                className="w-full h-auto object-cover transform group-hover:scale-[1.015] transition duration-500 ease-out"
                loading="eager"
              />
              <div className="absolute bottom-3 left-3 right-3 z-20 flex items-center justify-between px-3 py-1.5 rounded-lg bg-slate-950/80 backdrop-blur-md border border-white/10 text-[11px] font-mono text-slate-300">
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Live Telemetry
                </span>
                <span className="text-slate-400">SCI-Standardized</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Tech Stack Integration Strip */}
      <section className="flex flex-col items-center gap-4 py-2" aria-label="Ecosystem Integrations">
        <p className="text-[11px] font-mono text-slate-500 uppercase tracking-widest text-center">
          Seamless integration across your developer infrastructure
        </p>
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs font-mono font-medium text-slate-500 dark:text-slate-400">
          <span className="hover:text-slate-900 dark:hover:text-white transition cursor-default">GitHub Actions</span>
          <span className="text-slate-300 dark:text-slate-700">/</span>
          <span className="hover:text-slate-900 dark:hover:text-white transition cursor-default">Terraform IaC</span>
          <span className="text-slate-300 dark:text-slate-700">/</span>
          <span className="hover:text-slate-900 dark:hover:text-white transition cursor-default">Docker Containers</span>
          <span className="text-slate-300 dark:text-slate-700">/</span>
          <span className="hover:text-slate-900 dark:hover:text-white transition cursor-default">AWS & GCP Cloud</span>
          <span className="text-slate-300 dark:text-slate-700">/</span>
          <span className="hover:text-slate-900 dark:hover:text-white transition cursor-default">Ollama Local AI</span>
        </div>
      </section>

      {/* Three-Layer Carbon Architecture (Bento 2+1 Layout) */}
      <motion.section id="three-layers" className="flex flex-col gap-6 scroll-mt-20" {...fadeUpProps}>
        <div className="max-w-xl flex flex-col gap-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            The Three-Layer Carbon Architecture
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Unifying AST code scanning, CI pipeline execution, and cloud hardware topology into a single verifiable metric.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Layer 1: Code Carbon (7-col primary card) */}
          <div className="lg:col-span-7 glass-card p-6 sm:p-8 rounded-3xl border-l-4 border-l-emerald-500 flex flex-col justify-between gap-6">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                  Layer 1: Code Carbon
                </span>
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
                  <Code size={20} weight="duotone" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Static AST Parsing & Algorithmic Hotspots
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Parses syntax trees via tree-sitter without executing arbitrary code, detecting deeply nested computational loops, oversized package dependencies, and inefficient test durations.
              </p>
            </div>

            <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300 bg-slate-100/60 dark:bg-white/[0.02] p-4 rounded-2xl border border-slate-200 dark:border-white/[0.04]">
              <div className="flex items-start gap-2.5">
                <CheckCircle size={15} weight="fill" className="text-emerald-500 shrink-0 mt-0.5" />
                <span>Detection of O(N²) or higher algorithmic complexity structures.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle size={15} weight="fill" className="text-emerald-500 shrink-0 mt-0.5" />
                <span>Package weight evaluation across PyPI, npm, Maven, and RubyGems.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle size={15} weight="fill" className="text-emerald-500 shrink-0 mt-0.5" />
                <span>Zero execution overhead: safe for proprietary and private repos.</span>
              </div>
            </div>
          </div>

          {/* Layers 2 & 3: CI/CD & Infra (5-col stacked cards) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* Layer 2: CI/CD */}
            <div className="glass-card p-6 sm:p-7 rounded-3xl border-l-4 border-l-amber-500 flex flex-col justify-between gap-4 flex-1">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                    Layer 2: CI/CD Pipeline
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
                    <Lightning size={18} weight="duotone" />
                  </div>
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Runner Matrix & Wattage Profiling
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                  Evaluates GitHub Actions workflow matrix runs, runner hardware wattage (Ubuntu vs macOS vs Windows), and missing cache build penalties.
                </p>
              </div>
            </div>

            {/* Layer 3: Infra */}
            <div className="glass-card p-6 sm:p-7 rounded-3xl border-l-4 border-l-sky-500 flex flex-col justify-between gap-4 flex-1">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider">
                    Layer 3: Infrastructure
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-500">
                    <HardDrives size={18} weight="duotone" />
                  </div>
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Cloud Grid Intensity & PUE
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                  Parses Terraform and CloudFormation to map deployment regions against real-time grid carbon intensity (g CO2e/kWh) and datacenter PUE.
                </p>
              </div>
            </div>

          </div>

        </div>
      </motion.section>

      {/* Carbon Scoring Formula Section (Clean Engineering Spec) */}
      <motion.section className="glass-panel p-6 sm:p-8 rounded-3xl flex flex-col gap-6" {...fadeUpProps}>
        <div className="flex flex-col gap-1.5">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            Carbon Severity Scoring Formulation (0.0 to 10.0)
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 max-w-xl leading-relaxed">
            The Carbon Severity Index normalizes multi-layer footprints into an engineering-grade 10-point scale for CI status checks and reports.
          </p>
        </div>

        {/* Minimalist Formula Display */}
        <div className="bg-slate-950 text-emerald-400 p-4 sm:p-5 rounded-2xl font-mono text-xs overflow-x-auto border border-white/[0.08] shadow-inner">
          <span className="text-slate-500 block mb-1">// SCI Formulation Equation</span>
          <span className="text-emerald-300 font-semibold">
            Total Score = min(10.0, max(0.0, (Code_Carbon / 1000) * 3 + (CI_Carbon / 800) * 2 + (Infra_Carbon / 10000) * 5))
          </span>
        </div>

        {/* Legend */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0"></div>
            <div>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 block">Grade A (0.0 - 2.9)</span>
              <span className="text-[11px] text-slate-600 dark:text-slate-400">Low carbon footprint with optimal caching.</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0"></div>
            <div>
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400 block">Grade B (3.0 - 5.9)</span>
              <span className="text-[11px] text-slate-600 dark:text-slate-400">Moderate severity. Caching advisories detected.</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0"></div>
            <div>
              <span className="text-xs font-bold text-rose-600 dark:text-rose-400 block">Grade C (6.0 - 10.0)</span>
              <span className="text-[11px] text-slate-600 dark:text-slate-400">High severity. Nested loops or dirty grid hubs.</span>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Features Showcase */}
      <motion.section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch" {...fadeUpProps}>
        
        {/* Featured Left Card */}
        <div className="lg:col-span-6 glass-card p-6 sm:p-8 rounded-3xl flex flex-col justify-between gap-5 border-l-4 border-l-emerald-500">
          <div className="flex flex-col gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center">
              <ShieldCheck size={20} weight="duotone" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Privacy-First Local LLM Reasoning</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Optimization recommendations are generated locally via Ollama with zero source code sent to third-party cloud APIs. Your code never leaves your perimeter.
            </p>
          </div>
          <div className="flex items-center gap-2 text-[11px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20 self-start">
            <TerminalWindow size={14} weight="bold" />
            <span>qwen2.5-coder:1.5b</span>
          </div>
        </div>

        {/* Stacked Right Column */}
        <div className="lg:col-span-6 flex flex-col gap-6">
          <div className="glass-card p-6 rounded-3xl flex flex-col gap-2 flex-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/20 text-teal-500 flex items-center justify-center">
                <GitPullRequest size={16} weight="bold" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Pull Request Carbon Diff Automation</h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Posts automated PR comments evaluating carbon deltas between base and head branches, alerting engineers when regressions occur.
            </p>
          </div>

          <div className="glass-card p-6 rounded-3xl flex flex-col gap-2 flex-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-500 flex items-center justify-center">
                <Database size={16} weight="bold" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">TimescaleDB Telemetry Caching</h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Sub-second cached response times for package registry weights and regional grid coefficients ensure zero developer wait time.
            </p>
          </div>
        </div>

      </motion.section>

      {/* Bottom CTA Banner */}
      <motion.section className="glass-panel-accent p-8 md:p-12 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl relative overflow-hidden" {...fadeUpProps}>
        <div className="flex flex-col gap-2 max-w-xl text-center md:text-left">
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Ready to audit your repository?
          </h2>
          <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Enter any public GitHub repository URL or connect your private account to compute instant carbon severity scores and receive actionable GreenOps recommendations.
          </p>
        </div>

        <button
          onClick={onGoToDashboard}
          className="btn-press bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold px-7 py-3.5 rounded-xl flex items-center justify-center gap-2.5 text-sm cursor-pointer shadow-lg shadow-emerald-500/25 shrink-0 group"
        >
          <Play size={15} weight="fill" className="text-slate-950" />
          <span>Go to Dashboard</span>
          <ArrowRight size={15} weight="bold" className="group-hover:translate-x-1 transition-transform" />
        </button>
      </motion.section>

    </div>
  );
}
