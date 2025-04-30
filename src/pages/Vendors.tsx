
import Layout from "@/components/Layout";
import { VendorList, PaymentList, AddPaymentButton } from "@/components/VendorPayments";
import { Button } from "@/components/ui/button";
import { Plus, Search, IndianRupee } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const Vendors = () => {
  return (
    <Layout>
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-medium mb-1">Vendor Management</h1>
          <p className="text-muted-foreground">Track vendors and their payments</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
            <Input
              placeholder="Search vendors..."
              className="pl-10 w-[200px]"
            />
          </div>
          <Button>
            <Plus size={16} className="mr-2" />
            Add Vendor
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="vendors" className="space-y-6">
        <TabsList>
          <TabsTrigger value="vendors">Vendors</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
        </TabsList>
        
        <TabsContent value="vendors" className="space-y-6">
          <VendorList />
        </TabsContent>
        
        <TabsContent value="payments" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Payment History</CardTitle>
                  <AddPaymentButton />
                </CardHeader>
                <CardContent>
                  <PaymentList />
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Payment Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex flex-col">
                      <span className="text-muted-foreground text-sm">Total Paid (Current Month)</span>
                      <div className="flex items-center">
                        <IndianRupee size={18} className="mr-1" />
                        <span className="text-2xl font-bold">48,500</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col">
                      <span className="text-muted-foreground text-sm">Pending Payments</span>
                      <div className="flex items-center">
                        <IndianRupee size={18} className="mr-1" />
                        <span className="text-2xl font-bold">25,000</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col">
                      <span className="text-muted-foreground text-sm">Overdue Payments</span>
                      <div className="flex items-center">
                        <IndianRupee size={18} className="mr-1" />
                        <span className="text-2xl font-bold">3,500</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col">
                      <span className="text-muted-foreground text-sm">Total (Year to Date)</span>
                      <div className="flex items-center">
                        <IndianRupee size={18} className="mr-1" />
                        <span className="text-2xl font-bold">2,47,500</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle>Payment Methods</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { method: 'Bank Transfer', percentage: 65 },
                      { method: 'Check', percentage: 20 },
                      { method: 'Credit Card', percentage: 15 },
                    ].map((item, index) => (
                      <div key={index} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>{item.method}</span>
                          <span>{item.percentage}%</span>
                        </div>
                        <div className="w-full bg-secondary rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full" 
                            style={{ width: `${item.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </Layout>
  );
};

export default Vendors;
