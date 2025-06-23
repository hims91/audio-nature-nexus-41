
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from 'https://esm.sh/stripe@14.21.0';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, stripe-signature",
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const signature = req.headers.get('stripe-signature');
  const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
  
  if (!signature) {
    console.error('No Stripe signature found');
    return new Response('No signature', { status: 400 });
  }

  if (!webhookSecret) {
    console.error('STRIPE_WEBHOOK_SECRET not configured');
    return new Response('Webhook secret not configured', { status: 500 });
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  );

  const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
    apiVersion: '2023-10-16',
  });

  try {
    const body = await req.text();
    console.log('Webhook signature verification starting...');

    // Verify webhook signature
    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    
    console.log('Processing webhook event:', event.type, 'ID:', event.id);

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log('Checkout session completed:', session.id);

        // Update order status to paid
        const { data: order, error: orderError } = await supabase
          .from('orders')
          .update({
            payment_status: 'paid',
            stripe_payment_intent_id: session.payment_intent as string,
            status: 'processing',
            updated_at: new Date().toISOString()
          })
          .eq('stripe_session_id', session.id)
          .select('*')
          .single();

        if (orderError) {
          console.error('Error updating order:', orderError);
          throw orderError;
        }

        if (!order) {
          console.log('No order found for session:', session.id);
          break;
        }

        console.log('Order updated successfully:', order.id);

        // Get order items for email
        const { data: orderItems, error: itemsError } = await supabase
          .from('order_items')
          .select('*')
          .eq('order_id', order.id);

        if (itemsError) {
          console.error('Error fetching order items:', itemsError);
        }

        // Send order confirmation email
        try {
          const emailResponse = await supabase.functions.invoke('send-order-confirmation', {
            body: {
              order: {
                ...order,
                items: orderItems || []
              }
            }
          });

          if (emailResponse.error) {
            console.error('Failed to send confirmation email:', emailResponse.error);
          } else {
            console.log('Order confirmation email sent successfully');
          }
        } catch (emailError) {
          console.error('Error sending confirmation email:', emailError);
        }

        break;
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log('Payment intent succeeded:', paymentIntent.id);
        
        // Additional payment processing if needed
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log('Payment intent failed:', paymentIntent.id);

        // Update order status to failed
        const { error } = await supabase
          .from('orders')
          .update({
            payment_status: 'failed',
            status: 'cancelled',
            updated_at: new Date().toISOString()
          })
          .eq('stripe_payment_intent_id', paymentIntent.id);

        if (error) {
          console.error('Error updating failed order:', error);
        }
        
        break;
      }

      case 'invoice.payment_succeeded': {
        // Handle subscription payments
        const invoice = event.data.object as Stripe.Invoice;
        console.log('Invoice payment succeeded:', invoice.id);
        break;
      }

      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        // Handle subscription changes
        const subscription = event.data.object as Stripe.Subscription;
        console.log('Subscription updated/deleted:', subscription.id);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in stripe-webhook function:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        type: 'webhook_error'
      }),
      {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
