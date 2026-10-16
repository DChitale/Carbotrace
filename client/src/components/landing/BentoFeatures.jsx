import { Link } from 'react-router-dom';
import {
  Code,
  GitPullRequest,
  Globe,
  Cpu,
  Clock,
  Sparkle,
  TrendDown,
  ArrowRight,
  Check,
} from '@phosphor-icons/react';

export function BentoFeatures() {
  return (
    <section className="bento-section" aria-label="Core features and capabilities">
      {/* Section Header */}
      <div className="section-header-centered">
        <div className="section-eyebrow">
          <Sparkle size={13} weight="fill" />
          <span>Full-Stack GreenOps Engine</span>
        </div>
        <h2 className="section-title-large">
          Precision engineering for sustainable software
        </h2>
        <p className="section-desc">
          Most tools estimate emissions with high-level guesswork. Carbotrace inspects the real AST syntax tree, GitHub runner minutes, and regional cloud grid coefficients.
        </p>
      </div>

      {/* 5-Cell Rhythmic Bento Grid (2+1, 1+1, 2) */}
      <div className="bento-grid">
        {/* Cell 1: AST Code Intelligence (2 cols) */}
        <div className="bento-cell bento-cell-2col bento-cell-code">
          <div className="cell-content">
            <div className="cell-badge">
              <Code size={14} weight="bold" />
              <span>Layer 1 · Code Layer</span>
            </div>
            <h3 className="cell-title">Abstract Syntax Tree (AST) Inspection</h3>
            <p className="cell-text">
              Scans Python, JavaScript, and TypeScript source code directly. Flags energy-draining algorithmic antipatterns like $O(N^2)$ nested loops and un-batched database queries.
            </p>
          </div>

          {/* Interactive Code Snippet Mockup */}
          <div className="code-audit-snippet">
            <div className="snippet-header">
              <span className="snippet-file">services/scoring_engine.py</span>
              <span className="snippet-tag">AST Risk Flagged</span>
            </div>
            <pre className="snippet-body">
              <code>
                <span className="code-line-dim"># Inefficient nested iteration detected</span>{'\n'}
                <span className="code-kw">for</span> item <span className="code-kw">in</span> dataset:{'\n'}
                {'  '}<span className="code-err">for sub in item.records:  # ⚠️ +14.2 gCO2e</span>{'\n'}
                {'    '}compute_metrics(sub){'\n'}
                <span className="code-fix">✓ Refactor recommendation: vectorize with NumPy (-82% CPU cycles)</span>
              </code>
            </pre>
          </div>
        </div>

        {/* Cell 2: Automated GitHub PR Gate (1 col) */}
        <div className="bento-cell bento-cell-1col bento-cell-pr">
          <div className="cell-content">
            <div className="cell-badge">
              <GitPullRequest size={14} weight="bold" />
              <span>CI/CD Integration</span>
            </div>
            <h3 className="cell-title">Automated PR Audit Comments</h3>
            <p className="cell-text">
              Compares base and feature branches on every commit. Posts automated diff comments and blocks PR merges when emissions spike.
            </p>
          </div>

          {/* Simulated PR Comment */}
          <div className="simulated-pr-comment">
            <div className="pr-comment-header">
              <div className="pr-bot-avatar">
                <Check size={12} weight="bold" />
              </div>
              <span className="pr-bot-name">carbotrace-audit[bot]</span>
              <span className="pr-status-badge">▲ +0.26 Score</span>
            </div>
            <div className="pr-comment-body">
              <div className="pr-metric-row">
                <span>Code Layer</span>
                <span className="text-danger">+4.8 gCO2e</span>
              </div>
              <div className="pr-metric-row">
                <span>CI/CD Layer</span>
                <span className="text-secondary">0.0 gCO2e</span>
              </div>
              <div className="pr-threshold-alert">
                <span>⚠️ Exceeds delta threshold (0.10)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Cell 3: Global Grid Telemetry (1 col) */}
        <div className="bento-cell bento-cell-1col bento-cell-grid">
          <div className="cell-content">
            <div className="cell-badge">
              <Globe size={14} weight="bold" />
              <span>Layer 3 · Infrastructure</span>
            </div>
            <h3 className="cell-title">Live Regional Grid Intensity</h3>
            <p className="cell-text">
              Real-world grid carbon factors across 15+ global cloud regions with facility Power Usage Effectiveness (PUE).
            </p>
          </div>

          {/* Mini Region Radar Box */}
          <div className="mini-region-radar">
            <div className="radar-row radar-clean">
              <div className="radar-dot dot-emerald" />
              <span className="radar-name">Stockholm (eu-north-1)</span>
              <span className="radar-val">25g</span>
            </div>
            <div className="radar-row radar-moderate">
              <div className="radar-dot dot-amber" />
              <span className="radar-name">N. Virginia (us-east-1)</span>
              <span className="radar-val">380g</span>
            </div>
            <div className="radar-row radar-high">
              <div className="radar-dot dot-rose" />
              <span className="radar-name">Mumbai (ap-south-1)</span>
              <span className="radar-val">708g</span>
            </div>
            <Link to="/map" className="radar-explore-link">
              <span>Open Interactive Grid Map</span>
              <ArrowRight size={12} weight="bold" />
            </Link>
          </div>
        </div>

        {/* Cell 4: Privacy-First Local AI (1 col) */}
        <div className="bento-cell bento-cell-1col bento-cell-ai">
          <div className="cell-content">
            <div className="cell-badge">
              <Cpu size={14} weight="bold" />
              <span>Local AI Engine</span>
            </div>
            <h3 className="cell-title">Privacy-First AI via Ollama</h3>
            <p className="cell-text">
              Runs lightweight LLM coding models (<code className="cell-code-pill">qwen2.5-coder:1.5b</code>) locally on your hardware. Zero data transmission to third-party APIs.
            </p>
          </div>

          <div className="local-ai-card">
            <div className="ai-terminal-header">
              <span className="terminal-dot dot-red" />
              <span className="terminal-dot dot-yellow" />
              <span className="terminal-dot dot-green" />
              <span className="terminal-title">ollama://qwen2.5-coder</span>
            </div>
            <div className="ai-terminal-body">
              <span className="terminal-prompt">$ carbotrace suggest --local</span>
              <p className="terminal-response">
                &gt; Replaced un-indexed filter with dictionary lookup.{'\n'}
                &gt; Estimated energy savings: <strong>-18.4% CPU draw</strong>.
              </p>
            </div>
          </div>
        </div>

        {/* Cell 5: CI/CD Pipeline Profiler (2 cols) */}
        <div className="bento-cell bento-cell-2col bento-cell-cicd">
          <div className="cell-content">
            <div className="cell-badge">
              <Clock size={14} weight="bold" />
              <span>Layer 2 · CI/CD Layer</span>
            </div>
            <h3 className="cell-title">Runner Runtime & Cache Optimization</h3>
            <p className="cell-text">
              CI runners burn electrical wattage every minute they compile. Carbotrace identifies missing layer caches, redundant test matrixes, and idle runner sprawl.
            </p>
          </div>

          {/* Before / After Comparison Visual */}
          <div className="cicd-comparison-visual">
            <div className="comparison-track track-before">
              <div className="track-info">
                <span className="track-title">Un-cached Matrix</span>
                <span className="track-stats">42 min · 315 gCO2e</span>
              </div>
              <div className="track-bar bar-long">
                <div className="bar-fill fill-red" style={{ width: '88%' }} />
              </div>
            </div>

            <div className="comparison-track track-after">
              <div className="track-info">
                <span className="track-title">Carbotrace Optimized</span>
                <span className="track-stats text-emerald">6 min · 45 gCO2e</span>
              </div>
              <div className="track-bar bar-short">
                <div className="bar-fill fill-emerald" style={{ width: '15%' }} />
              </div>
            </div>

            <div className="comparison-savings-callout">
              <TrendDown size={18} weight="bold" className="text-emerald" />
              <span>-85% Runner Energy Reduction</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
