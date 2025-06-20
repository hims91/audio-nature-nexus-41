
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from 'https://esm.sh/stripe@14.21.0';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RetryPaymentRequest {
  order_id: string;
  session_id?: string;
  retry_count?: number;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
    });

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { order_id, session_id, retry_count = 1 }: RetryPaymentRequest = await req.json();

    console.log(`Processing payment retry for order ${order_id}, attempt ${retry_count}`);

    // Get order details
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select(`
        *,
        items:order_items(*)
      `)
      .eq('id', order_id)
      .single();

    if (orderError || !order) {
      throw new Error('Order not found');
    }

    // Check if order is already paid
    if (order.payment_status === 'paid') {
      return new Response(JSON.stringify({ 
        success: true, 
        message: 'Order is already paid' 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    }

    // Log retry attempt
    await supabase
      .from('payment_retry_logs')
      .insert({
        order_id,
        retry_count,
        attempted_at: new Date().toISOString(),
        reason: 'User initiated retry'
      });

    let stripeSession;

    if (session_id) {
      // Try to retrieve existing session
      try {
        stripeSession = await stripe.checkout.sessions.retrieve(session_id);
        
        if (stripeSession.status === 'complete') {
          // Session is complete, update order
          await supabase
            .from('orders')
            .update({
              payment_status: 'paid',
              status: 'processing',
              stripe_payment_intent_id: stripeSession.payment_intent as string
            })
            .eq('id', order_id);

          return new Response(JSON.stringify({ 
            success: true, 
            message: 'Payment found and order updated' 
          }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
          });
        }
      } catch (error) {
        console.log('Could not retrieve existing session, creating new one');
      }
    }

    // Create new checkout session for retry
    const line_items = order.items?.map((item: any) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.product_name,
          metadata: {
            product_id: item.product_id,
            variant_id: item.variant_id || '',
          },
        },
        unit_amount: item.unit_price_cents,
      },
      quantity: item.quantity,
    })) || [];

    const newSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: `${req.headers.get('origin')}/order-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get('origin')}/orders/${order_id}?retry=failed`,
      customer_email: order.email,
      automatic_tax: { enabled: true },
      metadata: {
        order_id: order.id,
        retry_attempt: retry_count.toString(),
        original_session_id: session_id || '',
      },
    });

    // Update order with new session ID
    await supabase
      .from('orders')
      .update({
        stripe_session_id: newSession.id,
        payment_status: 'pending',
        status: 'pending'
      })
      .eq('id', order_id);

    // Log successful retry session creation
    await supabase
      .from('payment_retry_logs')
      .update({
        success: true,
        new_session_id: newSession.id,
        retry_url: newSession.url
      })
      .eq('order_id', order_id)
      .eq('retry_count', retry_count);

    console.log(`Payment retry session created: ${newSession.id}`);

    return new Response(JSON.stringify({ 
      retry_url: newSession.url,
      session_id: newSession.id,
      retry_count 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error: any) {
    console.error('Payment retry failed:', error);
    
    return new Response(JSON.stringify({ 
      error: error.message,
      retry_failed: true 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
