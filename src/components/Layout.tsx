
import { useState, useEffect } from 'react';
import { Navbar } from './Navbar';
import { SidebarProvider, Sidebar, SidebarContent, SidebarFooter, SidebarTrigger, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarMenuSub, SidebarMenuSubItem, SidebarMenuSubButton } from "@/components/ui/sidebar";
import { Home, Users, UserPlus, Shield, DollarSign, Menu, X, FileText, Book, List, Clock, UserCog } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useIsMobile } from '@/hooks/use-mobile';
import { useLocation, Link } from 'react-router-dom';

export default function Layout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const isMobile = useIsMobile();
  const location = useLocation();
  const { hasRole } = useAuth();
  
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [location.pathname, isMobile]);

  useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile]);

  const menuItems = [
    { title: "Dashboard", icon: Home, path: "/" },
    { title: "Residents", icon: Users, path: "/residents" },
    { title: "Visitors", icon: UserPlus, path: "/visitors" },
    { title: "Guards", icon: Shield, path: "/guards" },
    { title: "Vendors", icon: DollarSign, path: "/vendors" },
    { 
      title: "Bookkeeping", 
      icon: Book, 
      path: "/bookkeeping",
      subItems: [
        { title: "Accounts", icon: FileText, path: "/bookkeeping/accounts" },
        { title: "Bye-Laws", icon: List, path: "/bookkeeping/bye-laws" },
        { title: "GBM Minutes", icon: Clock, path: "/bookkeeping/gbm-minutes" },
        { title: "Payments", icon: DollarSign, path: "/bookkeeping/payments" },
      ]
    },
    // Only show User Management for Super Admin
    ...(hasRole('Super Admin') ? [
      { title: "User Management", icon: UserCog, path: "/user-management" }
    ] : []),
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <Sidebar className="border-r border-border">
          <div className="h-16 flex items-center justify-center border-b border-border p-2">
            <Link to="/" className="focus-ring rounded-md">
              <h1 className="text-xl font-semibold text-primary">SukritiHub</h1>
            </Link>
            {isMobile && (
              <button 
                onClick={() => setSidebarOpen(false)}
                className="ml-auto p-1 rounded-md hover:bg-secondary smooth-transition"
                aria-label="Close sidebar"
              >
                <X size={18} />
              </button>
            )}
          </div>
          <SidebarContent className="p-0">
            <nav className="space-y-1 p-2">
              {menuItems.map((item) => (
                <div key={item.title}>
                  {item.subItems ? (
                    <div className="mb-1">
                      <Link
                        to={item.path}
                        className={`flex items-center space-x-3 px-3 py-2 rounded-md transition-all duration-200 ease-in-out ${
                          isActive(item.path) 
                            ? 'bg-primary text-primary-foreground font-medium' 
                            : 'text-foreground hover:bg-secondary'
                        }`}
                      >
                        <item.icon size={18} />
                        <span>{item.title}</span>
                      </Link>
                      <div className="ml-7 mt-1 space-y-1 border-l border-border pl-3">
                        {item.subItems.map((subItem) => (
                          <Link
                            key={subItem.title}
                            to={subItem.path}
                            className={`flex items-center space-x-2 px-2 py-1.5 text-sm rounded-md transition-all duration-200 ease-in-out ${
                              isActive(subItem.path) 
                                ? 'bg-primary/80 text-primary-foreground font-medium' 
                                : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                            }`}
                          >
                            <subItem.icon size={16} />
                            <span>{subItem.title}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <Link
                      to={item.path}
                      className={`flex items-center space-x-3 px-3 py-2 rounded-md transition-all duration-200 ease-in-out ${
                        isActive(item.path) 
                          ? 'bg-primary text-primary-foreground font-medium' 
                          : 'text-foreground hover:bg-secondary'
                      }`}
                    >
                      <item.icon size={18} />
                      <span>{item.title}</span>
                    </Link>
                  )}
                </div>
              ))}
            </nav>
          </SidebarContent>
          <SidebarFooter className="p-4 border-t border-border">
            <div className="text-xs text-muted-foreground">
              <p>© {new Date().getFullYear()} SukritiHub</p>
              <p>v1.0.0</p>
            </div>
          </SidebarFooter>
        </Sidebar>
        
        <div className="flex flex-col flex-1 min-w-0">
          <Navbar>
            <SidebarTrigger 
              className="mr-2" 
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu size={20} />
            </SidebarTrigger>
          </Navbar>
          <main className="flex-1 overflow-auto p-4 md:p-6 animate-fade-in">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
