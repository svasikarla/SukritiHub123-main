import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, AuthError } from '@supabase/supabase-js';
import { createLogger } from '@/lib/logger';

// Create a logger instance for the auth module
const logger = createLogger({ module: 'Auth' });

interface Role {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
}

interface Permission {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
}

/**
 * Authentication context type definition
 */
interface AuthContextType {
  user: User | null;
  roles: Role[];
  permissions: Permission[];
  loading: boolean;
  loadingRoles: boolean;
  signIn: (email: string, password: string) => Promise<{ data: any | null; error: AuthError | Error | null }>;
  signOut: () => Promise<void>;
  hasRole: (roleName: string) => boolean;
  hasPermission: (permissionName: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Provider component that wraps the app and makes auth object available to any
 * child component that calls useAuth().
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingRoles, setLoadingRoles] = useState(false);

  useEffect(() => {
    // Check active session and set the user
    const fetchUser = async () => {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        setUser(session.user);
        await fetchUserRolesAndPermissions(session.user.id);
      }
      
      setLoading(false);
    };

    fetchUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user);
          await fetchUserRolesAndPermissions(session.user.id);
        } else {
          setUser(null);
          setRoles([]);
          setPermissions([]);
        }
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  /**
   * Fetches user roles and associated permissions from the database
   * Uses optimized queries to reduce the number of sequential requests
   * @param userId - The ID of the user to fetch roles for
   */
  async function fetchUserRolesAndPermissions(userId: string) {
    try {
      setLoadingRoles(true);
      
      // For now, we'll use mock roles and permissions since the database schema
      // doesn't include the required tables
      logger.info('Setting default roles and permissions for user:', userId);
      
      // Set default roles for testing
      const defaultRoles: Role[] = [
        {
          id: '1',
          name: 'user',
          description: 'Regular user',
          created_at: new Date().toISOString()
        },
        {
          id: '2',
          name: 'Admin',
          description: 'Administrator with elevated privileges',
          created_at: new Date().toISOString()
        }
      ];
      
      // Set default permissions for testing
      const defaultPermissions: Permission[] = [
        {
          id: '1',
          name: 'read:profile',
          description: 'Can read own profile',
          created_at: new Date().toISOString()
        },
        {
          id: '2',
          name: 'update:profile',
          description: 'Can update own profile',
          created_at: new Date().toISOString()
        }
      ];
      
      setRoles(defaultRoles);
      setPermissions(defaultPermissions);
      
      logger.info('Default roles and permissions set successfully');
    } catch (error) {
      logger.error('Unexpected error during role setup:', error);
      // Reset state on error
      setRoles([]);
      setPermissions([]);
    } finally {
      setLoadingRoles(false);
    }
  }

  /**
   * Signs in a user with email and password
   * @param email - User's email
   * @param password - User's password
   * @returns Object containing data and error properties
   */
  const signIn = async (email: string, password: string) => {
    try {
      logger.info('Attempting to sign in with:', email);
      console.log('Supabase client available:', !!supabase);
      console.log('Starting Supabase auth.signInWithPassword call...');
      
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      console.log('Supabase auth response received');
      
      if (error) {
        logger.error('Sign in error:', error);
        console.error('Detailed sign in error:', JSON.stringify(error));
      } else {
        logger.info('Sign in successful');
        console.log('Sign in successful, data:', data ? 'data present' : 'no data');
        if (data?.user) {
          console.log('User ID:', data.user.id);
        }
      }
      
      return { data, error };
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error during sign in');
      logger.error('Unexpected error during sign in:', error);
      console.error('Detailed unexpected error:', err);
      return { data: null, error };
    }
  };

  /**
   * Signs out the current user
   */
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        logger.error('Error signing out:', error);
      }
      setUser(null);
      setRoles([]);
      setPermissions([]);
    } catch (error) {
      logger.error('Unexpected error during sign out:', error);
    }
  };

  /**
   * Checks if the current user has a specific role
   * @param roleName - Name of the role to check
   * @returns Boolean indicating if user has the role
   */
  const hasRole = (roleName: string) => {
    return roles.some(role => role.name === roleName);
  };

  /**
   * Checks if the current user has a specific permission
   * @param permissionName - Name of the permission to check
   * @returns Boolean indicating if user has the permission
   */
  const hasPermission = (permissionName: string) => {
    return permissions.some(permission => permission.name === permissionName);
  };

  const value = {
    user,
    roles,
    permissions,
    loading,
    loadingRoles,
    signIn,
    signOut,
    hasRole,
    hasPermission,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook for accessing authentication context
 * @returns Authentication context containing user, roles, and auth methods
 * @throws Error if used outside of AuthProvider
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
