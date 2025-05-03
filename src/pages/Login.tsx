import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  // Get the redirect path from location state or default to home
  const from = (location.state as any)?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login form submission starting...');
    setIsLoading(true);

    try {
      console.log('Login form submitted with email:', email);
      console.log('Calling signIn function...');
      const { data, error } = await signIn(email, password);
      console.log('signIn function returned:', { data: data ? 'data present' : 'no data', error: error || 'no error' });
      
      if (error) {
        console.error('Login error details:', error);
        toast({
          title: 'Login failed',
          description: error.message || 'An error occurred during login. Please try again.',
          variant: 'destructive',
        });
      } else {
        console.log('Login successful, redirecting to:', from);
        toast({
          title: 'Login successful',
          description: 'Welcome back!',
        });
        // Redirect to the page they were trying to access
        navigate(from, { replace: true });
      }
    } catch (error: any) {
      console.error('Unexpected login error:', error);
      toast({
        title: 'Login failed',
        description: error?.message || 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
    } finally {
      console.log('Setting isLoading to false');
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Sign in to SukritiHub</CardTitle>
          <CardDescription>
            Enter your email and password to access your account
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
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <a
                  href="#"
                  className="text-sm text-primary hover:underline"
                  onClick={(e) => {
                    e.preventDefault();
                    toast({
                      title: 'Reset password',
                      description: 'Password reset functionality not implemented yet.',
                    });
                  }}
                >
                  Forgot password?
                </a>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign in'}
            </Button>
            <div className="text-center text-sm">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary hover:underline">
                Register
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
