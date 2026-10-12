import { useState, useEffect, useCallback } from 'react';
import { fetchUserRepos as apiFetchUserRepos } from '../services/api';

export function useGithubAuth() {
  const [githubToken, setGithubToken] = useState(() => localStorage.getItem('carbotrace_github_token') || '');
  const [githubUser, setGithubUser] = useState(() => {
    const saved = localStorage.getItem('carbotrace_github_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [userRepos, setUserRepos] = useState([]);
  const [isFetchingRepos, setIsFetchingRepos] = useState(false);

  const fetchUserRepos = useCallback(async (token) => {
    const authToken = token || githubToken;
    if (!authToken) return;

    setIsFetchingRepos(true);
    try {
      const data = await apiFetchUserRepos(authToken);
      setUserRepos(data);
    } catch (err) {
      console.error('Failed to fetch user repositories:', err);
    } finally {
      setIsFetchingRepos(false);
    }
  }, [githubToken]);

  const handleSaveToken = useCallback((token, user) => {
    setGithubToken(token);
    setGithubUser(user);
    localStorage.setItem('carbotrace_github_token', token);
    localStorage.setItem('carbotrace_github_user', JSON.stringify(user));
    fetchUserRepos(token);
  }, [fetchUserRepos]);

  const handleClearToken = useCallback(() => {
    setGithubToken('');
    setGithubUser(null);
    setUserRepos([]);
    localStorage.removeItem('carbotrace_github_token');
    localStorage.removeItem('carbotrace_github_user');
  }, []);

  useEffect(() => {
    if (githubToken) {
      fetchUserRepos(githubToken);
    }
  }, [githubToken, fetchUserRepos]);

  return {
    githubToken,
    githubUser,
    userRepos,
    isFetchingRepos,
    fetchUserRepos,
    handleSaveToken,
    handleClearToken
  };
}
