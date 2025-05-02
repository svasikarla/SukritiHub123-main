
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, Upload, Plus, Calendar, Clock } from "lucide-react";

const BookkeepingByelaws = () => {
  return (
    <Layout>
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-medium mb-1">Society Bye-Laws</h1>
          <p className="text-muted-foreground">Rules and regulations for the society</p>
        </div>
        
        <Button>
          <Plus size={16} className="mr-2" />
          Upload New Version
        </Button>
      </div>
      
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Current Bye-Laws</CardTitle>
            <CardDescription>Latest version of society rules and regulations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div className="space-y-2 flex-1">
                <h3 className="font-medium text-lg">Whitefield Enclave Bye-Laws v3.2</h3>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Calendar size={14} />
                  <span>Last updated: March 10, 2023</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">Official bye-laws approved by the General Body Meeting held on March 5, 2023</p>
                <div className="flex gap-2 mt-4">
                  <Button className="flex-1">
                    <Download size={16} className="mr-2" />
                    Download PDF
                  </Button>
                  <Button variant="outline" className="flex-1">
                    View Online
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <h2 className="text-lg font-medium mt-8 mb-4">Previous Versions</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { title: "Whitefield Enclave Bye-Laws v3.1", date: "January 15, 2023" },
            { title: "Whitefield Enclave Bye-Laws v3.0", date: "October 5, 2022" },
            { title: "Whitefield Enclave Bye-Laws v2.5", date: "April 20, 2022" },
            { title: "Whitefield Enclave Bye-Laws v2.0", date: "January 10, 2022" },
          ].map((doc, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-md transition-all duration-300">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div className="space-y-1 flex-1">
                    <h3 className="font-medium">{doc.title}</h3>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Calendar size={14} />
                      <span>{doc.date}</span>
                    </div>
                    <Button variant="outline" size="sm" className="mt-2 w-full">
                      <Download size={14} className="mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <h2 className="text-lg font-medium mt-8 mb-4">Amendments</h2>
        
        <Card>
          <CardHeader>
            <CardTitle>Amendments History</CardTitle>
            <CardDescription>Changes made to the bye-laws over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {[
                { 
                  version: "v3.1 to v3.2", 
                  date: "March 10, 2023", 
                  changes: [
                    "Added new guidelines for EV charging stations",
                    "Updated pet policy to include designated pet walking areas",
                    "Modified guest parking rules"
                  ]
                },
                { 
                  version: "v3.0 to v3.1", 
                  date: "January 15, 2023", 
                  changes: [
                    "Updated security protocols",
                    "Modified maintenance fee structure",
                    "Added rules for community hall usage"
                  ]
                },
                { 
                  version: "v2.5 to v3.0", 
                  date: "October 5, 2022", 
                  changes: [
                    "Major revision of society management structure",
                    "Added detailed waste management guidelines",
                    "Updated water conservation measures"
                  ]
                },
              ].map((amendment, index) => (
                <div key={index} className="pb-5 border-b border-border last:border-0 last:pb-0">
                  <div className="flex justify-between mb-2">
                    <h3 className="font-medium">{amendment.version}</h3>
                    <span className="text-sm text-muted-foreground">{amendment.date}</span>
                  </div>
                  <ul className="space-y-1 ml-5 list-disc text-sm text-muted-foreground">
                    {amendment.changes.map((change, changeIndex) => (
                      <li key={changeIndex}>{change}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default BookkeepingByelaws;
