
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, Upload, Plus, Calendar } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const BookkeepingAccounts = () => {
  return (
    <Layout>
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-medium mb-1">Society Accounts</h1>
          <p className="text-muted-foreground">Manage financial documents and statements</p>
        </div>
        
        <Button>
          <Plus size={16} className="mr-2" />
          Upload Document
        </Button>
      </div>
      
      <Tabs defaultValue="statements" className="space-y-6">
        <TabsList>
          <TabsTrigger value="statements">Financial Statements</TabsTrigger>
          <TabsTrigger value="receipts">Receipts & Invoices</TabsTrigger>
          <TabsTrigger value="audits">Audit Reports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="statements" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { title: "Annual Financial Statement", year: "2023", date: "April 5, 2023" },
              { title: "Quarterly Statement", year: "Q1 2023", date: "April 15, 2023" },
              { title: "Maintenance Fee Collection", year: "March 2023", date: "April 2, 2023" },
              { title: "Expense Report", year: "March 2023", date: "April 2, 2023" },
              { title: "Balance Sheet", year: "2022-2023", date: "April 10, 2023" },
              { title: "Sinking Fund Statement", year: "2023", date: "April 12, 2023" },
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
                      <p className="text-sm text-muted-foreground">{doc.year}</p>
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
        </TabsContent>
        
        <TabsContent value="receipts" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { title: "Security Services Invoice", vendor: "Bengaluru Security Ltd", date: "April 10, 2023" },
              { title: "Gardening Services Receipt", vendor: "Green Gardens", date: "April 5, 2023" },
              { title: "Elevator Maintenance", vendor: "Kone Elevators", date: "March 28, 2023" },
              { title: "Water Tank Cleaning", vendor: "Clean Waters Co", date: "March 25, 2023" },
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
                      <p className="text-sm text-muted-foreground">{doc.vendor}</p>
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
        </TabsContent>
        
        <TabsContent value="audits" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { title: "Annual Audit Report", year: "2022-2023", date: "April 20, 2023", auditor: "Kumar & Associates" },
              { title: "Internal Audit", year: "Q4 2022", date: "January 15, 2023", auditor: "Finance Committee" },
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
                      <p className="text-sm text-muted-foreground">{doc.year} • {doc.auditor}</p>
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
        </TabsContent>
      </Tabs>
    </Layout>
  );
};

export default BookkeepingAccounts;
