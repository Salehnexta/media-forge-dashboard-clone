
import { createClient } from '@supabase/supabase-js'

// Use environment variables if available, fallback to hardcoded values
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://teniefzxdikestahdnur.supabase.co'
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlbmllZnp4ZGlrZXN0YWhkbnVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg2MjI2NTIsImV4cCI6MjA2NDE5ODY1Mn0.k5eor_-j2aTheb1q6OhGK8DWGjucRWK11eFAOpAZP3I'

console.log('Supabase Configuration:', {
  url: supabaseUrl,
  key: supabaseKey ? supabaseKey.substring(0, 50) + '...' : 'NOT SET',
  env: import.meta.env.MODE
});

// Validate required configuration
if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase configuration. Please check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  }
})

// Test connection on initialization
supabase.auth.getSession().then(({ data, error }) => {
  if (error) {
    console.error('Supabase session check failed:', error);
  } else {
    console.log('Supabase client initialized successfully');
  }
}).catch(err => {
  console.error('Supabase initialization error:', err);
});
