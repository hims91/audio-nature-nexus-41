
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ShippingNotificationRequest {
  orderId: string;
  orderNumber: string;
  customerEmail: string;
  customerName: string;
  trackingNumber: string;
  trackingUrl?: string;
  carrier?: string;
}

const generateShippingEmailHtml = (data: ShippingNotificationRequest) => {
  const carrierName = data.carrier ? data.carrier.toUpperCase() : 'your carrier';
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Your Order Has Shipped - ${data.orderNumber}</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #10b981;">Terra Echo Studios</h1>
        <h2 style="color: #6b7280;">Your Order Has Shipped!</h2>
      </div>
      
      <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h3 style="margin-top: 0;">Good news, ${data.customerName}!</h3>
        <p>Your order <strong>${data.orderNumber}</strong> has been shipped and is on its way to you.</p>
      </div>

      <div style="margin-bottom: 20px;">
        <h3>Tracking Information</h3>
        <div style="background-color: #f9fafb; padding: 15px; border-radius: 8px;">
          <div style="margin-bottom: 10px;">
            <strong>Tracking Number:</strong> ${data.trackingNumber}
          </div>
          <div style="margin-bottom: 10px;">
            <strong>Carrier:</strong> ${carrierName}
          </div>
          ${data.trackingUrl ? `
          <div style="margin-top: 15px;">
            <a href="${data.trackingUrl}" 
               style="background-color: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;"
               target="_blank">
              Track Your Package
            </a>
          </div>
          ` : ''}
        </div>
      </div>

      <div style="margin-bottom: 20px;">
        <h3>What's Next?</h3>
        <ul style="padding-left: 20px;">
          <li>Your package is now in transit</li>
          <li>You can track its progress using the tracking number above</li>
          <li>Delivery typically takes 3-7 business days depending on your location</li>
          <li>You'll receive an update when your package is delivered</li>
        </ul>
      </div>

      <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
        <p style="margin: 0;"><strong>Important:</strong> Please ensure someone is available to receive the package, or check if your carrier offers package holding options if you'll be away.</p>
      </div>

      <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280;">
        <p>Questions about your order?</p>
        <p>Contact us at <a href="mailto:TerraEchoStudios@gmail.com" style="color: #10b981;">TerraEchoStudios@gmail.com</a></p>
        <p>Thank you for choosing Terra Echo Studios!</p>
      </div>
    </body>
    </html>
  `;
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: ShippingNotificationRequest = await req.json();

    const emailResponse = await resend.emails.send({
      from: "Terra Echo Studios <orders@terraechostudios.com>",
      to: [data.customerEmail],
      subject: `Your Order ${data.orderNumber} Has Shipped!`,
      html: generateShippingEmailHtml(data),
    });

    console.log("Shipping notification sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-shipping-notification function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
