@echo off
echo Setting up environment variables for development...

:: Set Supabase environment variables
set NEXT_PUBLIC_SUPABASE_URL=https://yqiqlmlqdjnjbsqopmwo.supabase.co
set NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlxaXFsbWxxZGpuamJzcW9wbXdvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI3NzQxNjQsImV4cCI6MjA1ODM1MDE2NH0.94914ILHwCR0t1gISlAouJwrAzZSU3-gkVHYPQTzIEo

:: Update browserslist database
echo Updating browserslist database...
npm update caniuse-lite --no-save

echo Verifying Supabase connection...
npm run verify-supabase:cjs

echo Environment setup complete!
echo Starting development server...

:: Start development server
npm run dev 