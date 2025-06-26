
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
  trackingNumber?: string;
  trackingUrl?: string;
  carrier?: string;
  status: string;
}

const generateShippingEmailHtml = (data: ShippingNotificationRequest) => {
  const carrierName = data.carrier ? data.carrier.toUpperCase() : 'your carrier';
  const isDelivered = data.status === 'delivered';
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${isDelivered ? 'Order Delivered' : 'Order Shipped'} - ${data.orderNumber}</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
      <div style="background-color: white; border-radius: 12px; padding: 30px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #10b981; padding-bottom: 20px;">
          <h1 style="color: #10b981; margin: 0; font-size: 28px;">Terra Echo Studios</h1>
          <h2 style="color: #374151; margin: 10px 0 0 0; font-size: 24px;">
            ${isDelivered ? '📦 Order Delivered!' : '🚚 Order Shipped!'}
          </h2>
        </div>
        
        <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 25px; border-radius: 8px; margin-bottom: 25px;">
          <h3 style="margin-top: 0; font-size: 18px;">
            ${isDelivered ? `Great news, ${data.customerName}!` : `Good news, ${data.customerName}!`}
          </h3>
          <p style="margin: 0; font-size: 16px;">
            ${isDelivered 
              ? `Your order <strong>${data.orderNumber}</strong> has been delivered successfully!`
              : `Your order <strong>${data.orderNumber}</strong> has been shipped and is on its way to you.`
            }
          </p>
        </div>

        ${data.trackingNumber && !isDelivered ? `
        <div style="margin-bottom: 25px;">
          <h3 style="color: #374151; border-bottom: 1px solid #e5e7eb; padding-bottom: 10px;">📍 Tracking Information</h3>
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; border-left: 4px solid #10b981;">
            <div style="margin-bottom: 12px;">
              <strong style="color: #374151;">Tracking Number:</strong> 
              <span style="font-family: 'Courier New', monospace; background-color: #e5e7eb; padding: 4px 8px; border-radius: 4px;">${data.trackingNumber}</span>
            </div>
            <div style="margin-bottom: 15px;">
              <strong style="color: #374151;">Carrier:</strong> ${carrierName}
            </div>
            ${data.trackingUrl ? `
            <div style="margin-top: 20px;">
              <a href="${data.trackingUrl}" 
                 style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold; box-shadow: 0 2px 4px rgba(16, 185, 129, 0.3);"
                 target="_blank">
                🔍 Track Your Package
              </a>
            </div>
            ` : ''}
          </div>
        </div>
        ` : ''}

        <div style="margin-bottom: 25px;">
          <h3 style="color: #374151; border-bottom: 1px solid #e5e7eb; padding-bottom: 10px;">
            ${isDelivered ? '✅ Delivery Complete' : '📋 What\'s Next?'}
          </h3>
          ${isDelivered ? `
          <div style="background-color: #d1fae5; padding: 20px; border-radius: 8px; border-left: 4px solid #10b981;">
            <p style="margin: 0; color: #065f46;">
              <strong>Your order has been successfully delivered!</strong><br>
              We hope you're delighted with your purchase. If you have any questions or concerns about your order, please don't hesitate to contact us.
            </p>
          </div>
          ` : `
          <ul style="padding-left: 25px; color: #374151;">
            <li style="margin-bottom: 8px;">Your package is now in transit</li>
            <li style="margin-bottom: 8px;">You can track its progress using the tracking number above</li>
            <li style="margin-bottom: 8px;">Delivery typically takes 3-7 business days depending on your location</li>
            <li style="margin-bottom: 8px;">You'll receive an update when your package is delivered</li>
          </ul>
          `}
        </div>

        ${!isDelivered ? `
        <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; margin-bottom: 25px; border-left: 4px solid #f59e0b;">
          <p style="margin: 0; color: #92400e;">
            <strong>📝 Important:</strong> Please ensure someone is available to receive the package, or check if your carrier offers package holding options if you'll be away.
          </p>
        </div>
        ` : ''}

        <div style="text-align: center; margin-top: 30px; padding-top: 25px; border-top: 2px solid #e5e7eb;">
          <div style="margin-bottom: 15px;">
            <p style="margin: 0; color: #6b7280; font-size: 16px;"><strong>Questions about your order?</strong></p>
            <p style="margin: 5px 0; color: #6b7280;">
              Contact us at <a href="mailto:TerraEchoStudios@gmail.com" style="color: #10b981; text-decoration: none; font-weight: bold;">TerraEchoStudios@gmail.com</a>
            </p>
          </div>
          <div style="background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%); padding: 15px; border-radius: 8px;">
            <p style="margin: 0; color: #374151; font-weight: bold;">Thank you for choosing Terra Echo Studios! 🎵</p>
            <p style="margin: 5px 0 0 0; color: #6b7280; font-size: 14px;">Professional Audio Engineering Services</p>
          </div>
        </div>
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
    console.log('Sending shipping notification:', { orderId: data.orderId, status: data.status, email: data.customerEmail });

    const subject = data.status === 'delivered' 
      ? `Your Order ${data.orderNumber} Has Been Delivered!`
      : `Your Order ${data.orderNumber} Has Shipped!`;

    const emailResponse = await resend.emails.send({
      from: "Terra Echo Studios <noreply@terraechostudio.com>",
      to: [data.customerEmail],
      subject: subject,
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
