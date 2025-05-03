import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { User } from '@supabase/supabase-js';
import { useAuth } from '@/hooks/use-auth';

interface Role {
  id: string;
  name: string;
  description: string | null;
}

interface UserWithRoles extends User {
  roles: Role[];
}

export default function UserManagement() {
  const [users, setUsers] = useState<UserWithRoles[]>([]);
  const [allRoles, setAllRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<UserWithRoles | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [isEditRolesOpen, setIsEditRolesOpen] = useState(false);
  const { toast } = useToast();
  const { user: currentUser } = useAuth();

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  async function fetchUsers() {
    setLoading(true);
    try {
      // Fetch all users
      const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
      
      if (authError) {
        throw authError;
      }

      if (authUsers) {
        // For each user, fetch their roles
        const usersWithRoles = await Promise.all(
          authUsers.users.map(async (user) => {
            const { data: userRoles, error: rolesError } = await supabase
              .from('user_roles')
              .select('role_id')
              .eq('user_id', user.id);

            if (rolesError) {
              console.error('Error fetching user roles:', rolesError);
              return {
                ...user,
                roles: []
              };
            }

            let roles: Role[] = [];
            if (userRoles && userRoles.length > 0) {
              const roleIds = userRoles.map(ur => ur.role_id);
              
              // Fetch role details
              const { data: roleDetails, error: roleDetailsError } = await supabase
                .from('roles')
                .select('*')
                .in('id', roleIds);

              if (roleDetailsError) {
                console.error('Error fetching role details:', roleDetailsError);
              } else if (roleDetails) {
                roles = roleDetails;
              }
            }

            return {
              ...user,
              roles
            };
          })
        );

        setUsers(usersWithRoles);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch users. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }

  async function fetchRoles() {
    try {
      const { data, error } = await supabase
        .from('roles')
        .select('*');

      if (error) {
        throw error;
      }

      if (data) {
        setAllRoles(data);
      }
    } catch (error) {
      console.error('Error fetching roles:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch roles. Please try again.',
        variant: 'destructive',
      });
    }
  }

  async function assignRole() {
    if (!selectedUser || !selectedRole) return;

    try {
      // Check if the user already has this role
      const existingRole = selectedUser.roles.find(role => role.id === selectedRole);
      if (existingRole) {
        toast({
          title: 'Role already assigned',
          description: `User already has the role: ${existingRole.name}`,
        });
        return;
      }

      // Assign the role to the user
      const { error } = await supabase
        .from('user_roles')
        .insert({
          user_id: selectedUser.id,
          role_id: selectedRole
        });

      if (error) {
        throw error;
      }

      // Update the local state
      const role = allRoles.find(r => r.id === selectedRole);
      if (role) {
        const updatedUsers = users.map(u => {
          if (u.id === selectedUser.id) {
            return {
              ...u,
              roles: [...u.roles, role]
            };
          }
          return u;
        });
        setUsers(updatedUsers);
        
        // Update the selected user
        setSelectedUser({
          ...selectedUser,
          roles: [...selectedUser.roles, role]
        });
      }

      toast({
        title: 'Role assigned',
        description: 'The role has been assigned to the user successfully.',
      });
    } catch (error) {
      console.error('Error assigning role:', error);
      toast({
        title: 'Error',
        description: 'Failed to assign role. Please try again.',
        variant: 'destructive',
      });
    }
  }

  async function removeRole(userId: string, roleId: string) {
    try {
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId)
        .eq('role_id', roleId);

      if (error) {
        throw error;
      }

      // Update the local state
      const updatedUsers = users.map(u => {
        if (u.id === userId) {
          return {
            ...u,
            roles: u.roles.filter(r => r.id !== roleId)
          };
        }
        return u;
      });
      setUsers(updatedUsers);

      // Update the selected user if it's the one being modified
      if (selectedUser && selectedUser.id === userId) {
        setSelectedUser({
          ...selectedUser,
          roles: selectedUser.roles.filter(r => r.id !== roleId)
        });
      }

      toast({
        title: 'Role removed',
        description: 'The role has been removed from the user successfully.',
      });
    } catch (error) {
      console.error('Error removing role:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove role. Please try again.',
        variant: 'destructive',
      });
    }
  }

  function openEditRoles(user: UserWithRoles) {
    setSelectedUser(user);
    setSelectedRole('');
    setIsEditRolesOpen(true);
  }

  // Check if current user is an admin
  const isAdmin = currentUser && 
    (currentUser.email === 'admin@example.com' || // Example admin check
     currentUser.email?.includes('admin')); // Simple check for demo purposes

  if (!isAdmin) {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
        <p>You do not have permission to manage users.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">User Management</h2>
        <Button onClick={fetchUsers} disabled={loading}>
          {loading ? 'Loading...' : 'Refresh'}
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center my-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Roles</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-6">
                    No users found
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {user.roles.map(role => (
                          <div key={role.id} className="flex items-center">
                            <Badge variant="outline" className="mr-1">
                              {role.name}
                            </Badge>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-5 w-5 rounded-full"
                              onClick={() => removeRole(user.id, role.id)}
                            >
                              <span className="sr-only">Remove role</span>
                              ×
                            </Button>
                          </div>
                        ))}
                        {user.roles.length === 0 && (
                          <span className="text-muted-foreground text-sm">No roles assigned</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditRoles(user)}
                      >
                        Edit Roles
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={isEditRolesOpen} onOpenChange={setIsEditRolesOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User Roles</DialogTitle>
            <DialogDescription>
              Assign roles to {selectedUser?.email}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <h4 className="font-medium">Current Roles</h4>
              <div className="flex flex-wrap gap-1">
                {selectedUser?.roles.map(role => (
                  <Badge key={role.id} variant="outline">
                    {role.name}
                  </Badge>
                ))}
                {selectedUser?.roles.length === 0 && (
                  <span className="text-muted-foreground text-sm">No roles assigned</span>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">Assign New Role</h4>
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {allRoles.map(role => (
                    <SelectItem key={role.id} value={role.id}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditRolesOpen(false)}>
              Cancel
            </Button>
            <Button onClick={assignRole} disabled={!selectedRole}>
              Assign Role
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
