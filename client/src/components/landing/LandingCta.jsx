import { useState } from 'react';
import { ArrowRight, Leaf, GithubLogo, BookOpen } from '@phosphor-icons/react';

export function LandingCta({ onAnalyze, loading }) {
  const [repoUrl, setRepoUrl] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (repoUrl.trim()) {
      onAnalyze({ repoUrl: repoUrl.trim() });
    }
  };

  return (
    <section className="landing-cta-section" aria-label="Get started with Carbotrace">
      <div className="landing-cta-card">
        <div className="cta-leaf-glow">
          <Leaf size={44} weight="fill" className="text-emerald" />
        </div>

        <h2 className="cta-headline">
          Every commit carries an energy cost. Start measuring yours.
        </h2>

        <p className="cta-subhead">
          Scan any public repository in under 30 seconds, or integrate the official GitHub Action to audit pull request carbon regressions automatically.
        </p>

        {/* Quick Inline Scan Form */}
        <form onSubmit={handleSubmit} className="cta-scan-form">
          <div className="cta-input-wrapper">
            <GithubLogo size={18} className="cta-input-icon" />
            <input
              type="url"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              placeholder="https://github.com/owner/repository"
              required
              className="cta-input"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !repoUrl.trim()}
            className="btn btn-primary cta-submit-btn"
          >
            <span>{loading ? 'Analyzing...' : 'Scan Repository'}</span>
            <ArrowRight size={15} weight="bold" />
          </button>
        </form>

        {/* Secondary Navigation Links */}
        <div className="cta-links-row">
          <a
            href="https://github.com/DChitale/Carbotrace"
            target="_blank"
            rel="noreferrer"
            className="cta-secondary-link"
          >
            <GithubLogo size={15} />
            <span>GitHub Action Marketplace</span>
          </a>
          <span className="cta-link-separator">·</span>
          <a
            href="http://localhost:8001/docs"
            target="_blank"
            rel="noreferrer"
            className="cta-secondary-link"
          >
            <BookOpen size={15} />
            <span>Interactive API Docs</span>
          </a>
        </div>
      </div>
    </section>
  );
}
