import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Vendor, Payment } from '@/lib/types';
import { Building, IndianRupee, CalendarDays, FileText, CheckCircle, Clock, AlertCircle } from 'lucide-react';

export function VendorList() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulating data fetching
    setTimeout(() => {
      const mockVendors: Vendor[] = [
        {
          id: '1',
          name: 'Garden Maintenance Co.',
          service: 'Landscaping',
          contactName: 'Peter Johnson',
          contactPhone: '+1 (555) 123-7890',
          contactEmail: 'peter@gardenmaintenance.com',
          status: 'active',
        },
        {
          id: '2',
          name: 'Clean Pool Services',
          service: 'Pool Maintenance',
          contactName: 'Lisa Williams',
          contactPhone: '+1 (555) 234-5678',
          contactEmail: 'lisa@cleanpool.com',
          status: 'active',
        },
        {
          id: '3',
          name: 'Apex Security',
          service: 'Security Services',
          contactName: 'Mark Thompson',
          contactPhone: '+1 (555) 345-6789',
          contactEmail: 'mark@apexsecurity.com',
          status: 'active',
        },
        {
          id: '4',
          name: 'Quick Fix Plumbing',
          service: 'Plumbing',
          contactName: 'Sarah Miller',
          contactPhone: '+1 (555) 456-7890',
          contactEmail: 'sarah@quickfixplumbing.com',
          status: 'inactive',
        },
      ];
      
      setVendors(mockVendors);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(3)].map((_, index) => (
          <Card key={index} className="animate-pulse">
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="h-5 bg-muted rounded w-2/3"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
                <div className="h-3 bg-muted rounded w-full"></div>
                <div className="h-3 bg-muted rounded w-full"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {vendors.map((vendor) => (
        <Card key={vendor.id} className="overflow-hidden hover:shadow-soft transition-all duration-300 animate-slide-in-bottom">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <h3 className="font-medium">{vendor.name}</h3>
              <Badge variant={vendor.status === 'active' ? 'outline' : 'secondary'}>
                {vendor.status === 'active' ? 'Active' : 'Inactive'}
              </Badge>
            </div>
            
            <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
              <Building size={14} />
              <span>{vendor.service}</span>
            </div>
            
            <div className="mt-2 space-y-1 text-sm text-muted-foreground">
              <p>{vendor.contactName}</p>
              <p>{vendor.contactPhone}</p>
              <p className="truncate">{vendor.contactEmail}</p>
            </div>
            
            <Button variant="outline" className="w-full mt-3 h-8">
              View Payments
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function PaymentList() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulating data fetching
    setTimeout(() => {
      const mockPayments: Payment[] = [
        {
          id: '1',
          vendorId: '1',
          vendorName: 'Garden Maintenance Co.',
          amount: 12000,
          date: '2023-05-01',
          description: 'Monthly maintenance',
          status: 'paid',
          paymentMethod: 'Bank Transfer',
        },
        {
          id: '2',
          vendorId: '2',
          vendorName: 'Clean Pool Services',
          amount: 8000,
          date: '2023-05-05',
          description: 'Pool cleaning and chemicals',
          status: 'paid',
          paymentMethod: 'Check',
        },
        {
          id: '3',
          vendorId: '3',
          vendorName: 'Apex Security',
          amount: 25000,
          date: '2023-05-15',
          description: 'Security personnel',
          status: 'pending',
        },
        {
          id: '4',
          vendorId: '4',
          vendorName: 'Quick Fix Plumbing',
          amount: 3500,
          date: '2023-04-25',
          description: 'Emergency repairs',
          status: 'overdue',
          paymentMethod: 'Credit Card',
        },
      ];
      
      setPayments(mockPayments);
      setLoading(false);
    }, 1000);
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <CheckCircle size={16} className="text-green-500" />;
      case 'pending': return <Clock size={16} className="text-amber-500" />;
      case 'overdue': return <AlertCircle size={16} className="text-red-500" />;
      default: return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'paid': return 'Paid';
      case 'pending': return 'Pending';
      case 'overdue': return 'Overdue';
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, index) => (
          <Card key={index} className="animate-pulse">
            <CardContent className="p-4">
              <div className="flex justify-between">
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-muted rounded w-2/3"></div>
                  <div className="h-3 bg-muted rounded w-full"></div>
                </div>
                <div className="h-6 w-20 bg-muted rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {payments.map((payment) => (
        <Card key={payment.id} className="overflow-hidden hover:shadow-soft transition-all duration-300 animate-slide-in-bottom">
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">{payment.vendorName}</h3>
                <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                  <CalendarDays size={14} />
                  <span>{formatDate(payment.date)}</span>
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <FileText size={14} />
                  <span>{payment.description}</span>
                </div>
                {payment.paymentMethod && (
                  <div className="text-xs text-muted-foreground mt-1">
                    Method: {payment.paymentMethod}
                  </div>
                )}
              </div>
              <div className="flex flex-col items-end">
                <div className="flex items-center gap-1">
                  <IndianRupee size={14} />
                  <span className="font-semibold text-lg">{formatCurrency(payment.amount)}</span>
                </div>
                <div className="flex items-center gap-1 text-sm">
                  {getStatusIcon(payment.status)}
                  <span>{getStatusText(payment.status)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function AddPaymentButton() {
  return (
    <Button>
      <IndianRupee size={16} className="mr-2" />
      Add Payment
    </Button>
  );
}
