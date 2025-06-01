
// Authentication service for Railway API
let railwayToken = import.meta.env.VITE_RAILWAY_TOKEN;

export const getToken = (): string | undefined => {
  return railwayToken;
};

export const setToken = (token: string): void => {
  railwayToken = token;
  // Store in localStorage for persistence if needed
  localStorage.setItem('railway_token', token);
};

export const getAuthHeaders = () => {
  return {
    'Authorization': `Bearer ${getToken()}`,
    'Content-Type': 'application/json'
  };
};

export const isTokenValid = (): boolean => {
  return !!railwayToken && railwayToken.length > 20;
};

// Load token from localStorage on startup
export const initializeAuth = (): void => {
  const storedToken = localStorage.getItem('railway_token');
  if (storedToken) {
    railwayToken = storedToken;
  }
};
