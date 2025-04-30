// Supabase Connection Verification Script (CommonJS version with fix for node-fetch)

// Import node-fetch explcitly for CommonJS
const nodeFetch = require('node-fetch');
global.fetch = nodeFetch;
global.Headers = nodeFetch.Headers;
global.Request = nodeFetch.Request;
global.Response = nodeFetch.Response;

// Import Supabase after setting up fetch
const { createClient } = require('@supabase/supabase-js');

// Fallback values if environment variables are not set
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://sofoeyvkccjdecdrcutc.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNvZm9leXZrY2NqZGVjZHJjdXRjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU3NjEyMDQsImV4cCI6MjA2MTMzNzIwNH0.yYoWNLgvrLMMxfjg-wcHKgN7GRQbM_jI6rCml4D4-d0";

async function verifySupabaseConnection() {
  console.log('\x1b[36m%s\x1b[0m', '=== Verifying Supabase Connection ===');
  console.log('Using URL:', supabaseUrl);
  console.log('Using Anon Key:', supabaseAnonKey.substring(0, 20) + '...');
  
  try {
    // Create a Supabase client
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    console.log('\x1b[33m%s\x1b[0m', 'Connecting to Supabase...');
    
    // Try to make a simple query to verify connection
    const { data, error } = await supabase.from('residents').select('count', { count: 'exact', head: true });
    
    if (error) {
      console.error('\x1b[31m%s\x1b[0m', 'Error connecting to Supabase:');
      console.error(error);
      process.exit(1);
    }
    
    console.log('\x1b[32m%s\x1b[0m', 'Successfully connected to Supabase!');
    console.log('Connection to "residents" table verified.');
    
    // Try to get schema information
    const { data: schemaData, error: schemaError } = await supabase
      .from('residents')
      .select('id')
      .limit(1);
      
    if (schemaError) {
      console.warn('\x1b[33m%s\x1b[0m', 'Warning: Could not fetch schema information.');
      console.warn(schemaError);
    } else {
      console.log('\x1b[32m%s\x1b[0m', 'Schema access successful.');
    }
    
    console.log('\x1b[36m%s\x1b[0m', '=== Verification Complete ===');
    process.exit(0);
  } catch (err) {
    console.error('\x1b[31m%s\x1b[0m', 'Unexpected error:');
    console.error(err);
    process.exit(1);
  }
}

// Add a timeout to ensure we don't hang if the connection can't be established
const timeout = setTimeout(() => {
  console.error('\x1b[31m%s\x1b[0m', 'Connection timed out after 15 seconds');
  console.error('Check your network connection and verify the Supabase URL and key');
  process.exit(1);
}, 15000);

// Clear the timeout if we complete successfully
verifySupabaseConnection().finally(() => clearTimeout(timeout)); 