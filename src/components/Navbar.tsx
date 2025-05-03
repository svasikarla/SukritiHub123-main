
import { useEffect, useState } from 'react';
import { Bell, User, LogOut, Settings, UserCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { Badge } from '@/components/ui/badge';

interface NavbarProps {
  children?: React.ReactNode;
}

export function Navbar({ children }: NavbarProps) {
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  const [pageTitle, setPageTitle] = useState('Dashboard');
  const { user, roles, signOut } = useAuth();

  useEffect(() => {
    // Set page title based on current route
    const path = location.pathname;
    if (path === '/') setPageTitle('Dashboard');
    else if (path.startsWith('/residents')) setPageTitle('Residents');
    else if (path.startsWith('/visitors')) setPageTitle('Visitors');
    else if (path.startsWith('/guards')) setPageTitle('Guards');
    else if (path.startsWith('/vendors')) setPageTitle('Vendors');
    else setPageTitle('SmartSociety');
  }, [location]);

  const showNotification = () => {
    toast({
      title: "No new notifications",
      description: "You're all caught up!",
    });
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container h-full flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          {children}
          <h1 className="text-xl font-medium">{pageTitle}</h1>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={showNotification}
            className="rounded-full hover:bg-secondary focus-ring"
          >
            <Bell size={18} />
            <span className="sr-only">Notifications</span>
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full hover:bg-secondary focus-ring"
              >
                <User size={18} />
                <span className="sr-only">User menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col">
                  <span>{user?.email}</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {roles.map(role => (
                      <Badge key={role.id} variant="outline" className="text-xs">
                        {role.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/profile')}>
                <UserCircle className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/settings')}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
