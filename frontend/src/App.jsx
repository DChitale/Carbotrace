import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import GridEnergyMap from './components/GridEnergyMap';
import HeroSearch from './components/HeroSearch';
import LoadingState from './components/LoadingState';
import ScoreGauge from './components/ScoreGauge';
import EmissionsChart from './components/EmissionsChart';
import LayerCards from './components/LayerCard';
import RiskList from './components/RiskList';
import RecommendationCard from './components/RecommendationCard';
import HistoryTable from './components/HistoryTable';
import Footer from './components/Footer';
import GithubAuthModal from './components/GithubAuthModal';
import RepoSelectorModal from './components/RepoSelectorModal';

import { useTheme } from './hooks/useTheme';
import { useGithubAuth } from './hooks/useGithubAuth';
import { useReducedMotion } from './hooks/useReducedMotion';
import { 
  API_BASE_URL,
  checkHealth, 
  fetchHistory as apiFetchHistory, 
  analyzeRepo as apiAnalyzeRepo, 
  fetchRepoDetails, 
  fetchAnalysisDetails 
} from './services/api';

export default function App() {
  const [page, setPage] = useState('home'); // 'home', 'dashboard', 'grid-map', 'history'
  const { theme, toggleTheme } = useTheme();
  const prefersReduced = useReducedMotion();

  const [repoUrl, setRepoUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState('');
  const [currentAnalysis, setCurrentAnalysis] = useState(null);
  const [historyList, setHistoryList] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [scanningRepoUrl, setScanningRepoUrl] = useState('');

  // Modals state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isRepoModalOpen, setIsRepoModalOpen] = useState(false);

  // GitHub Auth Custom Hook
  const {
    githubToken,
    githubUser,
    userRepos,
    isFetchingRepos,
    fetchUserRepos,
    handleSaveToken
  } = useGithubAuth();

  // Fetch scan history
  const loadHistory = async () => {
    try {
      const data = await apiFetchHistory();
      setHistoryList(data);
    } catch (err) {
      console.error('Failed to fetch history:', err);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  // Health check verification
  const checkBackendHealth = async () => {
    const serverUrl = API_BASE_URL.replace(/\/api\/?$/, '');
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);
      await checkHealth(controller.signal);
      clearTimeout(timeoutId);
      return { ok: true };
    } catch (err) {
      if (err.name === 'AbortError') {
        return { ok: false, error: `Backend connection timed out. Make sure FastAPI server is running on ${serverUrl}.` };
      }
      return { ok: false, error: `Backend server is offline or unreachable at ${serverUrl}. Click run_backend.bat or start the server with uvicorn.` };
    }
  };

  // Trigger repository analysis
  const handleAnalyze = async (e, targetUrl, targetBranch) => {
    if (e) e.preventDefault();
    const target = targetUrl || repoUrl;
    if (!target) return;

    setRepoUrl(target);
    setScanningRepoUrl(target);
    setErrorMsg('');
    setCurrentAnalysis(null);

    // Verify backend is reachable before initiating stage UI
    const health = await checkBackendHealth();
    if (!health.ok) {
      setErrorMsg(health.error);
      setScanningRepoUrl('');
      return;
    }

    setIsLoading(true);

    const stages = [
      'Cloning repository statically (shallow depth=1)...',
      'Detecting files and parsing imports/dependencies...',
      'Scanning AST with tree-sitter & checking loop levels...',
      'Analyzing GitHub Actions workflows & Dockerfiles...',
      'Calculating carbon coefficients & running scoring engine...',
      'Running LLM recommendation engine...'
    ];

    let currentStage = 0;
    setLoadingStage(stages[0]);
    const stageInterval = setInterval(() => {
      if (currentStage < stages.length - 1) {
        currentStage++;
        setLoadingStage(stages[currentStage]);
      }
    }, 1500);

    try {
      const data = await apiAnalyzeRepo({
        repoUrl: target,
        branch: targetBranch,
        token: githubToken || null
      });
      clearInterval(stageInterval);

      setCurrentAnalysis(data);
      loadHistory();
      setPage('dashboard');
    } catch (err) {
      clearInterval(stageInterval);
      setErrorMsg(err.message || 'Analysis failed. Make sure the GitHub URL is valid and accessible.');
    } finally {
      setIsLoading(false);
      setScanningRepoUrl('');
    }
  };

  // Trigger fresh scan for current codebase of a historical repo
  const handleScanCurrentCode = async (repo) => {
    setPage('dashboard');
    handleAnalyze(null, repo.url);
  };

  // Select repo from RepoSelectorModal
  const handleSelectRepoFromModal = (repo) => {
    setIsRepoModalOpen(false);
    setPage('dashboard');
    handleAnalyze(null, repo.html_url, repo.default_branch);
  };

  // Load a historical analysis
  const handleLoadAnalysis = async (repo) => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      const repoDetails = await fetchRepoDetails(repo.id);
      if (repoDetails.history && repoDetails.history.length > 0) {
        const fullAnalysis = await fetchAnalysisDetails(repoDetails.history[0].id);
        setCurrentAnalysis(fullAnalysis);
        setRepoUrl(repo.url);
        setPage('dashboard');
      }
    } catch (err) {
      console.error('Failed to load analysis details:', err);
      setErrorMsg('Failed to load analysis details.');
    } finally {
      setIsLoading(false);
    }
  };

  const dashboardAnimProps = prefersReduced
    ? {}
    : {
        initial: { opacity: 0, y: 16 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] }
      };

  return (
    <div className="min-h-[100dvh] bg-[#fbfcfd] dark:bg-[#08090d] text-slate-900 dark:text-slate-100 flex flex-col font-sans relative selection:bg-emerald-500/25 selection:text-emerald-500 transition-colors duration-250">
      
      {/* Precision Ambient Glow & Dot Texture */}
      <div className="ambient-glow" aria-hidden="true" />
      <div className="fixed inset-0 bg-dot-mesh pointer-events-none z-0 opacity-40 dark:opacity-60" aria-hidden="true" />

      {/* Top Navbar */}
      <Navbar 
        activePage={page} 
        setActivePage={setPage} 
        theme={theme} 
        toggleTheme={toggleTheme}
        githubUser={githubUser}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onOpenRepoModal={() => setIsRepoModalOpen(true)}
      />

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 md:px-8 py-6 flex flex-col gap-6 relative z-10">
        
        {/* Home Page */}
        {page === 'home' && (
          <HomePage onGoToDashboard={() => setPage('dashboard')} />
        )}

        {/* Dashboard Analyzer Page */}
        {page === 'dashboard' && (
          <div className="flex flex-col gap-6">
            
            {/* Search Hero Panel */}
            <HeroSearch 
              repoUrl={repoUrl}
              setRepoUrl={setRepoUrl}
              handleAnalyze={handleAnalyze}
              isLoading={isLoading}
              errorMsg={errorMsg}
              hasAnalysis={Boolean(currentAnalysis)}
              githubUser={githubUser}
              onOpenRepoModal={() => setIsRepoModalOpen(true)}
            />

            {/* Loading Indicator */}
            {isLoading && (
              <LoadingState loadingStage={loadingStage} />
            )}

            {/* Analysis Dashboard Grid */}
            {currentAnalysis && !isLoading && (
              <motion.div 
                className="grid grid-cols-1 lg:grid-cols-3 gap-6"
                {...dashboardAnimProps}
              >
                {/* Left Column (1/3): Score Gauge & Emissions Chart */}
                <div className="lg:col-span-1 flex flex-col gap-6">
                  <ScoreGauge totalScore={currentAnalysis.total_score} />
                  
                  <EmissionsChart 
                    codeCarbon={currentAnalysis.code_carbon}
                    ciCarbon={currentAnalysis.ci_carbon}
                    infraCarbon={currentAnalysis.infra_carbon}
                  />
                </div>

                {/* Right Column (2/3): Metrics, Risks, AI Recommendations */}
                <div className="lg:col-span-2 flex flex-col gap-6">
                  <LayerCards 
                    codeCarbon={currentAnalysis.code_carbon}
                    ciCarbon={currentAnalysis.ci_carbon}
                    infraCarbon={currentAnalysis.infra_carbon}
                  />

                  <RiskList risks={currentAnalysis.risks} />

                  <RecommendationCard recommendations={currentAnalysis.recommendations} />
                </div>
              </motion.div>
            )}

          </div>
        )}

        {/* Global Cloud Energy Grid Map */}
        {page === 'grid-map' && (
          <GridEnergyMap />
        )}

        {/* Scan History Page */}
        {page === 'history' && (
          <HistoryTable 
            historyList={historyList}
            handleLoadAnalysis={handleLoadAnalysis}
            handleScanCurrentCode={handleScanCurrentCode}
            setActivePage={setPage}
            scanningRepoUrl={scanningRepoUrl}
          />
        )}

      </main>

      {/* GitHub Authentication Modal */}
      <GithubAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        githubToken={githubToken}
        setGithubToken={(tok) => handleSaveToken(tok, githubUser)}
        githubUser={githubUser}
        setGithubUser={(usr) => handleSaveToken(githubToken, usr)}
        onAuthSuccess={(token, user) => handleSaveToken(token, user)}
      />

      {/* Repository Selector Modal */}
      <RepoSelectorModal
        isOpen={isRepoModalOpen}
        onClose={() => setIsRepoModalOpen(false)}
        repos={userRepos}
        isLoading={isFetchingRepos}
        onRefresh={() => fetchUserRepos(githubToken)}
        onSelectRepo={handleSelectRepoFromModal}
      />

      {/* Footer */}
      <Footer />

    </div>
  );
}
