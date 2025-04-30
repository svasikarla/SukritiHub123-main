
import { Payment } from "@/lib/types";

export const WhatsappIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
    <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1Z" />
    <path d="M14 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1Z" />
    <path d="M9.5 13.5c.5 1 1.5 1 2.5 1s2-.5 2.5-1" />
  </svg>
);

export interface WhatsAppMessage {
  id: string;
  sender: string;
  timestamp: Date;
  messageType: 'text' | 'image' | 'voice';
  content: string;
  mediaUrl?: string;
  processed: boolean;
  paymentId?: string;
}

export interface WhatsAppPaymentProcessor {
  processImagePayment: (imageUrl: string, sender: string) => Promise<Payment | null>;
  processVoicePayment: (voiceUrl: string, sender: string) => Promise<Payment | null>;
  processTextPayment: (text: string, sender: string) => Promise<Payment | null>;
  sendConfirmation: (to: string, paymentDetails: Payment) => Promise<boolean>;
}

// This would be implemented with actual WhatsApp Business API
export class MockWhatsAppProcessor implements WhatsAppPaymentProcessor {
  async processImagePayment(imageUrl: string, sender: string): Promise<Payment | null> {
    console.log(`Processing payment image from ${sender}: ${imageUrl}`);
    
    // Mock processing - in real implementation, this would use 
    // OCR to extract payment details from screenshot
    return {
      id: Math.random().toString(36).substring(2, 9),
      vendorId: "resident",
      vendorName: "Resident Payment",
      amount: 5500, // Example amount
      date: new Date().toISOString().split('T')[0],
      description: "Maintenance payment via WhatsApp",
      status: "paid",
      paymentMethod: "UPI",
    };
  }

  async processVoicePayment(voiceUrl: string, sender: string): Promise<Payment | null> {
    console.log(`Processing voice message from ${sender}: ${voiceUrl}`);
    
    // Mock processing - in real implementation, this would use 
    // speech-to-text to extract payment details
    return {
      id: Math.random().toString(36).substring(2, 9),
      vendorId: "resident",
      vendorName: "Resident Payment",
      amount: 3200, // Example amount
      date: new Date().toISOString().split('T')[0],
      description: "Utility payment via WhatsApp voice message",
      status: "paid",
      paymentMethod: "Bank Transfer",
    };
  }

  async processTextPayment(text: string, sender: string): Promise<Payment | null> {
    console.log(`Processing text message from ${sender}: ${text}`);
    
    // Mock processing - in real implementation, this would parse 
    // the text to extract payment details
    if (text.toLowerCase().includes("payment") || text.toLowerCase().includes("paid")) {
      return {
        id: Math.random().toString(36).substring(2, 9),
        vendorId: "resident",
        vendorName: "Resident Payment",
        amount: 5000, // Example amount
        date: new Date().toISOString().split('T')[0],
        description: "Payment reported via WhatsApp text",
        status: "pending", // Text payments might need verification
        paymentMethod: "Unknown",
      };
    }
    
    return null;
  }

  async sendConfirmation(to: string, paymentDetails: Payment): Promise<boolean> {
    console.log(`Sending confirmation to ${to} for payment of ₹${paymentDetails.amount}`);
    // In real implementation, this would send a WhatsApp message
    return true;
  }
}

export const whatsappProcessor = new MockWhatsAppProcessor();

export default WhatsappIcon;
