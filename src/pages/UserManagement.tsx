import Layout from '@/components/Layout';
import UserManagementComponent from '@/components/UserManagement';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function UserManagementPage() {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">
            Manage user roles and permissions for your organization.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>User Roles</CardTitle>
            <CardDescription>
              Assign or remove roles from users to control their access to different features.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <UserManagementComponent />
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
