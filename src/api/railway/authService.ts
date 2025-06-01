
// Authentication service for Railway API with proper token management
import { supabase } from '@/integrations/supabase/client';

let railwayToken: string | null = null;

// Load Railway token from Supabase secrets
const loadRailwayToken = async (): Promise<string | null> => {
  try {
    // First try to get from environment (for development)
    const envToken = import.meta.env.VITE_RAILWAY_TOKEN;
    if (envToken) {
      railwayToken = envToken;
      return envToken;
    }

    // Try to get from Supabase Edge Function (production)
    const { data, error } = await supabase.functions.invoke('get-railway-token');
    if (data?.token && !error) {
      railwayToken = data.token;
      return data.token;
    }

    return null;
  } catch (error) {
    console.error('Error loading Railway token:', error);
    return null;
  }
};

export const getToken = async (): Promise<string | null> => {
  if (!railwayToken) {
    railwayToken = await loadRailwayToken();
  }
  return railwayToken;
};

export const setToken = (token: string): void => {
  railwayToken = token;
  localStorage.setItem('railway_token', token);
};

export const getAuthHeaders = async () => {
  const token = await getToken();
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
    'X-API-Key': token || ''
  };
};

export const isTokenValid = async (): Promise<boolean> => {
  const token = await getToken();
  return !!token && token.length > 20;
};

export const initializeAuth = async (): Promise<void> => {
  await loadRailwayToken();
};
