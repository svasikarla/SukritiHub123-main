import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: string[];
  requiredPermissions?: string[];
}

export default function ProtectedRoute({ 
  children, 
  requiredRoles = [], 
  requiredPermissions = [] 
}: ProtectedRouteProps) {
  const { user, loading, hasRole, hasPermission } = useAuth();
  const location = useLocation();
  
  console.log('ProtectedRoute - Current user:', user);
  console.log('ProtectedRoute - Loading state:', loading);
  console.log('ProtectedRoute - Required roles:', requiredRoles);
  console.log('ProtectedRoute - Required permissions:', requiredPermissions);

  if (loading) {
    console.log('ProtectedRoute - Still loading, showing spinner');
    return <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>;
  }

  if (!user) {
    console.log('ProtectedRoute - No user found, redirecting to login');
    // Redirect to login page if not authenticated
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user has at least one of the required roles
  const hasRequiredRole = requiredRoles.length === 0 || 
    requiredRoles.some(role => {
      const hasRoleResult = hasRole(role);
      console.log(`ProtectedRoute - Checking role ${role}:`, hasRoleResult);
      return hasRoleResult;
    });

  // Check if user has at least one of the required permissions
  const hasRequiredPermission = requiredPermissions.length === 0 || 
    requiredPermissions.some(permission => {
      const hasPermissionResult = hasPermission(permission);
      console.log(`ProtectedRoute - Checking permission ${permission}:`, hasPermissionResult);
      return hasPermissionResult;
    });

  if (requiredRoles.length > 0 && !hasRequiredRole) {
    console.log('ProtectedRoute - Missing required role, redirecting to unauthorized');
    // Redirect to unauthorized page if missing required role
    return <Navigate to="/unauthorized" replace />;
  }

  if (requiredPermissions.length > 0 && !hasRequiredPermission) {
    console.log('ProtectedRoute - Missing required permission, redirecting to unauthorized');
    // Redirect to unauthorized page if missing required permission
    return <Navigate to="/unauthorized" replace />;
  }

  console.log('ProtectedRoute - Access granted, rendering children');
  return <>{children}</>;
}
