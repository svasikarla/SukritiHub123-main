
export interface Resident {
  id: string;
  name: string;
  email: string;
  phone: string;
  unit: string;
  image?: string;
  moveInDate: string;
  status: 'active' | 'inactive';
  type?: 'owner' | 'tenant';
  whatsappNumber?: string;
}

export interface Visitor {
  id: string;
  name: string;
  purpose: string;
  hostUnit: string;
  hostName: string;
  expectedArrival: string;
  expectedDeparture?: string;
  status: 'pending' | 'approved' | 'checked-in' | 'checked-out' | 'denied';
  vehicleNumber?: string;
  visitorType: 'guest' | 'delivery' | 'service' | 'domestic' | 'preapproved' | 'shortstay';
  qrCode?: string;
}

export interface Guard {
  id: string;
  name: string;
  phone: string;
  shift: 'morning' | 'evening' | 'night';
  status: 'on-duty' | 'off-duty';
  image?: string;
}

export interface PatrolLog {
  id: string;
  guardId: string;
  guardName: string;
  timestamp: string;
  location: string;
  notes?: string;
  status: 'normal' | 'incident';
}

export interface Vendor {
  id: string;
  name: string;
  service: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  status: 'active' | 'inactive';
}

export interface Payment {
  id: string;
  vendorId: string;
  vendorName: string;
  amount: number;
  date: string;
  description: string;
  status: 'pending' | 'paid' | 'overdue';
  paymentMethod?: string;
  receiptUrl?: string;
  whatsappSource?: string;
}

export interface Statistic {
  label: string;
  value: number | string;
  change?: number;
  icon?: string;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string[];
    borderColor?: string;
    borderWidth?: number;
  }[];
}

export interface BookkeepingDocument {
  id: string;
  title: string;
  type: 'account' | 'bylaw' | 'gbm-minute';
  date: string;
  fileUrl?: string;
  description?: string;
}

export interface WhatsAppPayment {
  id: string;
  residentId: string;
  residentName: string;
  residentUnit: string;
  amount: number;
  dateReceived: string;
  messageType: 'image' | 'voice' | 'text';
  mediaUrl?: string;
  processedStatus: 'pending' | 'processed' | 'rejected';
  paymentId?: string;
  notes?: string;
}

