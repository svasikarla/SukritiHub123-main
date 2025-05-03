// Supabase Edge Function to assign a default role to new users
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create a Supabase client with the Auth context of the function
    const supabaseClient = createClient(
      // Supabase API URL - env var exposed by default when deployed
      Deno.env.get('SUPABASE_URL') ?? '',
      // Supabase API ANON KEY - env var exposed by default when deployed
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      // Create client with Auth context of the user that called the function
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Get the user from the request
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser()
    
    if (userError) {
      throw userError
    }

    if (!user) {
      throw new Error('No user found')
    }

    // Get the "Flat Resident Owner" role (or whatever default role you want to assign)
    const { data: role, error: roleError } = await supabaseClient
      .from('roles')
      .select('id')
      .eq('name', 'Flat Resident Owner')
      .single()

    if (roleError) {
      throw roleError
    }

    // Assign the role to the user
    const { error: assignError } = await supabaseClient
      .from('user_roles')
      .insert({
        user_id: user.id,
        role_id: role.id
      })

    if (assignError) {
      throw assignError
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Default role assigned successfully' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})
