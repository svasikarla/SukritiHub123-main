
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PayoutNotificationRequest {
  payoutId: string;
  vendorName: string;
  amount: number;
  date: string;
  purpose: string;
  paymentMethod: string;
  recipientPhone?: string;
  recipientEmail?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { payoutId, vendorName, amount, date, purpose, paymentMethod, recipientPhone, recipientEmail } = await req.json() as PayoutNotificationRequest;

    console.log(`Processing payout notification for ${vendorName}`);
    console.log(`Payout details: ₹${amount} paid on ${date} for ${purpose} via ${paymentMethod}`);
    
    // In a real implementation, this would:
    // 1. Send a WhatsApp message or email to the vendor
    // 2. Store the notification status in the database
    // 3. Generate a payment advice PDF if needed

    // Here's a mock response for now
    const notificationId = crypto.randomUUID();
    const response = {
      success: true,
      notificationId,
      message: `Payout notification sent to ${vendorName}`,
      timestamp: new Date().toISOString(),
      payoutId
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  } catch (error) {
    console.error("Error processing payout notification:", error);
    
    return new Response(JSON.stringify({ 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error" 
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  }
};

serve(handler);
