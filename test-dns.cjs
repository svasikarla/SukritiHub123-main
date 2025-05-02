const dns = require('dns');
const https = require('https');

// Test domains
const domains = [
  'yqiqlmlqdjnjbsqopmwo.supabase.co',  // Our Supabase URL
  'supabase.co',                       // Supabase main domain
  'google.com',                        // Common reference domain
  'api.supabase.io'                   // Alternative Supabase domain
];

console.log('Testing DNS resolution for various domains...');

// Add a counter to track when all tests are complete
let testsCompleted = 0;
const totalTests = domains.length + 1; // domains + alternative test

// Test each domain
domains.forEach(domain => {
  console.log(`\nChecking ${domain}...`);
  
  // DNS lookup
  dns.lookup(domain, (err, address, family) => {
    if (err) {
      console.error(`❌ DNS lookup failed for ${domain}:`, err.message);
      checkAllDone();
    } else {
      console.log(`✅ DNS resolved ${domain} to ${address} (IPv${family})`);
      
      // Try HTTP request
      const req = https.request(`https://${domain}`, { method: 'HEAD' }, (res) => {
        console.log(`✅ HTTPS connection to ${domain} successful (Status: ${res.statusCode})`);
        checkAllDone();
      });
      
      req.on('error', (err) => {
        console.error(`❌ HTTPS connection to ${domain} failed:`, err.message);
        checkAllDone();
      });
      
      // Set a timeout for the request
      req.setTimeout(5000, () => {
        console.error(`❌ HTTPS connection to ${domain} timed out`);
        req.destroy();
        checkAllDone();
      });
      
      req.end();
    }
  });
});

// Check if Supabase is accessible via alternate URL
console.log("\nChecking if an alternative Supabase URL works...");
const alternativeUrl = "https://api.supabase.com";

const req = https.request(alternativeUrl, { method: 'HEAD' }, (res) => {
  console.log(`✅ Connection to ${alternativeUrl} successful (Status: ${res.statusCode})`);
  checkAllDone();
});

req.on('error', (err) => {
  console.error(`❌ Connection to ${alternativeUrl} failed:`, err.message);
  checkAllDone();
});

// Set a timeout for the request
req.setTimeout(5000, () => {
  console.error(`❌ Connection to ${alternativeUrl} timed out`);
  req.destroy();
  checkAllDone();
});

req.end();

// Function to check if all tests are done
function checkAllDone() {
  testsCompleted++;
  if (testsCompleted >= totalTests) {
    console.log('\nAll tests completed!');
    console.log('\nImportant conclusion:');
    console.log('If yqiqlmlqdjnjbsqopmwo.supabase.co is not resolvable, you need to:');
    console.log('1. Verify the Supabase URL is correct');
    console.log('2. Check your network connection and DNS settings');
    console.log('3. If the URL is definitely correct, contact Supabase support');
  }
} 