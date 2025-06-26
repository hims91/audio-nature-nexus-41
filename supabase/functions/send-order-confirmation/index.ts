
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface OrderConfirmationRequest {
  order: {
    id: string;
    order_number: string;
    email: string;
    total_cents: number;
    subtotal_cents: number;
    shipping_cents?: number;
    tax_cents?: number;
    discount_cents?: number;
    discount_code?: string;
    status: string;
    payment_status: string;
    shipping_first_name?: string;
    shipping_last_name?: string;
    shipping_address_line1?: string;
    shipping_address_line2?: string;
    shipping_city?: string;
    shipping_state?: string;
    shipping_postal_code?: string;
    shipping_country?: string;
    created_at: string;
    items: Array<{
      product_name: string;
      variant_name?: string;
      quantity: number;
      unit_price_cents: number;
      total_price_cents: number;
    }>;
  };
}

const formatPrice = (cents: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(cents / 100);
};

const generateOrderEmailHtml = (order: OrderConfirmationRequest['order']) => {
  const itemsHtml = order.items.map(item => `
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">
        ${item.product_name}${item.variant_name ? ` - ${item.variant_name}` : ''}
      </td>
      <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; text-align: center;">
        ${item.quantity}
      </td>
      <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; text-align: right;">
        ${formatPrice(item.unit_price_cents)}
      </td>
      <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; text-align: right;">
        ${formatPrice(item.total_price_cents)}
      </td>
    </tr>
  `).join('');

  const orderDate = new Date(order.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Confirmation - ${order.order_number}</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #10b981; margin-bottom: 10px;">Terra Echo Studios</h1>
        <h2 style="color: #6b7280; margin-top: 0;">Order Confirmation</h2>
      </div>
      
      <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h3 style="margin-top: 0; color: #10b981;">Thank you for your order!</h3>
        <p>Hi ${order.shipping_first_name || 'Customer'},</p>
        <p>We've received your order and will process it soon. Here are the details:</p>
        
        <div style="margin: 20px 0;">
          <strong>Order Number:</strong> ${order.order_number}<br>
          <strong>Order Date:</strong> ${orderDate}<br>
          <strong>Order Status:</strong> ${order.status}<br>
          <strong>Payment Status:</strong> ${order.payment_status}
        </div>
      </div>

      <div style="margin-bottom: 20px;">
        <h3>Order Items</h3>
        <table style="width: 100%; border-collapse: collapse; border: 1px solid #e5e7eb;">
          <thead>
            <tr style="background-color: #f9fafb;">
              <th style="padding: 12px; text-align: left; border-bottom: 1px solid #e5e7eb;">Item</th>
              <th style="padding: 12px; text-align: center; border-bottom: 1px solid #e5e7eb;">Qty</th>
              <th style="padding: 12px; text-align: right; border-bottom: 1px solid #e5e7eb;">Price</th>
              <th style="padding: 12px; text-align: right; border-bottom: 1px solid #e5e7eb;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>
      </div>

      <div style="margin-bottom: 20px;">
        <h3>Order Summary</h3>
        <div style="background-color: #f9fafb; padding: 15px; border-radius: 8px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
            <span>Subtotal:</span>
            <span>${formatPrice(order.subtotal_cents)}</span>
          </div>
          ${order.shipping_cents && order.shipping_cents > 0 ? `
          <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
            <span>Shipping:</span>
            <span>${formatPrice(order.shipping_cents)}</span>
          </div>
          ` : ''}
          ${order.tax_cents && order.tax_cents > 0 ? `
          <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
            <span>Tax:</span>
            <span>${formatPrice(order.tax_cents)}</span>
          </div>
          ` : ''}
          ${order.discount_cents && order.discount_cents > 0 ? `
          <div style="display: flex; justify-content: space-between; margin-bottom: 5px; color: #10b981;">
            <span>Discount${order.discount_code ? ` (${order.discount_code})` : ''}:</span>
            <span>-${formatPrice(order.discount_cents)}</span>
          </div>
          ` : ''}
          <hr style="margin: 10px 0;">
          <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 1.1em;">
            <span>Total:</span>
            <span>${formatPrice(order.total_cents)}</span>
          </div>
        </div>
      </div>

      ${order.shipping_address_line1 ? `
      <div style="margin-bottom: 20px;">
        <h3>Shipping Address</h3>
        <div style="background-color: #f9fafb; padding: 15px; border-radius: 8px;">
          ${order.shipping_first_name} ${order.shipping_last_name}<br>
          ${order.shipping_address_line1}<br>
          ${order.shipping_address_line2 ? `${order.shipping_address_line2}<br>` : ''}
          ${order.shipping_city}, ${order.shipping_state} ${order.shipping_postal_code}<br>
          ${order.shipping_country || 'US'}
        </div>
      </div>
      ` : ''}

      <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
        <h3 style="margin-top: 0; color: #92400e;">What's Next?</h3>
        <ul style="margin: 0; padding-left: 20px;">
          <li>We'll prepare your items for shipment</li>
          <li>You'll receive a shipping notification with tracking details</li>
          <li>Your order will be delivered within 5-7 business days</li>
        </ul>
      </div>

      <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280;">
        <p>Thank you for choosing Terra Echo Studios!</p>
        <p>Questions? Contact us at <a href="mailto:TerraEchoStudios@gmail.com" style="color: #10b981;">TerraEchoStudios@gmail.com</a></p>
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
    const { order }: OrderConfirmationRequest = await req.json();

    console.log("Sending order confirmation email...", { 
      orderId: order.id, 
      orderNumber: order.order_number, 
      email: order.email 
    });

    // Use your verified domain
    const fromEmail = "Terra Echo Studios <noreply@terraechostudio.com>";
    
    const emailResponse = await resend.emails.send({
      from: fromEmail,
      to: [order.email],
      subject: `Order Confirmation - ${order.order_number}`,
      html: generateOrderEmailHtml(order),
    });

    console.log("Order confirmation email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-order-confirmation function:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.response?.data || error.stack
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
