
import { Payment, WhatsAppPayment } from "@/lib/types";
import { toast } from "@/hooks/use-toast";
import { sendPaymentReceiptNotification } from "@/lib/api";

export interface WhatsAppMessage {
  id: string;
  sender: string;
  timestamp: Date;
  messageType: 'text' | 'image' | 'voice';
  content: string;
  mediaUrl?: string;
  processed: boolean;
  paymentId?: string;
  residentUnit?: string;
  residentName?: string;
}

export interface WhatsAppPaymentProcessor {
  processImagePayment: (imageUrl: string, sender: string, residentData?: { name: string, unit: string }) => Promise<Payment | null>;
  processVoicePayment: (voiceUrl: string, sender: string, residentData?: { name: string, unit: string }) => Promise<Payment | null>;
  processTextPayment: (text: string, sender: string, residentData?: { name: string, unit: string }) => Promise<Payment | null>;
  sendConfirmation: (to: string, paymentDetails: Payment, residentData?: { name: string, unit: string }) => Promise<boolean>;
}

// This would be implemented with actual WhatsApp Business API
export class WhatsAppProcessor implements WhatsAppPaymentProcessor {
  async processImagePayment(imageUrl: string, sender: string, residentData?: { name: string, unit: string }): Promise<Payment | null> {
    console.log(`Processing payment image from ${sender}: ${imageUrl}`);
    
    // Mock processing - in real implementation, this would use 
    // OCR to extract payment details from screenshot
    const payment: Payment = {
      id: crypto.randomUUID(),
      vendorId: "resident",
      vendorName: residentData?.name || "Resident Payment",
      amount: 5500, // Example amount
      date: new Date().toISOString().split('T')[0],
      description: "Maintenance payment via WhatsApp",
      status: "paid",
      paymentMethod: "UPI",
      whatsappSource: sender
    };
    
    // Send confirmation if we have resident data
    if (residentData) {
      this.sendConfirmation(sender, payment, residentData)
        .catch(err => console.error("Error sending confirmation:", err));
    }
    
    return payment;
  }

  async processVoicePayment(voiceUrl: string, sender: string, residentData?: { name: string, unit: string }): Promise<Payment | null> {
    console.log(`Processing voice message from ${sender}: ${voiceUrl}`);
    
    // Mock processing - in real implementation, this would use 
    // speech-to-text to extract payment details
    const payment: Payment = {
      id: crypto.randomUUID(),
      vendorId: "resident",
      vendorName: residentData?.name || "Resident Payment",
      amount: 3200, // Example amount
      date: new Date().toISOString().split('T')[0],
      description: "Utility payment via WhatsApp voice message",
      status: "paid",
      paymentMethod: "Bank Transfer",
      whatsappSource: sender
    };
    
    // Send confirmation if we have resident data
    if (residentData) {
      this.sendConfirmation(sender, payment, residentData)
        .catch(err => console.error("Error sending confirmation:", err));
    }
    
    return payment;
  }

  async processTextPayment(text: string, sender: string, residentData?: { name: string, unit: string }): Promise<Payment | null> {
    console.log(`Processing text message from ${sender}: ${text}`);
    
    // Mock processing - in real implementation, this would parse 
    // the text to extract payment details
    if (text.toLowerCase().includes("payment") || text.toLowerCase().includes("paid")) {
      const payment: Payment = {
        id: crypto.randomUUID(),
        vendorId: "resident",
        vendorName: residentData?.name || "Resident Payment",
        amount: 5000, // Example amount
        date: new Date().toISOString().split('T')[0],
        description: "Payment reported via WhatsApp text",
        status: "pending", // Text payments might need verification
        paymentMethod: "Unknown",
        whatsappSource: sender
      };
      
      // Send confirmation if we have resident data
      if (residentData) {
        this.sendConfirmation(sender, payment, residentData)
          .catch(err => console.error("Error sending confirmation:", err));
      }
      
      return payment;
    }
    
    return null;
  }

  async sendConfirmation(to: string, paymentDetails: Payment, residentData?: { name: string, unit: string }): Promise<boolean> {
    console.log(`Sending confirmation to ${to} for payment of ₹${paymentDetails.amount}`);
    
    try {
      // Use the Edge Function to send the notification
      const result = await sendPaymentReceiptNotification({
        paymentId: paymentDetails.id,
        residentName: residentData?.name || "Resident",
        residentUnit: residentData?.unit || "Unknown",
        amount: paymentDetails.amount,
        date: paymentDetails.date,
        paymentMethod: paymentDetails.paymentMethod || "Unknown",
        whatsappNumber: to
      });
      
      if (result.success) {
        toast({
          title: "Confirmation sent",
          description: `Payment confirmation sent to ${residentData?.name || "resident"} via WhatsApp`
        });
        return true;
      } else {
        toast({
          title: "Confirmation failed",
          description: "Could not send payment confirmation via WhatsApp",
          variant: "destructive"
        });
        return false;
      }
    } catch (error) {
      console.error("Error sending confirmation:", error);
      return false;
    }
  }
}

export const whatsappProcessor = new WhatsAppProcessor();

export default WhatsAppProcessor;
