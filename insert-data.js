const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://sofoeyvkccjdecdrcutc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNvZm9leXZrY2NqZGVjZHJjdXRjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU3NjEyMDQsImV4cCI6MjA2MTMzNzIwNH0.yYoWNLgvrLMMxfjg-wcHKgN7GRQbM_jI6rCml4D4-d0';
const supabase = createClient(supabaseUrl, supabaseKey);

async function insertTestData() {
  try {
    // First, clear existing data (optional, but helps prevent duplicates)
    console.log('Clearing existing data...');
    await supabase.from('residents').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('apartments').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    
    console.log('Inserting test apartments...');
    // Insert test apartments
    const { data: apartments, error: apartmentsError } = await supabase
      .from('apartments')
      .insert([
        { 
          block: 'A', 
          flat_number: '101', 
          floor_number: 1, 
          flat_type: '2BHK', 
          area_sqft: 1200, 
          status: 'Occupied' 
        },
        { 
          block: 'A', 
          flat_number: '102', 
          floor_number: 1, 
          flat_type: '3BHK', 
          area_sqft: 1500, 
          status: 'Occupied' 
        },
        { 
          block: 'B', 
          flat_number: '201', 
          floor_number: 2, 
          flat_type: '1BHK', 
          area_sqft: 850, 
          status: 'Available' 
        }
      ])
      .select();
    
    if (apartmentsError) {
      console.error('Error inserting apartments:', apartmentsError);
      return;
    }
    
    console.log('Successfully inserted apartments:', apartments);
    
    // Wait a moment to ensure apartments are saved
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Now get the apartment IDs to use for residents
    const { data: retrievedApartments, error: retrieveError } = await supabase
      .from('apartments')
      .select('id, block, flat_number');
      
    if (retrieveError) {
      console.error('Error retrieving apartments:', retrieveError);
      return;
    }
    
    console.log('Retrieved apartments for reference:', retrievedApartments);
    
    if (retrievedApartments && retrievedApartments.length > 0) {
      console.log('Inserting test residents...');
      
      // Find specific apartments by block/flat number
      const apartment1 = retrievedApartments.find(a => a.block === 'A' && a.flat_number === '101');
      const apartment2 = retrievedApartments.find(a => a.block === 'A' && a.flat_number === '102');
      
      if (!apartment1 || !apartment2) {
        console.error('Could not find the expected apartments');
        return;
      }
      
      // Insert test residents
      const { data: residents, error: residentsError } = await supabase
        .from('residents')
        .insert([
          { 
            name: 'John Doe', 
            email: 'john@example.com', 
            phone: '9876543210', 
            apartment_id: apartment1.id, 
            status: 'Active' 
          },
          { 
            name: 'Jane Smith', 
            email: 'jane@example.com', 
            phone: '8765432109', 
            apartment_id: apartment2.id, 
            status: 'Active' 
          }
        ])
        .select();
      
      if (residentsError) {
        console.error('Error inserting residents:', residentsError);
        return;
      }
      
      console.log('Successfully inserted residents:', residents);
    } else {
      console.log('No apartments found to link residents to');
    }
    
    // Final verification
    const { data: finalCheck } = await supabase
      .from('residents')
      .select('*, apartments(*)');
      
    console.log('Final verification - Residents with apartments:', finalCheck);
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

insertTestData().then(() => console.log('Done!')).catch(console.error); 