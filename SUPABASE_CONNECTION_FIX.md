# Supabase Connection Issue Fix

## Problem Detected

We've identified that the Supabase URL `yqiqlmlqdjnjbsqopmwo.supabase.co` cannot be resolved. This is causing connection errors when trying to interact with the Supabase database.

## DNS Resolution Test Results

Our tests show:
- ✅ General internet connectivity works (Google.com is accessible)
- ✅ Main Supabase domains work (supabase.co and api.supabase.io)
- ❌ The specific project URL `yqiqlmlqdjnjbsqopmwo.supabase.co` cannot be resolved

## Solutions

There are several possible fixes:

### 1. Create a New Supabase Project

The simplest solution is to create a new Supabase project:

1. Go to [https://app.supabase.com/](https://app.supabase.com/)
2. Login or create an account
3. Create a new project
4. Create the required tables:

```sql
-- First create the apartments table
create table public.apartments (
  id uuid not null default gen_random_uuid(),
  unit_number text not null,
  created_at timestamp without time zone null default now(),
  constraint apartments_pkey primary key (id)
);

-- Then create the residents table with the foreign key
create table public.residents (
  id uuid not null default gen_random_uuid(),
  name text not null,
  phone text null,
  email text null,
  apartment_id uuid null,
  status text null default 'Active'::text,
  created_at timestamp without time zone null default now(),
  constraint residents_pkey primary key (id),
  constraint residents_apartment_id_fkey foreign key (apartment_id) references apartments (id) on delete set null
);
```

5. Get your new project URL and API key from Project Settings > API
6. Update the URL and key in your code

### 2. Update Environment Variables

If you have a working Supabase project, update the environment variables:

1. Create a `.env.local` file with:
```
NEXT_PUBLIC_SUPABASE_URL=https://sofoeyvkccjdecdrcutc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNvZm9leXZrY2NqZGVjZHJjdXRjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU3NjEyMDQsImV4cCI6MjA2MTMzNzIwNH0.yYoWNLgvrLMMxfjg-wcHKgN7GRQbM_jI6rCml4D4-d0
```

2. OR update the fallback values in `src/integrations/supabase/client.ts`:
```javascript
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://your-new-project-url.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "your-new-anon-key";
```

### 3. Use a Local Development Database

For development, you can also run Supabase locally:

1. Install [Supabase CLI](https://supabase.com/docs/guides/cli)
2. Initialize a local project: `supabase init`
3. Start Supabase: `supabase start`
4. Use the local URL: `http://localhost:54321`

## Verifying the Fix

After making changes, run:

```
npm run verify-supabase:cjs
```

If successful, you'll see "Successfully connected to Supabase!" 