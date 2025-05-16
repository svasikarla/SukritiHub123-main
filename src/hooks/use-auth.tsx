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
      logger.info('Fetching roles and permissions for user:', userId);
      
      // Fetch actual roles from the database instead of using mock data
      const { data: userRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select(`
          role_id,
          roles:role_id (
            id,
            name,
            description,
            created_at
          )
        `)
        .eq('user_id', userId);
      
      if (rolesError) {
        logger.error('Error fetching user roles:', rolesError);
        throw rolesError;
      }
      
      // Extract roles from the nested structure
      const fetchedRoles: Role[] = userRoles.map(ur => ur.roles);
      logger.info('Fetched roles:', fetchedRoles);
      setRoles(fetchedRoles);
      
      // Fetch permissions for these roles
      const roleIds = userRoles.map(ur => ur.role_id);
      const { data: rolePermissions, error: permError } = await supabase
        .from('role_permissions')
        .select(`
          permission_id,
          permissions:permission_id (
            id,
            name,
            description,
            created_at
          )
        `)
        .in('role_id', roleIds);
      
      if (permError) {
        logger.error('Error fetching role permissions:', permError);
        throw permError;
      }
      
      // Extract unique permissions from the nested structure
      const permissionsMap = new Map();
      rolePermissions.forEach(rp => {
        if (rp.permissions) {
          permissionsMap.set(rp.permissions.id, rp.permissions);
        }
      });
      
      const fetchedPermissions: Permission[] = Array.from(permissionsMap.values());
      logger.info('Fetched permissions:', fetchedPermissions);
      setPermissions(fetchedPermissions);
      
    } catch (error) {
      logger.error('Error during role/permission setup:', error);
      // Don't reset roles/permissions on error - this could cause logout loops
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
    logger.info(`Checking permission: ${permissionName}`, { 
      permissionName, 
      availablePermissions: permissions.map(p => p.name) 
    });
    
    const result = permissions.some(permission => permission.name === permissionName);
    logger.info(`Permission check result for ${permissionName}: ${result}`);
    return result;
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
