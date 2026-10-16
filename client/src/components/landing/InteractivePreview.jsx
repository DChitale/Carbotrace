import { useState } from 'react';
import {
  Code,
  GitBranch,
  CloudCheck,
  CheckCircle,
  WarningCircle,
  ArrowRight,
  ShieldCheck,
  Lightning,
} from '@phosphor-icons/react';

// Sample real-world repositories with precalculated carbon telemetry
const SAMPLE_REPOS = [
  {
    id: 'fastapi',
    name: 'fastapi/fastapi',
    tag: 'Python Microframework',
    score: 88.4,
    totalCarbon: 64.2,
    codeCarbon: 12.4,
    ciCarbon: 51.8,
    infraCarbon: 0.0,
    rating: 'Top Tier Green',
    color: '#10b981',
    risks: [
      { text: 'Async event loop keeps CPU idle draw minimal', level: 'good' },
      { text: 'GitHub Actions workflow caching active (uv + pip)', level: 'good' },
    ],
    highlight: 'Clean async AST architecture with minimal un-cached build cycles.',
  },
  {
    id: 'react',
    name: 'facebook/react',
    tag: 'JavaScript UI Library',
    score: 43.1,
    totalCarbon: 362.4,
    codeCarbon: 1.9,
    ciCarbon: 360.5,
    infraCarbon: 0.0,
    rating: 'Moderate Intensity',
    color: '#f59e0b',
    risks: [
      { text: 'Extensive multi-browser test matrix consumes heavy runner hours', level: 'warning' },
      { text: '12 parallel build matrices without cross-job cache sharing', level: 'warning' },
    ],
    highlight: 'Codebase is highly optimized, but CI/CD matrix emits significant carbon.',
  },
  {
    id: 'flask',
    name: 'pallets/flask',
    tag: 'WSGI Web Framework',
    score: 10.0,
    totalCarbon: 12275.5,
    codeCarbon: 1588.0,
    ciCarbon: 10687.5,
    infraCarbon: 0.0,
    rating: 'High Carbon Load',
    color: '#ef4444',
    risks: [
      { text: 'Historical un-cached CI matrix runs full test suite on all pushes', level: 'danger' },
      { text: 'Legacy dependency tree with 36 unpinned transitive packages', level: 'danger' },
    ],
    highlight: 'High test redundancy. Introducing smart caching reduces emissions by 83%.',
  },
  {
    id: 'carbotrace',
    name: 'DChitale/Carbotrace',
    tag: 'GreenOps Platform',
    score: 94.0,
    totalCarbon: 18.5,
    codeCarbon: 4.2,
    ciCarbon: 14.3,
    infraCarbon: 0.0,
    rating: 'Ultra-Green Verified',
    color: '#10b981',
    risks: [
      { text: 'Strict PR threshold checks prevent carbon regression', level: 'good' },
      { text: 'Stockholm (eu-north-1) 25g grid zero-carbon hosting', level: 'good' },
    ],
    highlight: 'Built from ground up following Green Software Foundation standards.',
  },
];

