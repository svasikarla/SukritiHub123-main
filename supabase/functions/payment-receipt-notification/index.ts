
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PaymentReceiptRequest {
  paymentId: string;
  residentName: string;
  residentUnit: string;
  amount: number;
  date: string;
  receiptNumber?: string;
  paymentMethod: string;
  whatsappNumber?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { paymentId, residentName, residentUnit, amount, date, receiptNumber, paymentMethod, whatsappNumber } = await req.json() as PaymentReceiptRequest;

    console.log(`Processing payment receipt notification for ${residentName} (Unit: ${residentUnit})`);
    console.log(`Payment details: ₹${amount} paid on ${date} via ${paymentMethod}`);
    
    // In a real implementation, this would:
    // 1. Send a WhatsApp message using the WhatsApp Business API
    // 2. Store the notification status in the database
    // 3. Generate a receipt PDF if needed

    // Here's a mock response for now
    const notificationId = crypto.randomUUID();
    const response = {
      success: true,
      notificationId,
      message: `Payment receipt notification sent to ${residentName}`,
      timestamp: new Date().toISOString(),
      paymentId
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  } catch (error) {
    console.error("Error processing payment receipt notification:", error);
    
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
