const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://sofoeyvkccjdecdrcutc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNvZm9leXZrY2NqZGVjZHJjdXRjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU3NjEyMDQsImV4cCI6MjA2MTMzNzIwNH0.yYoWNLgvrLMMxfjg-wcHKgN7GRQbM_jI6rCml4D4-d0';
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDatabases() {
  console.log('Checking apartments table...');
  const { data: apartments, error: apartmentsError } = await supabase
    .from('apartments')
    .select('*');
  
  console.log('Apartments data:', apartments);
  console.log('Apartments error:', apartmentsError);

  console.log('\nChecking residents table...');
  const { data: residents, error: residentsError } = await supabase
    .from('residents')
    .select('*');
  
  console.log('Residents data:', residents);
  console.log('Residents error:', residentsError);
}

checkDatabases().catch(console.error); 