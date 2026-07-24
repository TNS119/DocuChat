const getApiBaseUrl = () => {
  // 1. Explicit env override always wins (production, staging, etc.)
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }

  // 2. SSR / non-browser fallback
  if (typeof window === 'undefined') {
    return 'http://localhost:8000';
  }

  // 3. Local development default
  return 'http://localhost:8000';
};

export const API_BASE_URL = getApiBaseUrl();

console.log("API_BASE_URL =", API_BASE_URL);

export const buildApiUrl = (path) => `${API_BASE_URL}${path}`;

export const createAuthFetch = (setIsAuthenticated, navigate) => {
  return async (url, options = {}) => {
    const fullUrl = url.startsWith('http') ? url : buildApiUrl(url);
    const response = await fetch(fullUrl, {
      credentials: 'include',   
      ...options
    });

    if (response.status === 401) {
      // Token expired or invalid — force logout immediately
      setIsAuthenticated(false);
      navigate('/login', { replace: true });
    }

    return response;
  };
};
