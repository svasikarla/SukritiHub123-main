// Script to create the initial Super Admin user
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';

// Setup environment variables
dotenv.config({ path: '.env.local' });

// Alternative way to load env variables if dotenv doesn't work
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Try to read .env.local directly if dotenv doesn't work
try {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    const envContent = fs.readFileSync('.env.local', 'utf8');
    const envVars = envContent.split('\n');
    
    envVars.forEach(line => {
      const [key, value] = line.split('=');
      if (key && value) {
        process.env[key.trim()] = value.trim();
      }
    });
  }
} catch (error) {
  console.log('Could not read .env.local file directly:', error);
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // This is different from the anon key

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase URL or service role key. Check your .env.local file.');
  process.exit(1);
}

// Create Supabase client with service role key for admin operations
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupAdmin() {
  const adminEmail = process.argv[2];
  const adminPassword = process.argv[3];

  if (!adminEmail || !adminPassword) {
    console.error('Usage: node setup-admin.js <admin-email> <admin-password>');
    process.exit(1);
  }
  
  console.log('Supabase URL:', supabaseUrl);

  try {
    // 1. Create the user in auth
    console.log(`Creating user with email: ${adminEmail}...`);
    const { data: userData, error: userError } = await supabase.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true // Auto-confirm the email
    });

    if (userError) {
      throw userError;
    }

    console.log('User created successfully:', userData.user.id);

    // 2. Get the Super Admin role ID
    console.log('Fetching Super Admin role...');
    const { data: roleData, error: roleError } = await supabase
      .from('roles')
      .select('id')
      .eq('name', 'Super Admin')
      .single();

    if (roleError) {
      throw roleError;
    }

    if (!roleData) {
      console.log('Super Admin role not found. Creating it...');
      
      // Create the Super Admin role if it doesn't exist
      const { data: newRole, error: createRoleError } = await supabase
        .from('roles')
        .insert({
          name: 'Super Admin',
          description: 'Complete access to the app. Leadership at RWA'
        })
        .select()
        .single();
      
      if (createRoleError) {
        throw createRoleError;
      }
      
      roleData = newRole;
    }

    console.log('Super Admin role ID:', roleData.id);

    // 3. Assign the Super Admin role to the user
    console.log('Assigning Super Admin role to user...');
    const { error: assignError } = await supabase
      .from('user_roles')
      .insert({
        user_id: userData.user.id,
        role_id: roleData.id
      });

    if (assignError) {
      throw assignError;
    }

    console.log('✅ Super Admin user setup completed successfully!');
    console.log(`You can now login with email: ${adminEmail}`);

  } catch (error) {
    console.error('Error setting up admin user:', error);
    process.exit(1);
  }
}

// Execute the setup function
setupAdmin().catch(error => {
  console.error('Error in setupAdmin:', error);
  process.exit(1);
});
