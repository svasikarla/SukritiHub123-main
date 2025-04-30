import Layout from "@/components/Layout";
import { DashboardStats, RecentActivity, QuickActions, UpcomingVisits } from "@/components/Dashboard";
import { Button } from "@/components/ui/button";
import { Plus, FileText, Bot } from "lucide-react";
import { Link } from "react-router-dom";
import { WhatsappIcon } from "@/components/WhatsAppIntegration";

const Index = () => {
  return (
    <Layout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-medium">Welcome to SukritiHub Whitefield</h1>
        <div className="flex gap-2">
          <Link to="/finance-chat">
            <Button variant="outline">
              <Bot size={16} className="mr-2" />
              Finance Assistant
            </Button>
          </Link>
          <Link to="/whatsapp-integration">
            <Button variant="outline" className="bg-green-50 hover:bg-green-100 text-green-700 border-green-200">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2"
              >
                <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
                <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1Z" />
                <path d="M14 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1Z" />
                <path d="M9.5 13.5c.5 1 1.5 1 2.5 1s2-.5 2.5-1" />
              </svg>
              WhatsApp Payments
            </Button>
          </Link>
          <Button>
            <Plus size={16} className="mr-2" />
            New Request
          </Button>
        </div>
      </div>
      
      <DashboardStats />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <RecentActivity />
        <div className="space-y-6">
          <QuickActions />
          <UpcomingVisits />
        </div>
      </div>
      
      <div className="mt-8 border-t border-border pt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium">Recent Reports</h2>
          <Button variant="outline" size="sm">
            <FileText size={14} className="mr-2" />
            View All Reports
          </Button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {['Monthly Expenses', 'Visitor Analytics', 'Maintenance Requests', 'Vendor Payments'].map((report, index) => (
            <div 
              key={index} 
              className="p-4 border border-border rounded-lg hover:border-primary/20 transition-colors cursor-pointer"
            >
              <FileText size={32} className="mb-2 text-primary/60" />
              <h3 className="font-medium">{report}</h3>
              <p className="text-sm text-muted-foreground">Last updated: May 15, 2023</p>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Index;
