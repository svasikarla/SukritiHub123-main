
import Layout from "@/components/Layout";
import { DomesticHelpVerification } from "@/components/DomesticHelpVerification";
import { MaidRegistrationModal } from "@/components/MaidRegistrationModal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { useEffect, useState } from "react";
import { Maid, fetchMaids } from "@/lib/face-recognition";
import { UserPlus, RefreshCw } from "lucide-react";

export default function DomesticHelp() {
  const [maids, setMaids] = useState<Maid[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);

  useEffect(() => {
    loadMaids();
  }, []);

  const loadMaids = async () => {
    setLoading(true);
    try {
      const data = await fetchMaids();
      setMaids(data);
    } catch (error) {
      console.error("Error loading maids data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegistrationSuccess = () => {
    loadMaids();
  };

  return (
    <Layout>
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-medium mb-1">Domestic Help Management</h1>
          <p className="text-muted-foreground">Manage domestic help and track attendance</p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={loadMaids}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button onClick={() => setIsRegistrationOpen(true)}>
            <UserPlus className="mr-2 h-4 w-4" />
            Register New
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="verification" className="space-y-6">
        <TabsList>
          <TabsTrigger value="verification">Face Verification</TabsTrigger>
          <TabsTrigger value="directory">Directory</TabsTrigger>
          <TabsTrigger value="attendance">Attendance History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="verification" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-2 lg:col-start-2">
              <DomesticHelpVerification />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="directory" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Domestic Help Directory</CardTitle>
              <CardDescription>Registered domestic help personnel</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-4">
                  <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Apartment Unit</TableHead>
                      <TableHead>Phone Number</TableHead>
                      <TableHead>Face Data</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {maids.length > 0 ? (
                      maids.map((maid) => (
                        <TableRow key={maid.id}>
                          <TableCell>{maid["Name of Maid"]}</TableCell>
                          <TableCell>{maid.apartment_unit || "-"}</TableCell>
                          <TableCell>{maid.phone_number || "-"}</TableCell>
                          <TableCell>
                            {maid["Face Descriptor"] ? (
                              <span className="text-green-600">✓ Available</span>
                            ) : (
                              <span className="text-amber-600">Not registered</span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-4">
                          No domestic help registered yet
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="attendance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Attendance History</CardTitle>
              <CardDescription>Recent check-ins and check-outs</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center py-8">
                Attendance history will be displayed here.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <MaidRegistrationModal 
        open={isRegistrationOpen}
        onOpenChange={setIsRegistrationOpen}
        onSuccess={handleRegistrationSuccess}
      />
    </Layout>
  );
}
