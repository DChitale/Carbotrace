import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { RepoSearchBar } from '../components/repo/RepoSearchBar';
import { RepoCard } from '../components/repo/RepoCard';
import { RepoSelector } from '../components/github/RepoSelector';
import { EmptyState } from '../components/shared/EmptyState';
import { ErrorState } from '../components/shared/ErrorState';
import { CardGridSkeleton } from '../components/shared/LoadingState';
import { Leaf, ClockCounterClockwise } from '@phosphor-icons/react';

export function HomePage({ onOpenGithubModal, githubAuth }) {
  const navigate = useNavigate();
  const [analyzing, setAnalyzing] = useState(false);
  const [recentRepos, setRecentRepos] = useState([]);
  const [loadingRecent, setLoadingRecent] = useState(true);
  const [error, setError] = useState(null);
  const [analysisError, setAnalysisError] = useState(null);

  // Fetch recent analyses
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

  const handleAnalyze = async ({ repoUrl, branch, includeLlm }) => {
    setAnalyzing(true);
    setAnalysisError(null);
    try {
      const res = await api.analyzeRepo({
        repoUrl,
        branch,
        includeLlm,
        githubToken: githubAuth.token || null,
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-12)' }}>
      {/* Hero Section */}
      <section style={{ maxWidth: '780px', display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
        <div>
          <h1
            style={{
              fontSize: 'var(--text-3xl)',
              fontWeight: 700,
              letterSpacing: '-0.03em',
              lineHeight: 1.15,
              color: 'var(--text-primary)',
            }}
          >
            Measure your code&apos;s carbon footprint
          </h1>
          <p
            style={{
              fontSize: 'var(--text-base)',
              color: 'var(--text-secondary)',
              marginTop: 'var(--space-2)',
              maxWidth: '600px',
              lineHeight: 1.5,
            }}
          >
            Paste a GitHub URL to calculate software eco-scores, detect architectural inefficiencies, and reduce cloud emissions.
          </p>
        </div>

        {/* Search Bar */}
        <RepoSearchBar
          onAnalyze={handleAnalyze}
          loading={analyzing}
          onOpenGithubModal={onOpenGithubModal}
          isAuthenticated={githubAuth.isAuthenticated}
        />

        {/* Error message during analysis */}
        {analysisError && (
          <ErrorState
            title="Analysis Failed"
            message={analysisError.message}
            error={analysisError}
            onRetry={() => setAnalysisError(null)}
          />
        )}

        {/* GitHub user repo quick picker if authenticated */}
        {githubAuth.isAuthenticated && githubAuth.token && (
          <RepoSelector
            token={githubAuth.token}
            onSelectRepo={(url) => handleAnalyze({ repoUrl: url, includeLlm: true })}
          />
        )}
      </section>

      {/* Recent Analyses Section */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <ClockCounterClockwise size={18} color="var(--text-tertiary)" />
            <h2 style={{ fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--text-primary)' }}>
              Recent Repositories
            </h2>
          </div>

          {recentRepos.length > 0 && (
            <button
              type="button"
              onClick={() => navigate('/history')}
              className="btn btn-ghost btn-sm"
              style={{ color: 'var(--text-secondary)' }}
            >
              View all history →
            </button>
          )}
        </div>

        {loadingRecent ? (
          <CardGridSkeleton count={3} />
        ) : error ? (
          <div style={{ color: 'var(--text-tertiary)', fontSize: 'var(--text-xs)', padding: 'var(--space-4) 0' }}>
            Unable to load recent analyses. Backend may be initializing.
          </div>
        ) : recentRepos.length === 0 ? (
          <EmptyState
            icon={Leaf}
            title="No repositories audited yet"
            description="Enter a GitHub repository URL above to generate your first carbon emission report."
          />
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: 'var(--space-4)',
            }}
          >
            {recentRepos.map((repo) => (
              <RepoCard key={repo.id} repo={repo} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
