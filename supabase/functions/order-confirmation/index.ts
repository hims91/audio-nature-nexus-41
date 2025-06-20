
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface EmailData {
  orderId: string;
  customerEmail: string;
  customerName: string;
  orderNumber: string;
  orderTotal: string;
  orderItems: Array<{
    name: string;
    quantity: number;
    price: string;
  }>;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    const { orderId, customerEmail, customerName, orderNumber, orderTotal, orderItems }: EmailData = await req.json()

    // Create HTML email template
    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Order Confirmation - ${orderNumber}</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #10b981; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; }
            .order-details { background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0; }
            .items-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            .items-table th, .items-table td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
            .total { font-weight: bold; font-size: 1.2em; }
            .footer { text-align: center; padding: 20px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Order Confirmation</h1>
              <p>Thank you for your order!</p>
            </div>
            
            <div class="content">
              <p>Hi ${customerName},</p>
              <p>We've received your order and are processing it now. Here are the details:</p>
              
              <div class="order-details">
                <h3>Order #${orderNumber}</h3>
                <p><strong>Total:</strong> ${orderTotal}</p>
              </div>
              
              <h3>Items Ordered:</h3>
              <table class="items-table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Quantity</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  ${orderItems.map(item => `
                    <tr>
                      <td>${item.name}</td>
                      <td>${item.quantity}</td>
                      <td>${item.price}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
              
              <p>We'll send you another email with tracking information once your order ships.</p>
              <p>If you have any questions, please don't hesitate to contact us.</p>
            </div>
            
            <div class="footer">
              <p>Terra Echo Studios</p>
              <p>Professional Audio Engineering Services</p>
            </div>
          </div>
        </body>
      </html>
    `

    // For now, we'll just log the email (in production, integrate with your email service)
    console.log('Order confirmation email would be sent to:', customerEmail)
    console.log('Email content:', emailHtml)

    // You can integrate with services like:
    // - Resend (https://resend.com)
    // - SendGrid
    // - Mailgun
    // - Amazon SES

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Order confirmation email prepared',
        emailSent: false // Set to true when actual email service is integrated
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Error in order-confirmation function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})
