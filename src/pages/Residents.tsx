import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { ResidentSearch, ResidentList } from "@/components/ResidentDirectory";
import { ResidentRegistrationModal } from "@/components/ResidentRegistrationModal";
import { Button } from "@/components/ui/button";
import { Plus, FileUp, Download, RefreshCw } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

// Fix the 'any' type in recentUpdates
interface RecentUpdate {
  action: string;
  details: string;
  date: string;
}

const Residents = () => {
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0); // Use to trigger re-renders
  const [searchTerm, setSearchTerm] = useState(""); // Track search term
  const [stats, setStats] = useState({
    total: 0,
    owners: 0,
    tenants: 0,
    inactive: 0,
    newThisMonth: 0
  });
  const [recentUpdates, setRecentUpdates] = useState<RecentUpdate[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch resident statistics
  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch total residents count
        const { count: total } = await supabase
          .from('residents')
          .select('*', { count: 'exact', head: true });

        // Fetch active residents
        const { count: active } = await supabase
          .from('residents')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'Active');

        // Fetch inactive residents
        const { count: inactive } = await supabase
          .from('residents')
          .select('*', { count: 'exact', head: true })
          .neq('status', 'Active');

        // This is a placeholder since we don't have owner/tenant in our schema yet
        const owners = Math.round(active * 0.75) || 0;
        const tenants = (active || 0) - owners;
        
        // Fetch residents created in the last month
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const { count: newThisMonth } = await supabase
          .from('residents')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', thirtyDaysAgo.toISOString());

        setStats({
          total: total || 0,
          owners,
          tenants,
          inactive: inactive || 0,
          newThisMonth: newThisMonth || 0
        });
      } catch (error) {
        console.error('Error fetching resident statistics:', error);
      }
    };

    fetchStats();
  }, [refreshKey]);

  // Fetch recent updates - we'll just use the most recently created residents
  useEffect(() => {
    const fetchRecentUpdates = async () => {
      try {
        const { data, error } = await supabase
          .from('residents')
          .select('*, apartments(block, flat_number)')
          .order('created_at', { ascending: false })
          .limit(4);

        if (error) {
          throw error;
        }

        // Transform data into the format expected by the UI
        const updates = data?.map(resident => ({
          action: 'New resident added',
          details: `${resident.name} (${resident.status}), Unit ${resident.apartments ? `${resident.apartments.block}-${resident.apartments.flat_number}` : 'N/A'}`,
          date: new Date(resident.created_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })
        })) || [];

        setRecentUpdates(updates);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching recent updates:', error);
        setIsLoading(false);
      }
    };

    fetchRecentUpdates();
  }, [refreshKey]);

  const handleRegistrationSuccess = () => {
    // Increment refresh key to trigger data refresh
    setRefreshKey(prev => prev + 1);
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setRefreshKey(prev => prev + 1);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  return (
    <Layout>
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-medium mb-1">Resident Directory</h1>
          <p className="text-muted-foreground">Manage society residents and their information</p>
        </div>
        
        <div className="flex items-center space-x-2 w-full md:w-auto">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={handleRefresh} 
            className="mr-2" 
            disabled={isLoading}
          >
            <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
          </Button>
          <Button onClick={() => setIsRegistrationOpen(true)}>
            <Plus size={16} className="mr-2" />
            Add Resident
          </Button>
        </div>
      </div>
      
      <div className="mb-6">
        <ResidentSearch onSearch={handleSearch} />
      </div>
      
      <Tabs defaultValue="all" className="mb-6">
        <TabsList>
          <TabsTrigger value="all">All Residents</TabsTrigger>
          <TabsTrigger value="owners">Owners</TabsTrigger>
          <TabsTrigger value="tenants">Tenants</TabsTrigger>
          <TabsTrigger value="inactive">Inactive</TabsTrigger>
        </TabsList>
        
        <div className="flex items-center justify-end gap-2 mt-4">
          <Button variant="outline" size="sm">
            <FileUp size={14} className="mr-2" />
            Import
          </Button>
          <Button variant="outline" size="sm">
            <Download size={14} className="mr-2" />
            Export
          </Button>
        </div>
        
        <TabsContent value="all" className="mt-4">
          <ResidentList 
            key={`all-${refreshKey}`} 
            searchTerm={searchTerm}
          />
        </TabsContent>
        
        <TabsContent value="owners" className="mt-4">
          <ResidentList 
            key={`owners-${refreshKey}`} 
            residentType="owner"
            searchTerm={searchTerm}
          />
        </TabsContent>
        
        <TabsContent value="tenants" className="mt-4">
          <ResidentList 
            key={`tenants-${refreshKey}`} 
            residentType="tenant"
            searchTerm={searchTerm}
          />
        </TabsContent>
        
        <TabsContent value="inactive" className="mt-4">
          {stats.inactive > 0 ? (
            <ResidentList 
              key={`inactive-${refreshKey}`} 
              residentType="inactive"
              searchTerm={searchTerm}
            />
          ) : (
            <Card>
              <CardContent className="p-8 flex flex-col items-center justify-center text-center">
                <p className="text-muted-foreground mb-2">No inactive residents found</p>
                <Button variant="outline" size="sm">View All Residents</Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
      
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Resident Statistics</CardTitle>
            <CardDescription>Overview of resident data</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Residents</span>
                <span className="font-medium">{stats.total}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Owners</span>
                <span className="font-medium">{stats.owners}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tenants</span>
                <span className="font-medium">{stats.tenants}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Inactive Residents</span>
                <span className="font-medium">{stats.inactive}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">New This Month</span>
                <span className="font-medium">{stats.newThisMonth}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Recent Updates</CardTitle>
            <CardDescription>Latest changes to resident data</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {isLoading ? (
                <div className="animate-pulse space-y-4">
                  {[...Array(4)].map((_, index) => (
                    <div key={index} className="flex items-start gap-3 pb-3 border-b border-border last:border-0 last:pb-0">
                      <div className="w-2 h-2 rounded-full bg-muted mt-1.5"></div>
                      <div className="w-full">
                        <div className="h-4 bg-muted rounded w-1/2 mb-2"></div>
                        <div className="h-3 bg-muted rounded w-3/4 mb-1"></div>
                        <div className="h-2 bg-muted rounded w-1/4"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : recentUpdates.length > 0 ? (
                recentUpdates.map((item, index) => (
                  <div key={index} className="flex items-start gap-3 pb-3 border-b border-border last:border-0 last:pb-0">
                    <div className="w-2 h-2 rounded-full bg-primary mt-1.5"></div>
                    <div>
                      <p className="font-medium">{item.action}</p>
                      <p className="text-sm text-muted-foreground">{item.details}</p>
                      <p className="text-xs text-muted-foreground">{item.date}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  No recent updates to display
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <ResidentRegistrationModal 
        open={isRegistrationOpen}
        onOpenChange={setIsRegistrationOpen}
        onSuccess={handleRegistrationSuccess}
      />
    </Layout>
  );
}

export default Residents;
