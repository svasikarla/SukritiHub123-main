
import { supabase } from "@/integrations/supabase/client";

/**
 * Send a payment receipt notification via WhatsApp
 */
export async function sendPaymentReceiptNotification({
  paymentId,
  residentName,
  residentUnit,
  amount,
  date,
  receiptNumber,
  paymentMethod,
  whatsappNumber
}: {
  paymentId: string;
  residentName: string;
  residentUnit: string;
  amount: number;
  date: string;
  receiptNumber?: string;
  paymentMethod: string;
  whatsappNumber?: string;
}) {
  try {
    const { data, error } = await supabase.functions.invoke('payment-receipt-notification', {
      body: {
        paymentId,
        residentName,
        residentUnit,
        amount,
        date,
        receiptNumber,
        paymentMethod,
        whatsappNumber
      }
    });

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error("Error sending payment receipt notification:", error);
    return { success: false, error };
  }
}

/**
 * Send a payout notification to vendors
 */
export async function sendPayoutNotification({
  payoutId,
  vendorName,
  amount,
  date,
  purpose,
  paymentMethod,
  recipientPhone,
  recipientEmail
}: {
  payoutId: string;
  vendorName: string;
  amount: number;
  date: string;
  purpose: string;
  paymentMethod: string;
  recipientPhone?: string;
  recipientEmail?: string;
}) {
  try {
    const { data, error } = await supabase.functions.invoke('payout-notification', {
      body: {
        payoutId,
        vendorName,
        amount,
        date,
        purpose,
        paymentMethod,
        recipientPhone,
        recipientEmail
      }
    });

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error("Error sending payout notification:", error);
    return { success: false, error };
  }
}
