Write-Host "Setting up environment variables for development..." -ForegroundColor Green

# Set Supabase environment variables for the current session
$env:NEXT_PUBLIC_SUPABASE_URL = "https://yqiqlmlqdjnjbsqopmwo.supabase.co"
$env:NEXT_PUBLIC_SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlxaXFsbWxxZGpuamJzcW9wbXdvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI3NzQxNjQsImV4cCI6MjA1ODM1MDE2NH0.94914ILHwCR0t1gISlAouJwrAzZSU3-gkVHYPQTzIEo"

# Update browserslist database
Write-Host "Updating browserslist database..." -ForegroundColor Yellow
npm update caniuse-lite --no-save

# Verify Supabase connection
Write-Host "Verifying Supabase connection..." -ForegroundColor Yellow
npm run verify-supabase:cjs

Write-Host "Environment setup complete!" -ForegroundColor Green
Write-Host "Starting development server..." -ForegroundColor Cyan

# Start development server
npm run dev 