export function InteractivePreview({ onSelectRepo }) {
  const [selectedId, setSelectedId] = useState('fastapi');
  const activeRepo = SAMPLE_REPOS.find((r) => r.id === selectedId) || SAMPLE_REPOS[0];

  // SVG Gauge calculations
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (activeRepo.score / 100) * circumference;

  const totalCarbon = activeRepo.totalCarbon;
  const codePct = totalCarbon > 0 ? ((activeRepo.codeCarbon / totalCarbon) * 100).toFixed(0) : 0;
  const ciPct = totalCarbon > 0 ? ((activeRepo.ciCarbon / totalCarbon) * 100).toFixed(0) : 0;
  const infraPct = totalCarbon > 0 ? ((activeRepo.infraCarbon / totalCarbon) * 100).toFixed(0) : 0;

  return (
    <div className="keynote-preview-shell">
      {/* Top Interactive Tabs */}
      <div className="keynote-tabs-header">
        <div className="keynote-tabs-pills">
          {SAMPLE_REPOS.map((repo) => {
            const isSelected = repo.id === selectedId;
            return (
              <button
                key={repo.id}
                type="button"
                onClick={() => setSelectedId(repo.id)}
                className={`keynote-tab-btn ${isSelected ? 'active' : ''}`}
              >
                <span
                  className="tab-dot"
                  style={{ backgroundColor: repo.color }}
                />
                <span className="tab-name">{repo.name}</span>
              </button>
            );
          })}
        </div>

        <span className="keynote-live-pill">
          <Lightning size={12} weight="fill" />
          <span>Live Telemetry Engine</span>
        </span>
      </div>

      {/* Main Showcase Panel */}
      <div className="keynote-body-grid">
        {/* Left: Score Gauge & Key Telemetry */}
        <div className="keynote-gauge-card">
          <div className="gauge-svg-wrap">
            <svg width="120" height="120" viewBox="0 0 100 100" className="gauge-svg">
              {/* Background Ring */}
              <circle
                cx="50"
                cy="50"
                r={radius}
                className="gauge-bg-ring"
              />
              {/* Animated Value Ring */}
              <circle
                cx="50"
                cy="50"
                r={radius}
                className="gauge-val-ring"
                style={{
                  stroke: activeRepo.color,
                  strokeDasharray: circumference,
                  strokeDashoffset: strokeDashoffset,
                }}
              />
            </svg>
            <div className="gauge-center-text">
              <span className="gauge-number">{activeRepo.score.toFixed(0)}</span>
              <span className="gauge-label">Eco-Score</span>
            </div>
          </div>

          <div className="gauge-status-block">
            <div className="gauge-status-title" style={{ color: activeRepo.color }}>
              <ShieldCheck size={16} weight="fill" />
              <span>{activeRepo.rating}</span>
            </div>
            <p className="gauge-status-sub">{activeRepo.highlight}</p>
          </div>

          <div className="gauge-total-emission">
            <span className="emission-label">Total Audit Footprint</span>
            <span className="emission-val">
              {activeRepo.totalCarbon.toLocaleString()} <span className="emission-unit">gCO2e</span>
            </span>
          </div>
        </div>

        {/* Right: 3-Layer Breakdown & Risk Findings */}
        <div className="keynote-details-card">
          {/* Layer Split Header */}
          <div className="keynote-split-header">
            <span className="split-title">Full-Stack Carbon Breakdown</span>
            <span className="split-subtitle">Syntactic AST · CI Pipelines · Cloud Hardware</span>
          </div>

          {/* Proportional Stacked Bar */}
          <div className="keynote-stacked-bar">
            {codePct > 0 && (
              <div
                className="stacked-bar-segment segment-code"
                style={{ width: `${codePct}%` }}
                title={`Code: ${codePct}% (${activeRepo.codeCarbon}g)`}
              />
            )}
            {ciPct > 0 && (
              <div
                className="stacked-bar-segment segment-ci"
                style={{ width: `${ciPct}%` }}
                title={`CI/CD: ${ciPct}% (${activeRepo.ciCarbon}g)`}
              />
            )}
            {infraPct > 0 && (
              <div
                className="stacked-bar-segment segment-infra"
                style={{ width: `${infraPct}%` }}
                title={`Infra: ${infraPct}% (${activeRepo.infraCarbon}g)`}
              />
            )}
          </div>

          {/* 3 Metric Cards */}
          <div className="keynote-layer-metrics-row">
            <div className="layer-metric-pill">
              <div className="layer-metric-icon icon-code">
                <Code size={13} weight="bold" />
              </div>
              <div className="layer-metric-info">
                <span className="layer-metric-name">Code Layer</span>
                <span className="layer-metric-val">{activeRepo.codeCarbon}g ({codePct}%)</span>
              </div>
            </div>

            <div className="layer-metric-pill">
              <div className="layer-metric-icon icon-ci">
                <GitBranch size={13} weight="bold" />
              </div>
              <div className="layer-metric-info">
                <span className="layer-metric-name">CI/CD Layer</span>
                <span className="layer-metric-val">{activeRepo.ciCarbon}g ({ciPct}%)</span>
              </div>
            </div>

            <div className="layer-metric-pill">
              <div className="layer-metric-icon icon-infra">
                <CloudCheck size={13} weight="bold" />
              </div>
              <div className="layer-metric-info">
                <span className="layer-metric-name">Infra Layer</span>
                <span className="layer-metric-val">{activeRepo.infraCarbon}g ({infraPct}%)</span>
              </div>
            </div>
          </div>

          {/* Key Findings List */}
          <div className="keynote-risks-box">
            <span className="risks-box-title">Key Automated Findings</span>
            <div className="risks-list">
              {activeRepo.risks.map((risk, idx) => (
                <div key={idx} className={`risk-item risk-${risk.level}`}>
                  {risk.level === 'good' ? (
                    <CheckCircle size={15} weight="fill" className="risk-icon text-emerald" />
                  ) : (
                    <WarningCircle size={15} weight="fill" className="risk-icon" />
                  )}
                  <span className="risk-text">{risk.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Action */}
          <div className="keynote-card-footer">
            <button
              type="button"
              onClick={() => onSelectRepo(`https://github.com/${activeRepo.name}`)}
              className="keynote-inspect-btn"
            >
              <span>Scan {activeRepo.name} live</span>
              <ArrowRight size={14} weight="bold" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
