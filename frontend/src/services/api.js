export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

/**
 * Health check endpoint
 */
export async function checkHealth(signal) {
  const res = await fetch(`${API_BASE_URL}/health`, { signal });
  if (!res.ok) throw new Error(`Health check failed: ${res.status}`);
  return res.json();
}

/**
 * Fetch scan history
 */
export async function fetchHistory() {
  const res = await fetch(`${API_BASE_URL}/repos`);
  if (!res.ok) throw new Error(`Failed to fetch history: ${res.status}`);
  return res.json();
}

/**
 * Fetch user repositories using GitHub PAT
 */
export async function fetchUserRepos(token) {
  if (!token) return [];
  const res = await fetch(`${API_BASE_URL}/github/user-repos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token })
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Failed to fetch repositories');
  }
  return res.json();
}

/**
 * Validate GitHub token & fetch profile
 */
export async function fetchGithubUser(token) {
  const res = await fetch(`${API_BASE_URL}/github/user`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token })
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Failed to validate token');
  }
  return res.json();
}

/**
 * Trigger repository carbon analysis
 */
export async function analyzeRepo({ repoUrl, branch = 'main', token = null }) {
  const payload = {
    repo_url: repoUrl.trim(),
    branch: branch || 'main'
  };
  if (token) {
    payload.github_token = token;
  }

  const res = await fetch(`${API_BASE_URL}/analyze-repo`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.detail || 'Analysis failed. Please check repository URL or backend logs.');
  }
  return data;
}

/**
 * Fetch repo details by ID
 */
export async function fetchRepoDetails(repoId) {
  const res = await fetch(`${API_BASE_URL}/repos/${repoId}`);
  if (!res.ok) throw new Error(`Failed to fetch repo ${repoId}`);
  return res.json();
}

/**
 * Fetch specific analysis by ID
 */
export async function fetchAnalysisDetails(analysisId) {
  const res = await fetch(`${API_BASE_URL}/analyses/${analysisId}`);
  if (!res.ok) throw new Error(`Failed to fetch analysis ${analysisId}`);
  return res.json();
}
