
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://teniefzxdikestahdnur.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlbmllZnp4ZGlrZXN0YWhkbnVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg2MjI2NTIsImV4cCI6MjA2NDE5ODY1Mn0.k5eor_-j2aTheb1q6OhGK8DWGjucRWK11eFAOpAZP3I'

console.log('Initializing Supabase client with:', { 
  url: supabaseUrl, 
  key: supabaseKey.substring(0, 20) + '...' 
});

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
    debug: true
  },
  global: {
    headers: {
      'apikey': supabaseKey,
      'Authorization': `Bearer ${supabaseKey}`
    }
  }
})

// Test the connection immediately
supabase.auth.getSession().then(({ data, error }) => {
  console.log('Initial session check:', { data, error });
}).catch(err => {
  console.error('Session check failed:', err);
});
