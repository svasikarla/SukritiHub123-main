import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/database.types';

// Get environment variables - Vite uses import.meta.env instead of process.env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Log environment variable status (for debugging)
console.log('Supabase URL available:', !!supabaseUrl);
console.log('Supabase Anon Key available:', !!supabaseAnonKey);

// Fallback to hardcoded values for development only
const devFallbackUrl = 'https://sofoeyvkccjdecdrcutc.supabase.co';
const devFallbackKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNvZm9leXZrY2NqZGVjZHJjdXRjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU3NjEyMDQsImV4cCI6MjA2MTMzNzIwNH0.yYoWNLgvrLMMxfjg-wcHKgN7GRQbM_jI6rCml4D4-d0';

// Use environment variables with fallback for development
const finalSupabaseUrl = supabaseUrl || (import.meta.env.DEV ? devFallbackUrl : '');
const finalSupabaseAnonKey = supabaseAnonKey || (import.meta.env.DEV ? devFallbackKey : '');

// Validate environment variables
if (!finalSupabaseUrl || !finalSupabaseAnonKey) {
  console.error(
    'Supabase URL or key is missing. Make sure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY (or NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY) are set in your environment variables.'
  );
}

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

// Create the Supabase client
export const supabase = createClient<Database>(finalSupabaseUrl, finalSupabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
});

// Utility function to check connection
export async function checkSupabaseConnection() {
  try {
    const { data, error } = await supabase.from('residents').select('count', { count: 'exact', head: true });
    if (error) {
      console.error('Error connecting to Supabase:', error);
      return { success: false, error };
    }
    return { success: true };
  } catch (err) {
    console.error('Error checking Supabase connection:', err);
    return { success: false, error: err };
  }
}