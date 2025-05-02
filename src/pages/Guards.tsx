
import Layout from "@/components/Layout";
import { GuardList, PatrolLogList, LogPatrolForm } from "@/components/GuardPatrol";
import { GuardRegistrationModal } from "@/components/GuardRegistrationModal";
import { Button } from "@/components/ui/button";
import { Plus, Shield, FileText } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";

const Guards = () => {
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);

  return (
    <Layout>
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-medium mb-1">Guard Management</h1>
          <p className="text-muted-foreground">Monitor security personnel and patrol activities</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button onClick={() => setIsRegistrationOpen(true)}>
            <Plus size={16} className="mr-2" />
            Add Guard
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="patrol-logs">Patrol Logs</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <Card className="lg:col-span-4">
              <CardHeader>
                <CardTitle>Guards on Duty</CardTitle>
              </CardHeader>
              <CardContent>
                <GuardList />
              </CardContent>
            </Card>
            
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Today's Activities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { time: '06:00 AM', activity: 'Shift change - Morning guards on duty' },
                    { time: '08:30 AM', activity: 'Patrol completed - Building A' },
                    { time: '10:15 AM', activity: 'Incident reported - Garden area' },
                    { time: '12:45 PM', activity: 'Visitor verified - Gate 1' },
                    { time: '02:00 PM', activity: 'Shift change - Evening guards on duty' },
                  ].map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="text-sm font-medium min-w-20">{item.time}</div>
                      <div className="flex-1 pb-3 border-b border-border last:border-0 last:pb-0">
                        <p className="text-sm">{item.activity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Log New Patrol</CardTitle>
              </CardHeader>
              <CardContent>
                <LogPatrolForm />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="patrol-logs" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Patrol Records</CardTitle>
                  <Button variant="outline" size="sm">
                    <FileText size={14} className="mr-2" />
                    Generate Report
                  </Button>
                </CardHeader>
                <CardContent>
                  <PatrolLogList />
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Security Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex flex-col">
                      <span className="text-muted-foreground text-sm">Patrols Today</span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-bold">12</span>
                        <span className="text-green-500 text-xs">+2 from yesterday</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col">
                      <span className="text-muted-foreground text-sm">Incidents Reported</span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-bold">1</span>
                        <span className="text-green-500 text-xs">-3 from yesterday</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col">
                      <span className="text-muted-foreground text-sm">Guards on Shift</span>
                      <span className="text-2xl font-bold">6</span>
                    </div>
                    
                    <div className="flex flex-col">
                      <span className="text-muted-foreground text-sm">Areas Covered</span>
                      <span className="text-2xl font-bold">8/8</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      <GuardRegistrationModal 
        open={isRegistrationOpen}
        onOpenChange={setIsRegistrationOpen}
      />
    </Layout>
  );
}

export default Guards;
