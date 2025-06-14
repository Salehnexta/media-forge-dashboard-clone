
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://teniefzxdikestahdnur.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlbmllZnp4ZGlrZXN0YWhkbnVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQxOTU2MzMsImV4cCI6MjA0OTc3MTYzM30.1bGTaGN1rUZO8aMhL7gQ4GnPUmxZYngtaFH8LnCr5XI'

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  }
})

console.log('Supabase client initialized with URL:', supabaseUrl)
