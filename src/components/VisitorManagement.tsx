
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Visitor } from '@/lib/types';
import { Check, X, UserPlus, Clock, Calendar, QrCode, FileText } from 'lucide-react';

interface VisitorCardProps {
  visitor: Visitor;
  onApprove?: (id: string) => void;
  onDeny?: (id: string) => void;
}

function VisitorCard({ visitor, onApprove, onDeny }: VisitorCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getBadgeVariant = (status: string) => {
    switch (status) {
      case 'pending': return 'secondary';
      case 'approved': return 'outline';
      case 'checked-in': return 'default';
      case 'checked-out': return 'secondary';
      case 'denied': return 'destructive';
      default: return 'secondary';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Pending Approval';
      case 'approved': return 'Approved';
      case 'checked-in': return 'Checked In';
      case 'checked-out': return 'Checked Out';
      case 'denied': return 'Denied';
      default: return status;
    }
  };

  const getVisitorTypeBadge = (type: string) => {
    switch (type) {
      case 'domestic': return <Badge variant="outline" className="ml-2">Domestic Help</Badge>;
      case 'delivery': return <Badge variant="outline" className="ml-2">Delivery</Badge>;
      case 'preapproved': return <Badge variant="outline" className="ml-2">Pre-approved</Badge>;
      case 'shortstay': return <Badge variant="outline" className="ml-2">Short Stay</Badge>;
      default: return null;
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-soft transition-all duration-300 animate-slide-in-bottom">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center mb-1">
              <h3 className="font-medium">{visitor.name}</h3>
              {getVisitorTypeBadge(visitor.visitorType)}
            </div>
            <div className="space-y-1 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar size={14} />
                <span>Expected at {formatDate(visitor.expectedArrival)}</span>
              </div>
              <div className="flex items-center gap-1">
                <UserPlus size={14} />
                <span>Visiting {visitor.hostName}, Unit {visitor.hostUnit}</span>
              </div>
              <div className="flex items-center gap-1 mt-1">
                <FileText size={14} />
                <span>{visitor.purpose}</span>
              </div>
            </div>
          </div>
          <Badge variant={getBadgeVariant(visitor.status)}>
            {getStatusText(visitor.status)}
          </Badge>
        </div>
        
        {visitor.status === 'pending' && (
          <div className="flex gap-2 mt-4">
            <Button 
              className="flex-1 h-9" 
              variant="outline" 
              onClick={() => onDeny && onDeny(visitor.id)}
            >
              <X size={16} className="mr-1" />
              Deny
            </Button>
            <Button 
              className="flex-1 h-9" 
              onClick={() => onApprove && onApprove(visitor.id)}
            >
              <Check size={16} className="mr-1" />
              Approve
            </Button>
          </div>
        )}
        
        {visitor.status === 'approved' && (
          <Button 
            className="w-full mt-4 h-9" 
            variant="outline"
          >
            <QrCode size={16} className="mr-1" />
            View QR Code
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

interface VisitorListProps {
  visitorType?: string;
}

export function VisitorList({ visitorType }: VisitorListProps) {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [activeTab, setActiveTab] = useState('pending');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulating data fetching
    setTimeout(() => {
      const mockVisitors: Visitor[] = [
        {
          id: '1',
          name: 'Lakshmi Devi',
          purpose: 'Daily household work',
          hostUnit: 'A-101',
          hostName: 'Rajesh Sharma',
          expectedArrival: '2023-05-15T10:30:00',
          status: 'pending',
          visitorType: 'domestic',
        },
        {
          id: '2',
          name: 'Swiggy Delivery',
          purpose: 'Food delivery',
          hostUnit: 'B-205',
          hostName: 'Priya Patel',
          expectedArrival: '2023-05-15T14:00:00',
          status: 'approved',
          visitorType: 'delivery',
          vehicleNumber: 'KA-01-AB-1234',
        },
        {
          id: '3',
          name: 'Raju Plumber',
          purpose: 'Fix kitchen sink',
          hostUnit: 'C-304',
          hostName: 'Anand Krishnan',
          expectedArrival: '2023-05-15T16:30:00',
          status: 'checked-in',
          visitorType: 'service',
        },
        {
          id: '4',
          name: 'Meera Desai',
          purpose: 'Birthday party',
          hostUnit: 'A-202',
          hostName: 'Sunita Nagarajan',
          expectedArrival: '2023-05-16T18:00:00',
          status: 'pending',
          visitorType: 'preapproved',
        },
        {
          id: '5',
          name: 'Flipkart Delivery',
          purpose: 'Package delivery',
          hostUnit: 'B-103',
          hostName: 'Venkat Subramaniam',
          expectedArrival: '2023-05-16T11:15:00',
          status: 'denied',
          visitorType: 'delivery',
        },
        {
          id: '6',
          name: 'Rahul Mehta',
          purpose: 'Weekend stay',
          hostUnit: 'D-401',
          hostName: 'Deepak Reddy',
          expectedArrival: '2023-05-17T20:00:00',
          expectedDeparture: '2023-05-19T10:00:00',
          status: 'approved',
          visitorType: 'shortstay',
        },
      ];
      
      setVisitors(mockVisitors);
      setLoading(false);
    }, 1000);
  }, []);
  
  const handleApprove = (id: string) => {
    setVisitors(prev => 
      prev.map(visitor => 
        visitor.id === id ? { ...visitor, status: 'approved' } : visitor
      )
    );
  };
  
  const handleDeny = (id: string) => {
    setVisitors(prev => 
      prev.map(visitor => 
        visitor.id === id ? { ...visitor, status: 'denied' } : visitor
      )
    );
  };
  
  const filteredVisitors = visitors.filter(visitor => {
    // Filter by visitor type if specified
    if (visitorType && visitor.visitorType !== visitorType) return false;
    
    // Then filter by status tab
    if (activeTab === 'all') return true;
    return visitor.status === activeTab;
  });

  if (loading) {
    return (
      <div className="space-y-4">
        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="checked-in">Checked In</TabsTrigger>
            <TabsTrigger value="all">All</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, index) => (
            <Card key={index} className="animate-pulse">
              <CardContent className="p-4">
                <div className="flex justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-muted rounded w-2/3"></div>
                    <div className="h-3 bg-muted rounded w-full"></div>
                    <div className="h-3 bg-muted rounded w-full"></div>
                  </div>
                  <div className="h-6 w-20 bg-muted rounded"></div>
                </div>
                <div className="h-9 bg-muted rounded mt-4"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="checked-in">Checked In</TabsTrigger>
          <TabsTrigger value="all">All</TabsTrigger>
        </TabsList>
      </Tabs>
      
      {filteredVisitors.length === 0 ? (
        <Card>
          <CardContent className="p-8 flex flex-col items-center justify-center text-center">
            <Clock size={48} className="text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-1">No visitors {activeTab !== 'all' ? `with status "${activeTab}"` : ''}</h3>
            <p className="text-muted-foreground">Visitors will appear here once they are registered</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredVisitors.map((visitor) => (
            <VisitorCard 
              key={visitor.id} 
              visitor={visitor} 
              onApprove={handleApprove}
              onDeny={handleDeny}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function AddVisitorButton() {
  return (
    <Button className="ml-auto">
      <UserPlus size={16} className="mr-2" />
      Add Visitor
    </Button>
  );
}
