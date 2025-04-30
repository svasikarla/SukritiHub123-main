# Supabase Integration Setup

This document outlines how to properly configure the Supabase integration for this application.

## Environment Configuration

1. Create a `.env.local` file in the root of your project (this file is not committed to version control)
2. Add the following environment variables to your `.env.local` file:

```
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

3. Replace `your_supabase_project_url` with your Supabase project URL (e.g., `https://abcdefghijkl.supabase.co`)
4. Replace `your_supabase_anon_key` with your Supabase anon/public key

## How to Find Your Supabase Credentials

1. Log in to your Supabase dashboard at [app.supabase.com](https://app.supabase.com)
2. Select your project
3. Go to Project Settings > API
4. Under "Project API keys", you'll find:
   - Project URL: Use for `NEXT_PUBLIC_SUPABASE_URL`
   - `anon` `public`: Use for `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Testing the Connection

You can test the Supabase connection with the utility function `checkSupabaseConnection()` exported from `src/integrations/supabase/client.ts`. For example:

```typescript
import { checkSupabaseConnection } from '@/integrations/supabase/client';

// In an async function
const { success, error } = await checkSupabaseConnection();
if (success) {
  console.log('Successfully connected to Supabase!');
} else {
  console.error('Failed to connect to Supabase:', error);
}
```

## Residents Table Schema

The application uses the following Supabase schema for the residents table:

```sql
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
) TABLESPACE pg_default;
```

## Apartments Table Schema

The residents reference an apartments table with this schema:

```sql
create table public.apartments (
  id uuid not null default gen_random_uuid(),
  unit_number text not null,
  created_at timestamp without time zone null default now(),
  constraint apartments_pkey primary key (id)
) TABLESPACE pg_default;
```

For more information on setting up Supabase, refer to the [official Supabase documentation](https://supabase.com/docs). 