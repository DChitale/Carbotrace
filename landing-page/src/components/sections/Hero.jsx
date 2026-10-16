import { useState } from 'react';
import {
  Sparkle,
  ArrowRight, 
  MagnifyingGlass,
  CheckCircle,
  Cpu,
  GitPullRequest,
  Globe,
  Code,
  Warning,
  TerminalWindow,
} from '@phosphor-icons/react';

export function Hero() {
  const [repoInput, setRepoInput] = useState('https://github.com/');
  const [activeTab, setActiveTab] = useState('code');
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);

  const handleScan = (e) => {
    e.preventDefault();
    if (!repoInput.trim()) return;
    setIsScanning(true);
    setScanComplete(false);
    setTimeout(() => {
      setIsScanning(false);
      setScanComplete(true);
    }, 900);
  };

  return (
    <section className="relative pt-20 md:pt-24 pb-16 md:pb-24 overflow-hidden" aria-label="Hero showcase">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-200 h-90 bg-linear-to-b from-emerald-100/50 dark:from-emerald-950/25 via-zinc-100/30 dark:via-zinc-900/20 to-transparent blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Hero Text Stack (Max 4 Text Elements per design guidelines) */}
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-12">
          {/* 1. Status Eyebrow Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 shadow-sm text-xs font-mono text-zinc-700 dark:text-zinc-300 mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-semibold text-zinc-900 dark:text-white">AST Engine</span>
            <span className="text-zinc-300 dark:text-zinc-700">/</span>
            <span className="text-zinc-500 dark:text-zinc-400">Zero-Config GitHub Audits</span>
          </div>

          {/* 2. Main Headline (Max 2 lines) */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-zinc-950 dark:text-white leading-[1.12] mb-5">
            Stop software carbon debt <br className="hidden sm:inline" />
            <span className="bg-linear-to-r from-emerald-600 to-teal-500 dark:from-emerald-400 dark:to-teal-300 bg-clip-text text-transparent">
              before it reaches production.
            </span>
          </h1>

          {/* 3. Subtext (Max 20 words) */}
          <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-2xl mx-auto mb-8">
            Automated 3-layer carbon intelligence across AST syntax trees, CI/CD runner pipelines, and regional cloud infrastructure.
          </p>

          {/* 4. Interactive Scan Input + CTA Row */}
          <div id="hero-scan" className="max-w-xl mx-auto mb-4">
            <form
              onSubmit={handleScan}
              className="flex items-center p-1.5 rounded-full bg-white dark:bg-zinc-900 border border-zinc-300/90 dark:border-zinc-700/80 shadow-md hover:border-zinc-400 dark:hover:border-zinc-600 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all"
            >
              <div className="pl-3.5 pr-2 text-zinc-400 dark:text-zinc-500 flex items-center">
                <MagnifyingGlass size={18} weight="bold" />
              </div>
              <input
                type="text"
                value={repoInput}
                onChange={(e) => setRepoInput(e.target.value)}
                placeholder="github.com/owner/repository"
                className="w-full bg-transparent text-sm text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none font-mono"
              />
              <button
                type="submit"
                disabled={isScanning}
                className="px-5 py-2.5 rounded-full bg-zinc-950 dark:bg-emerald-500 hover:bg-emerald-600 dark:hover:bg-emerald-400 text-white dark:text-zinc-950 text-xs font-semibold tracking-wide transition-all shadow-sm flex items-center gap-1.5 shrink-0 active:scale-[0.98] disabled:opacity-80"
              >
                {isScanning ? (
                  <span>Scanning AST...</span>
                ) : (
                  <>
                    <span>Scan Repo</span>
                    <ArrowRight size={13} weight="bold" />
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="flex items-center justify-center gap-4 text-xs text-zinc-500 dark:text-zinc-400 font-mono">
            <span>Open Source</span>
            <span>-</span>
            <span>Zero Installation</span>
            <span>-</span>
            <span>Read-only GitHub permissions</span>
          </div>
        </div>

        {/* Hero Visual Asset: CleanShot-style Floating macOS Window Chrome */}
        <div className="relative max-w-5xl mx-auto">
          <div className="rounded-2xl bg-zinc-950 border border-zinc-800/90 shadow-2xl overflow-hidden text-zinc-300 font-sans">
            {/* macOS Window Title Bar */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800/80 bg-zinc-900/60 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500/90 inline-block"></span>
                <span className="w-3 h-3 rounded-full bg-amber-500/90 inline-block"></span>
                <span className="w-3 h-3 rounded-full bg-emerald-500/90 inline-block"></span>
                <span className="ml-2 text-xs font-mono text-zinc-400 flex items-center gap-1.5">
                  <TerminalWindow size={14} />
                  <span>carbotrace audit - expressjs/express</span>
                </span>
              </div>

              {/* View Switcher Tabs inside Window */}
              <div className="hidden sm:flex items-center gap-1 bg-zinc-950/80 p-0.5 rounded-lg border border-zinc-800 text-xs font-mono">
                <button
                  type="button"
                  onClick={() => setActiveTab('code')}
                  className={`px-2.5 py-1 rounded-md transition-colors flex items-center gap-1.5 ${
                    activeTab === 'code' ? 'bg-zinc-800 text-emerald-400 font-medium' : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <Code size={13} />
                  <span>AST Code</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('ci')}
                  className={`px-2.5 py-1 rounded-md transition-colors flex items-center gap-1.5 ${
                    activeTab === 'ci' ? 'bg-zinc-800 text-blue-400 font-medium' : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <GitPullRequest size={13} />
                  <span>CI/CD Gate</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('grid')}
                  className={`px-2.5 py-1 rounded-md transition-colors flex items-center gap-1.5 ${
                    activeTab === 'grid' ? 'bg-zinc-800 text-purple-400 font-medium' : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <Globe size={13} />
                  <span>Cloud Grid</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Audit Grade A-
                </span>
              </div>
            </div>

            {/* Window Content Body */}
            <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 bg-zinc-950">
              {/* Left Code Inspection Pane */}
              <div className="lg:col-span-8 space-y-4">
                <div className="flex items-center justify-between text-xs font-mono text-zinc-400 pb-2 border-b border-zinc-800/80">
                  <span className="text-zinc-300">lib/router/route.js</span>
                  <span className="text-emerald-400 flex items-center gap-1">
                    <CheckCircle size={13} weight="fill" />
                    <span>tree-sitter static pass completed</span>
                  </span>
                </div>

                {/* Code Block with Carbon Cost Callouts */}
                <div className="p-4 rounded-xl bg-zinc-900/90 border border-zinc-800/80 font-mono text-xs sm:text-sm leading-relaxed overflow-x-auto text-zinc-300">
                  <div className="text-zinc-500 select-none">// Layer 1: AST algorithmic intensity check</div>
                  <div className="mt-1">
                    <span className="text-purple-400">Route.prototype.dispatch</span> = <span className="text-blue-400">function</span>(req, res, done) &#123;
                  </div>
                  <div className="pl-4 text-zinc-400">
                    <span className="text-purple-400">var</span> idx = 0;
                  </div>
                  <div className="pl-4 text-zinc-400">
                    <span className="text-purple-400">var</span> stack = this.stack;
                  </div>
                  {/* Flagged Line */}
                  <div className="pl-4 my-2 p-1.5 -ml-1.5 rounded bg-red-950/40 border-l-2 border-red-500 text-red-200 flex items-start justify-between gap-2">
                    <div>
                      <span className="text-red-400 font-bold">for</span> (var i = 0; i &lt; stack.length; i++) &#123; <span className="text-zinc-500">// O(N) linear dispatch</span>
                    </div>
                    <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-red-900/60 text-red-200 shrink-0">
                      +8.4 gCO2e / 10k req
                    </span>
                  </div>
                  <div className="pl-8 text-zinc-400">
                    stack[i].handle_request(req, res, next);
                  </div>
                  <div className="pl-4">&#125;</div>
                  <div>&#125;;</div>

                  {/* Remediation Patch from Local Ollama */}
                  <div className="mt-4 p-2.5 rounded-lg border border-emerald-800/50 bg-emerald-950/30 flex items-start gap-2.5 text-xs text-emerald-300">
                    <Sparkle size={16} weight="fill" className="text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-emerald-200">Local AI Recommendation (qwen2.5-coder):</div>
                      <div className="text-zinc-400 mt-0.5">
                        Compile route middleware handlers into a jump-table trie to reduce instruction cycles by 64%.
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side Telemetry Metrics */}
              <div className="lg:col-span-4 space-y-3">
                <div className="p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800/80 space-y-1">
                  <div className="text-xs font-mono text-zinc-400 uppercase tracking-wider">Estimated Carbon Footprint</div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold font-mono text-emerald-400">18.4</span>
                    <span className="text-xs font-mono text-zinc-400">gCO2e per deploy</span>
                  </div>
                  <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden mt-2">
                    <div className="bg-emerald-500 h-full w-[38%] rounded-full"></div>
                  </div>
                  <div className="text-[11px] text-zinc-500 pt-1 flex justify-between">
                    <span>Target: &lt; 25 gCO2e</span>
                    <span className="text-emerald-400 font-mono">Good Standing</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800/80 space-y-1">
                  <div className="text-xs font-mono text-zinc-400 uppercase tracking-wider">GitHub CI/CD Runner Overhead</div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold font-mono text-blue-400">4m 12s</span>
                    <span className="text-xs font-mono text-zinc-400">ubuntu-latest</span>
                  </div>
                  <div className="text-xs text-zinc-400 mt-1">
                    Layer caching reduces runner wattage by <span className="text-blue-300 font-mono">58%</span> on subsequent runs.
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800/80 space-y-1">
                  <div className="text-xs font-mono text-zinc-400 uppercase tracking-wider">Cloud Deployment Grid</div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-zinc-200">eu-north-1 (Stockholm)</span>
                    <span className="text-xs font-mono text-emerald-400">32 g/kWh</span>
                  </div>
                  <div className="text-xs text-zinc-400">
                    Operating on 94% renewable hydro-electric grid telemetry.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CleanShot-style Side-Floating Quote Card pinned to bottom-right */}
          <div className="mt-4 md:mt-0 md:absolute md:-bottom-6 md:-right-6 md:max-w-xs p-4 rounded-2xl glass-card bg-white/95 dark:bg-zinc-900/95 border border-zinc-200/90 dark:border-zinc-800 shadow-xl text-left">
            <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed font-medium mb-3">
              &quot;Carbotrace caught an un-batched database query that would have cost us 4.2 tons of carbon on AWS this quarter.&quot;
            </p>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-zinc-900 dark:bg-zinc-800 text-emerald-400 font-bold text-xs flex items-center justify-center font-mono border border-zinc-700/60">
                MV
              </div>
              <div>
                <div className="text-xs font-semibold text-zinc-900 dark:text-white">Marcus Vance</div>
                <div className="text-[11px] text-zinc-500 dark:text-zinc-400">Principal SRE, CloudScale Systems</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
