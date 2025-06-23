
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import Stripe from 'https://esm.sh/stripe@14.21.0';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, stripe-signature",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[STRIPE-WEBHOOK] ${step}${detailsStr}`);
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const signature = req.headers.get('stripe-signature');
  if (!signature) {
    logStep('ERROR: No signature provided');
    return new Response('No signature', { status: 400 });
  }

  try {
    const body = await req.text();
    logStep('Webhook received, body length:', body.length);

    // Initialize Stripe for webhook verification
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
    });

    // Verify webhook signature if webhook secret is configured
    let event;
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
    
    if (webhookSecret) {
      try {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
        logStep('Webhook signature verified');
      } catch (err: any) {
        logStep('ERROR: Webhook signature verification failed:', err.message);
        return new Response(`Webhook signature verification failed: ${err.message}`, { status: 400 });
      }
    } else {
      // Fallback: parse without verification (not recommended for production)
      logStep('WARNING: No webhook secret configured, parsing without verification');
      event = JSON.parse(body);
    }
    
    logStep('Processing webhook event:', event.type);

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        logStep('Checkout session completed:', session.id);

        // Calculate final amounts including shipping and tax
        const shippingCost = session.shipping_cost?.amount_total || 0;
        const taxAmount = session.total_details?.amount_tax || 0;
        const subtotal = session.amount_subtotal || 0;
        const total = session.amount_total || 0;

        // Update order status to paid with final amounts
        const { error: orderError } = await supabase
          .from('orders')
          .update({
            payment_status: 'paid',
            stripe_payment_intent_id: session.payment_intent,
            status: 'processing',
            shipping_cents: shippingCost,
            tax_cents: taxAmount,
            total_cents: total,
            // Update shipping address from Stripe session if available
            shipping_first_name: session.shipping_details?.name?.split(' ')[0],
            shipping_last_name: session.shipping_details?.name?.split(' ').slice(1).join(' '),
            shipping_address_line1: session.shipping_details?.address?.line1,
            shipping_address_line2: session.shipping_details?.address?.line2,
            shipping_city: session.shipping_details?.address?.city,
            shipping_state: session.shipping_details?.address?.state,
            shipping_postal_code: session.shipping_details?.address?.postal_code,
            shipping_country: session.shipping_details?.address?.country,
          })
          .eq('stripe_session_id', session.id);

        if (orderError) {
          logStep('Error updating order:', orderError);
          throw orderError;
        }

        // Get the updated order with items for email
        const { data: order, error: fetchError } = await supabase
          .from('orders')
          .select(`
            *,
            items:order_items(*)
          `)
          .eq('stripe_session_id', session.id)
          .single();

        if (fetchError) {
          logStep('Error fetching order:', fetchError);
          throw fetchError;
        }

        // Send order confirmation email
        if (order) {
          try {
            const emailResponse = await supabase.functions.invoke('send-order-confirmation', {
              body: { order },
            });

            if (emailResponse.error) {
              logStep('Failed to send order confirmation email:', emailResponse.error);
            } else {
              logStep('Order confirmation email sent successfully');
            }
          } catch (emailError) {
            logStep('Error sending order confirmation email:', emailError);
          }
        }

        logStep('Order updated successfully');
        break;
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object;
        logStep('Payment intent succeeded:', paymentIntent.id);
        
        // Additional payment processing if needed
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object;
        logStep('Payment intent failed:', paymentIntent.id);

        // Update order status to failed
        const { error } = await supabase
          .from('orders')
          .update({
            payment_status: 'failed',
            status: 'cancelled'
          })
          .eq('stripe_payment_intent_id', paymentIntent.id);

        if (error) {
          logStep('Error updating failed order:', error);
        }
        
        break;
      }

      case 'invoice.payment_succeeded': {
        // Handle subscription payments if needed in the future
        logStep('Invoice payment succeeded');
        break;
      }

      case 'customer.subscription.deleted': {
        // Handle subscription cancellations if needed in the future
        logStep('Subscription deleted');
        break;
      }

      default:
        logStep(`Unhandled event type: ${event.type}`);
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    logStep("Error in stripe-webhook function:", error);
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
