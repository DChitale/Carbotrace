import { Sparkle } from '@phosphor-icons/react';
import { RepoSearchBar } from '../repo/RepoSearchBar';
import { InteractivePreview } from './InteractivePreview';

export function LandingHero({ onAnalyze, loading, onOpenGithubModal, isAuthenticated }) {
  return (
    <section className="landing-hero-section" aria-label="Hero showcase">
      {/* Hero Header Copy (Strictly Viewport Fitted & Max 4 Text Elements) */}
      <div className="hero-copy-block">
        <div className="hero-eyebrow">
          <Sparkle size={13} weight="fill" />
          <span>The Software Carbon Intelligence Platform</span>
        </div>

        <h1 className="hero-headline">
          Measure your code&apos;s carbon footprint.
        </h1>

        <p className="hero-subtext">
          Audit GitHub repositories across AST syntax, CI/CD pipelines, and cloud infra. Stop carbon regressions before deploy.
        </p>

        {/* Primary Scan Bar */}
        <div className="hero-search-wrapper">
          <RepoSearchBar
            onAnalyze={onAnalyze}
            loading={loading}
            onOpenGithubModal={onOpenGithubModal}
            isAuthenticated={isAuthenticated}
          />
        </div>
      </div>

      {/* Interactive Product Showcase (Keynote Moment) */}
      <div className="hero-preview-container">
        <InteractivePreview
          onSelectRepo={(url) => onAnalyze({ repoUrl: url, includeLlm: true })}
        />
      </div>
    </section>
  );
}
