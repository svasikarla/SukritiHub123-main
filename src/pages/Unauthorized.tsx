import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';

export default function Unauthorized() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
      <div className="mb-6 text-red-500">
        <ShieldAlert size={64} />
      </div>
      <h1 className="text-4xl font-bold mb-4">Access Denied</h1>
      <p className="text-muted-foreground mb-6 max-w-md">
        You don't have permission to access this page. Please contact your administrator if you believe this is an error.
      </p>
      <div className="flex gap-4">
        <Button onClick={() => navigate('/')}>
          Go to Dashboard
        </Button>
        <Button variant="outline" onClick={() => navigate(-1)}>
          Go Back
        </Button>
      </div>
    </div>
  );
}
