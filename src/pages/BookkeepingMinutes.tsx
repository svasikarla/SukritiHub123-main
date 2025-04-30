
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, Upload, Plus, Calendar, Clock, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const BookkeepingMinutes = () => {
  return (
    <Layout>
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-medium mb-1">General Body Meeting Minutes</h1>
          <p className="text-muted-foreground">Records of society general body meetings</p>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
            <Input placeholder="Search minutes..." className="pl-9 h-9 w-full md:w-[200px]" />
          </div>
          <Button>
            <Plus size={16} className="mr-2" />
            Add Minutes
          </Button>
        </div>
      </div>
      
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { title: "Annual General Meeting", date: "March 5, 2023", type: "AGM", status: "Approved" },
            { title: "Special General Meeting", date: "January 20, 2023", type: "SGM", status: "Approved" },
            { title: "Quarterly General Meeting", date: "December 15, 2022", type: "QGM", status: "Approved" },
            { title: "Emergency General Meeting", date: "November 10, 2022", type: "EGM", status: "Approved" },
            { title: "Quarterly General Meeting", date: "September 18, 2022", type: "QGM", status: "Approved" },
            { title: "Quarterly General Meeting", date: "June 24, 2022", type: "QGM", status: "Approved" },
          ].map((meeting, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-md transition-all duration-300">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div className="space-y-1 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-medium">{meeting.title}</h3>
                      <Badge variant="outline" className="text-xs">{meeting.type}</Badge>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Calendar size={14} />
                      <span>{meeting.date}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Status: {meeting.status}</p>
                    <div className="flex gap-1 mt-2">
                      <Button variant="outline" size="sm" className="flex-1 text-xs">
                        <Download size={14} className="mr-1" />
                        Download
                      </Button>
                      <Button variant="secondary" size="sm" className="flex-1 text-xs">
                        View
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Recent Action Items</CardTitle>
            <CardDescription>Tasks derived from the latest general body meetings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { task: "Upgrade security cameras at entrance gates", assignee: "Security Committee", deadline: "June 15, 2023", meeting: "AGM, March 2023" },
                { task: "Implement water conservation measures", assignee: "Maintenance Committee", deadline: "July 10, 2023", meeting: "AGM, March 2023" },
                { task: "Organize community tree plantation drive", assignee: "Garden Committee", deadline: "June 30, 2023", meeting: "SGM, January 2023" },
                { task: "Revise visitor management system", assignee: "Admin Committee", deadline: "May 30, 2023", meeting: "AGM, March 2023" },
                { task: "Conduct fire safety drill", assignee: "Security Committee", deadline: "May 25, 2023", meeting: "QGM, December 2022" },
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-3 pb-3 border-b border-border last:border-0 last:pb-0">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5"></div>
                  <div>
                    <p className="font-medium">{item.task}</p>
                    <p className="text-sm text-muted-foreground">Assigned to: {item.assignee}</p>
                    <div className="flex items-center gap-4 mt-1">
                      <p className="text-xs text-muted-foreground">Deadline: {item.deadline}</p>
                      <p className="text-xs text-muted-foreground">From: {item.meeting}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default BookkeepingMinutes;
