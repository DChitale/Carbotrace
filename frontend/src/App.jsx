import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import HeroSearch from './components/HeroSearch';
import LoadingState from './components/LoadingState';
import ScoreGauge from './components/ScoreGauge';
import EmissionsChart from './components/EmissionsChart';
import LayerCards from './components/LayerCard';
import RiskList from './components/RiskList';
import RecommendationCard from './components/RecommendationCard';
import HistoryTable from './components/HistoryTable';
import Footer from './components/Footer';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8001/api';

export default function App() {
  const [page, setPage] = useState('home'); // 'home', 'dashboard', 'history'
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
  const [repoUrl, setRepoUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState('');
  const [currentAnalysis, setCurrentAnalysis] = useState(null);
  const [historyList, setHistoryList] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');

  // Handle Theme switching & persistence
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Fetch scan history
  const fetchHistory = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/repos`);
      if (res.ok) {
        const data = await res.json();
        setHistoryList(data);
      }
    } catch (err) {
      console.error('Failed to fetch history:', err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  // Check if backend API server is online
  const checkBackendHealth = async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);
      const res = await fetch(`${API_BASE_URL}/health`, { signal: controller.signal });
      clearTimeout(timeoutId);
      if (!res.ok) {
        return { ok: false, error: `Backend server error (status ${res.status}).` };
      }
      return { ok: true };
    } catch (err) {
      if (err.name === 'AbortError') {
        return { ok: false, error: 'Backend connection timed out. Make sure FastAPI server is running on http://localhost:8001.' };
      }
      return { ok: false, error: 'Backend server is offline or unreachable. Please start the FastAPI backend (e.g., uvicorn backend.app.main:app --reload --port 8001).' };
    }
  };

  // Trigger repository analysis
  const handleAnalyze = async (e) => {
    if (e) e.preventDefault();
    if (!repoUrl) return;

    setErrorMsg('');
    setCurrentAnalysis(null);

    // Verify backend is reachable before initiating stage UI
    const health = await checkBackendHealth();
    if (!health.ok) {
      setErrorMsg(health.error);
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
      const res = await fetch(`${API_BASE_URL}/analyze-repo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repo_url: repoUrl })
      });
      clearInterval(stageInterval);

      if (res.ok) {
        const data = await res.json();
        setCurrentAnalysis(data);
        fetchHistory();
      } else {
        const errData = await res.json();
        setErrorMsg(errData.detail || 'Analysis failed. Make sure the GitHub URL is public and valid.');
      }
    } catch (err) {
      clearInterval(stageInterval);
      setErrorMsg('Failed to connect to backend server. Make sure FastAPI is running on port 8001.');
    } finally {
      setIsLoading(false);
    }
  };

  // Load a historical analysis
  const handleLoadAnalysis = async (repo) => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      const res = await fetch(`${API_BASE_URL}/repos/${repo.id}`);
      if (res.ok) {
        const data = await res.json();
        if (data.history && data.history.length > 0) {
          const latestAnalysisRes = await fetch(`${API_BASE_URL}/analyses/${data.history[0].id}`);
          if (latestAnalysisRes.ok) {
            const fullAnalysis = await latestAnalysisRes.json();
            setCurrentAnalysis(fullAnalysis);
            setRepoUrl(repo.url);
            setPage('dashboard');
          }
        }
      }
    } catch (err) {
      setErrorMsg('Failed to load analysis details.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070b14] text-slate-900 dark:text-slate-100 flex flex-col font-sans relative selection:bg-emerald-500/30 selection:text-emerald-500 transition-colors duration-300">
      
      {/* Ambient Animated Aurora Gradient Blobs */}
      <div className="aurora-bg">
        <div className="aurora-blob aurora-1"></div>
        <div className="aurora-blob aurora-2"></div>
        <div className="aurora-blob aurora-3"></div>
      </div>

      {/* Top Navbar */}
      <Navbar 
        activePage={page} 
        setActivePage={setPage} 
        theme={theme} 
        toggleTheme={toggleTheme} 
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
            />

            {/* Loading Indicator */}
            {isLoading && (
              <LoadingState loadingStage={loadingStage} />
            )}

            {/* Analysis Dashboard Grid */}
            {currentAnalysis && !isLoading && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-up">
                
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

              </div>
            )}

          </div>
        )}

        {/* Scan History Page */}
        {page === 'history' && (
          <HistoryTable 
            historyList={historyList}
            handleLoadAnalysis={handleLoadAnalysis}
            setActivePage={setPage}
          />
        )}

      </main>

      {/* Footer */}
      <Footer />

    </div>
  );
}
