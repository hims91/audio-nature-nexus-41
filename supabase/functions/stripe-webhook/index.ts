
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

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
  if (!signature) {
    return new Response('No signature', { status: 400 });
  }

  try {
    const body = await req.text();
    console.log('Webhook received:', body);

    // Parse the webhook event
    const event = JSON.parse(body);
    
    console.log('Processing webhook event:', event.type);

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        console.log('Checkout session completed:', session.id);

        // Update order status to paid
        const { error: orderError } = await supabase
          .from('orders')
          .update({
            payment_status: 'paid',
            stripe_payment_intent_id: session.payment_intent,
            status: 'processing'
          })
          .eq('stripe_session_id', session.id);

        if (orderError) {
          console.error('Error updating order:', orderError);
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
          console.error('Error fetching order:', fetchError);
          throw fetchError;
        }

        // Send order confirmation email
        if (order) {
          try {
            const emailResponse = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/send-order-confirmation`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`,
              },
              body: JSON.stringify({ order }),
            });

            if (!emailResponse.ok) {
              console.error('Failed to send order confirmation email');
            } else {
              console.log('Order confirmation email sent successfully');
            }
          } catch (emailError) {
            console.error('Error sending order confirmation email:', emailError);
          }
        }

        break;
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object;
        console.log('Payment intent succeeded:', paymentIntent.id);
        
        // Additional payment processing if needed
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object;
        console.log('Payment intent failed:', paymentIntent.id);

        // Update order status to failed
        const { error } = await supabase
          .from('orders')
          .update({
            payment_status: 'failed',
            status: 'cancelled'
          })
          .eq('stripe_payment_intent_id', paymentIntent.id);

        if (error) {
          console.error('Error updating failed order:', error);
        }
        
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
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
