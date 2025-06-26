
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
  const timestamp = new Date().toISOString();
  const detailsStr = details ? ` - ${JSON.stringify(details, null, 2)}` : '';
  console.log(`[${timestamp}] [STRIPE-WEBHOOK] ${step}${detailsStr}`);
};

const clearUserCart = async (userId: string | null, customerEmail: string) => {
  try {
    if (userId) {
      // Clear authenticated user's cart
      const { error } = await supabase
        .from('shopping_cart')
        .delete()
        .eq('user_id', userId);
      
      if (error) {
        logStep('Error clearing user cart:', error);
      } else {
        logStep('Successfully cleared authenticated user cart', { userId });
      }
    } else {
      // For guest checkout, we'll rely on frontend clearing since we don't have session_id here
      logStep('Guest checkout detected, cart clearing will be handled by frontend');
    }
  } catch (error) {
    logStep('Error in clearUserCart:', error);
  }
};

const sendOrderConfirmationWithRetry = async (order: any, maxRetries = 3) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      logStep(`Attempting to send order confirmation email (attempt ${attempt}/${maxRetries})`, { orderId: order.id });
      
      const emailResponse = await supabase.functions.invoke('send-order-confirmation', {
        body: { order },
      });

      if (emailResponse.error) {
        throw new Error(`Email service error: ${JSON.stringify(emailResponse.error)}`);
      }

      logStep('Order confirmation email sent successfully', { orderId: order.id, attempt, response: emailResponse.data });
      return true;
    } catch (emailError) {
      logStep(`Email attempt ${attempt} failed:`, { error: emailError.message, orderId: order.id });
      
      if (attempt === maxRetries) {
        logStep('All email attempts failed, giving up', { orderId: order.id });
        return false;
      }
      
      // Wait before retry (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
    }
  }
  return false;
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const signature = req.headers.get('stripe-signature');
  if (!signature) {
    logStep('ERROR: No Stripe signature provided');
    return new Response('No signature', { status: 400 });
  }

  try {
    const body = await req.text();
    logStep('Webhook received, body length:', body.length);

    // Initialize Stripe for webhook verification
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
    });

    // Verify webhook signature using async method
    let event;
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
    
    if (webhookSecret) {
      try {
        // Use the async version for Deno environment
        event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret);
        logStep('Webhook signature verified successfully', { eventType: event.type });
      } catch (err: any) {
        logStep('ERROR: Webhook signature verification failed:', { error: err.message, signature });
        return new Response(`Webhook signature verification failed: ${err.message}`, { status: 400 });
      }
    } else {
      logStep('WARNING: No webhook secret configured, parsing without verification');
      event = JSON.parse(body);
    }
    
    logStep('Processing webhook event:', { type: event.type, id: event.id });

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        logStep('Checkout session completed:', { 
          sessionId: session.id, 
          paymentStatus: session.payment_status,
          customerEmail: session.customer_email || session.customer_details?.email,
          amountTotal: session.amount_total
        });

        // Find the order by session ID
        const { data: existingOrder, error: findError } = await supabase
          .from('orders')
          .select('*')
          .eq('stripe_session_id', session.id)
          .single();

        if (findError) {
          logStep('Database error finding order:', { error: findError, sessionId: session.id });
          return new Response(`Database error: ${findError.message}`, { status: 500 });
        }

        if (!existingOrder) {
          logStep('Order not found for session:', { sessionId: session.id });
          return new Response('Order not found', { status: 404 });
        }

        logStep('Found existing order:', { 
          orderId: existingOrder.id, 
          orderNumber: existingOrder.order_number,
          currentStatus: existingOrder.status,
          currentPaymentStatus: existingOrder.payment_status
        });

        // Calculate final amounts including shipping and tax
        const shippingCost = session.shipping_cost?.amount_total || 0;
        const taxAmount = session.total_details?.amount_tax || 0;
        const subtotal = session.amount_subtotal || 0;
        const total = session.amount_total || 0;

        // Update order status to paid with final amounts
        const { data: updatedOrder, error: orderError } = await supabase
          .from('orders')
          .update({
            payment_status: 'paid',
            stripe_payment_intent_id: session.payment_intent,
            status: 'processing',
            shipping_cents: shippingCost,
            tax_cents: taxAmount,
            total_cents: total,
            // Update shipping address from Stripe session if available
            shipping_first_name: session.shipping_details?.name?.split(' ')[0] || session.customer_details?.name?.split(' ')[0],
            shipping_last_name: session.shipping_details?.name?.split(' ').slice(1).join(' ') || session.customer_details?.name?.split(' ').slice(1).join(' '),
            shipping_address_line1: session.shipping_details?.address?.line1 || session.customer_details?.address?.line1,
            shipping_address_line2: session.shipping_details?.address?.line2 || session.customer_details?.address?.line2,
            shipping_city: session.shipping_details?.address?.city || session.customer_details?.address?.city,
            shipping_state: session.shipping_details?.address?.state || session.customer_details?.address?.state,
            shipping_postal_code: session.shipping_details?.address?.postal_code || session.customer_details?.address?.postal_code,
            shipping_country: session.shipping_details?.address?.country || session.customer_details?.address?.country,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existingOrder.id)
          .select()
          .single();

        if (orderError) {
          logStep('Error updating order:', { error: orderError, orderId: existingOrder.id });
          return new Response(`Order update failed: ${orderError.message}`, { status: 500 });
        }

        if (!updatedOrder) {
          logStep('No order returned after update:', existingOrder.id);
          return new Response('Order update failed - no data returned', { status: 500 });
        }

        logStep('Order updated successfully', { 
          orderId: updatedOrder.id, 
          orderNumber: updatedOrder.order_number,
          newPaymentStatus: updatedOrder.payment_status,
          newStatus: updatedOrder.status,
          totalCents: updatedOrder.total_cents
        });

        // Clear the user's cart
        await clearUserCart(updatedOrder.user_id, updatedOrder.email || session.customer_email);

        // Get the complete order with items for email
        const { data: orderWithItems, error: fetchError } = await supabase
          .from('orders')
          .select(`
            *,
            items:order_items(*)
          `)
          .eq('id', updatedOrder.id)
          .single();

        if (fetchError) {
          logStep('Error fetching order for email:', fetchError);
          // Don't fail the webhook for email fetch error
        } else if (orderWithItems) {
          logStep('Sending order confirmation email', { orderId: orderWithItems.id, itemCount: orderWithItems.items?.length });
          
          // Send order confirmation email with retry logic
          const emailSent = await sendOrderConfirmationWithRetry(orderWithItems);
          if (!emailSent) {
            logStep('Failed to send order confirmation email after all retries', { orderId: orderWithItems.id });
            // Don't throw here - order is still successful even if email fails
          }
        }

        break;
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object;
        logStep('Payment intent succeeded:', { paymentIntentId: paymentIntent.id, amount: paymentIntent.amount });
        
        // Additional payment processing if needed
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object;
        logStep('Payment intent failed:', { paymentIntentId: paymentIntent.id, lastPaymentError: paymentIntent.last_payment_error });

        // Update order status to failed
        const { error } = await supabase
          .from('orders')
          .update({
            payment_status: 'failed',
            status: 'cancelled',
            updated_at: new Date().toISOString(),
          })
          .eq('stripe_payment_intent_id', paymentIntent.id);

        if (error) {
          logStep('Error updating failed order:', error);
        } else {
          logStep('Order marked as failed due to payment failure', { paymentIntentId: paymentIntent.id });
        }
        
        break;
      }

      default:
        logStep(`Unhandled event type: ${event.type}`);
    }

    return new Response(JSON.stringify({ received: true, processed: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    logStep("Critical error in stripe-webhook function:", { 
      error: error.message, 
      stack: error.stack,
      name: error.name
    });
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
