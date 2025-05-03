import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        title: 'Passwords do not match',
        description: 'Please make sure your passwords match.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      // Register the user with Supabase with auto-confirmation (bypassing email verification)
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: null,
          data: {
            email_confirmed: true
          }
        }
      });
      
      // If registration is successful, immediately sign in the user
      if (!error && data.user) {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        
        if (signInError) {
          console.error('Error signing in after registration:', signInError);
        }
      }
      
      if (error) {
        throw error;
      }

      // Check if this is the first user and assign Super Admin role
      // First, check how many users exist
      const { count, error: countError } = await supabase
        .from('user_roles')
        .select('*', { count: 'exact', head: true });

      if (countError) {
        console.error('Error checking user count:', countError);
      }

      // If this is the first user (or no users exist yet), make them a Super Admin
      if (count === 0 && data.user) {
        // Get or create the Super Admin role
        const { data: roleData, error: roleError } = await supabase
          .from('roles')
          .select('id')
          .eq('name', 'Super Admin')
          .single();

        if (roleError && roleError.code !== 'PGRST116') { // PGRST116 is the error code for no rows returned
          console.error('Error fetching Super Admin role:', roleError);
        }

        let superAdminRoleId;

        if (!roleData) {
          // Create the Super Admin role
          const { data: newRole, error: createRoleError } = await supabase
            .from('roles')
            .insert({
              name: 'Super Admin',
              description: 'Complete access to the app. Leadership at RWA'
            })
            .select()
            .single();

          if (createRoleError) {
            console.error('Error creating Super Admin role:', createRoleError);
          } else {
            superAdminRoleId = newRole.id;
          }
        } else {
          superAdminRoleId = roleData.id;
        }

        // Assign the Super Admin role to the user
        if (superAdminRoleId) {
          const { error: assignError } = await supabase
            .from('user_roles')
            .insert({
              user_id: data.user.id,
              role_id: superAdminRoleId
            });

          if (assignError) {
            console.error('Error assigning Super Admin role:', assignError);
          } else {
            toast({
              title: 'Super Admin Created',
              description: 'You have been assigned the Super Admin role as the first user.',
            });
          }
        }
      } else {
        // For subsequent users, assign the default Flat Resident Owner role
        const { data: roleData, error: roleError } = await supabase
          .from('roles')
          .select('id')
          .eq('name', 'Flat Resident Owner')
          .single();

        if (roleError && roleError.code !== 'PGRST116') {
          console.error('Error fetching Flat Resident Owner role:', roleError);
        }

        if (roleData && data.user) {
          const { error: assignError } = await supabase
            .from('user_roles')
            .insert({
              user_id: data.user.id,
              role_id: roleData.id
            });

          if (assignError) {
            console.error('Error assigning Flat Resident Owner role:', assignError);
          }
        }
      }

      // Show success message
      toast({
        title: 'Registration successful',
        description: 'Your account has been created and you are now logged in.',
      });
      
      // Redirect to dashboard
      navigate('/');
    } catch (error: any) {
      toast({
        title: 'Registration failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
          <CardDescription>
            Enter your email and password to create your account
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Creating account...' : 'Create account'}
            </Button>
            <div className="text-center text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
