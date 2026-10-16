import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { LandingHero } from '../components/landing/LandingHero';
import { EcosystemStrip } from '../components/landing/EcosystemStrip';
import { BentoFeatures } from '../components/landing/BentoFeatures';
import { ImpactCalculator } from '../components/landing/ImpactCalculator';
import { WorkflowSteps } from '../components/landing/WorkflowSteps';
import { LandingCta } from '../components/landing/LandingCta';
import { RepoCard } from '../components/repo/RepoCard';
import { RepoSelector } from '../components/github/RepoSelector';
import { EmptyState } from '../components/shared/EmptyState';
import { ErrorState } from '../components/shared/ErrorState';
import { CardGridSkeleton } from '../components/shared/LoadingState';
import { ClockCounterClockwise, Leaf, ArrowRight } from '@phosphor-icons/react';

export function HomePage({ onOpenGithubModal, githubAuth }) {
  const navigate = useNavigate();
  const [analyzing, setAnalyzing] = useState(false);
  const [recentRepos, setRecentRepos] = useState([]);
  const [loadingRecent, setLoadingRecent] = useState(true);
  const [error, setError] = useState(null);
  const [analysisError, setAnalysisError] = useState(null);

  // Fetch recent repositories from database
  useEffect(() => {
    let isMounted = true;
    api.listRepos(0, 6)
      .then((data) => {
        if (isMounted) setRecentRepos(data || []);
      })
      .catch((err) => {
        if (isMounted) setError(err.message || 'Failed to load recent repositories');
      })
      .finally(() => {
        if (isMounted) setLoadingRecent(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleAnalyze = async ({ repoUrl, branch, includeLlm = true }) => {
    setAnalyzing(true);
    setAnalysisError(null);
    try {
      const res = await api.analyzeRepo({
        repoUrl,
        branch,
        includeLlm,
        githubToken: githubAuth?.token || null,
      });

      if (res?.id) {
        navigate(`/dashboard/${res.id}`);
      } else {
        throw new Error('Analysis completed but did not return a valid audit ID.');
      }
    } catch (err) {
      setAnalysisError(err);
      setAnalyzing(false);
    }
  };

  return (
    <div className="landing-page-wrapper">
      {/* 1. Viewport-Fitted Hero with Interactive Preview */}
      <LandingHero
        onAnalyze={handleAnalyze}
        loading={analyzing}
        onOpenGithubModal={onOpenGithubModal}
        isAuthenticated={githubAuth?.isAuthenticated}
      />

      {/* Analysis Error Toast/Banner if analysis fails */}
      {analysisError && (
        <div className="landing-error-container">
          <ErrorState
            title="Analysis Failed"
            message={analysisError.message}
            error={analysisError}
            onRetry={() => setAnalysisError(null)}
          />
        </div>
      )}

      {/* GitHub user repo quick picker if authenticated */}
      {githubAuth?.isAuthenticated && githubAuth?.token && (
        <div className="landing-authenticated-picker">
          <RepoSelector
            token={githubAuth.token}
            onSelectRepo={(url) => handleAnalyze({ repoUrl: url, includeLlm: true })}
          />
        </div>
      )}

      {/* 2. Ecosystem & Tooling Logo Wall */}
      <EcosystemStrip />

      {/* 3. 5-Cell Rhythmic Bento Grid */}
      <BentoFeatures />

      {/* 4. Interactive Keynote Carbon Impact Calculator */}
      <ImpactCalculator />

      {/* 5. 3-Step Frictionless Developer Workflow */}
      <WorkflowSteps />

      {/* 6. Live Community Analyses (Database Feed) */}
      <section className="landing-recent-section" aria-label="Recent audits">
        <div className="recent-header-row">
          <div className="recent-header-title">
            <ClockCounterClockwise size={18} className="text-secondary" />
            <h2 className="recent-title">Recent Community Audits</h2>
          </div>

          {recentRepos.length > 0 && (
            <button
              type="button"
              onClick={() => navigate('/history')}
              className="btn btn-ghost btn-sm recent-view-all"
            >
              <span>View full history</span>
              <ArrowRight size={13} weight="bold" />
            </button>
          )}
        </div>

        {loadingRecent ? (
          <CardGridSkeleton count={3} />
        ) : error ? (
          <div className="recent-error-msg">
            Unable to load recent analyses. Backend may still be initializing.
          </div>
        ) : recentRepos.length === 0 ? (
          <EmptyState
            icon={Leaf}
            title="No repositories audited yet"
            description="Enter a GitHub repository URL above to generate your first carbon emission report."
          />
        ) : (
          <div className="recent-repos-grid">
            {recentRepos.map((repo) => (
              <RepoCard key={repo.id} repo={repo} />
            ))}
          </div>
        )}
      </section>

      {/* 7. Final High-Contrast Keynote Call-To-Action */}
      <LandingCta onAnalyze={handleAnalyze} loading={analyzing} />
    </div>
  );
}
