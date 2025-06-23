
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
    "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-CHECKOUT] ${step}${detailsStr}`);
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep('Starting checkout session creation...');

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
    });
    logStep('Stripe initialized successfully');

    // Parse request body
    const { items, shipping_address, customer_email, success_url, cancel_url } = await req.json();
    logStep('Received checkout request', { 
      items: items?.length, 
      customer_email, 
      has_shipping: !!shipping_address 
    });

    if (!items || items.length === 0) {
      throw new Error('No items provided');
    }

    // Process cart items and build line items
    const lineItems = [];
    let orderItems = [];
    let subtotalCents = 0;

    for (const item of items) {
      logStep('Processing item', item.product_id);
      
      // Get product details
      const { data: product, error: productError } = await supabase
        .from('products')
        .select('*')
        .eq('id', item.product_id)
        .single();

      if (productError || !product) {
        logStep('Product not found', { productId: item.product_id, error: productError });
        throw new Error(`Product not found: ${item.product_id}`);
      }

      logStep('Found product', product.name);

      let price = product.price_cents;
      let productName = product.name;
      let variantName = null;

      // Handle variants
      if (item.variant_id) {
        const { data: variant, error: variantError } = await supabase
          .from('product_variants')
          .select('*')
          .eq('id', item.variant_id)
          .single();

        if (variant && !variantError) {
          price = variant.price_cents || product.price_cents;
          variantName = variant.name;
        }
      }

      const itemTotal = price * item.quantity;
      subtotalCents += itemTotal;

      // Add to Stripe line items
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: variantName ? `${productName} - ${variantName}` : productName,
          },
          unit_amount: price,
        },
        quantity: item.quantity,
      });

      // Store for order creation
      orderItems.push({
        product_id: item.product_id,
        variant_id: item.variant_id,
        quantity: item.quantity,
        unit_price_cents: price,
        total_price_cents: itemTotal,
        product_name: productName,
        variant_name: variantName,
      });

      logStep('Added line item', { name: productName, price, qty: item.quantity });
    }

    logStep('Total order amount', { subtotal: subtotalCents });

    // Create Stripe checkout session first
    logStep('Creating Stripe checkout session...');
    const session = await stripe.checkout.sessions.create({
      customer_email: customer_email,
      line_items: lineItems,
      mode: 'payment',
      success_url: success_url,
      cancel_url: cancel_url,
      shipping_address_collection: {
        allowed_countries: ['US'],
      },
      payment_intent_data: {
        metadata: {
          customer_email: customer_email,
        },
      },
      metadata: {
        customer_email: customer_email,
      },
    });

    logStep('Checkout session created', session.id);

    // Create order record in database
    logStep('Creating order record...');
    
    // Get user ID if customer is authenticated
    let userId = null;
    try {
      const authHeader = req.headers.get('Authorization');
      if (authHeader) {
        const token = authHeader.replace('Bearer ', '');
        const { data: userData } = await supabase.auth.getUser(token);
        userId = userData?.user?.id || null;
      }
    } catch (error) {
      logStep('Could not get user ID', error);
      // Continue without user ID for guest checkout
    }

    const orderData = {
      user_id: userId,
      email: customer_email,
      status: 'pending',
      payment_status: 'pending',
      subtotal_cents: subtotalCents,
      shipping_cents: 0, // Will be updated by webhook
      tax_cents: 0, // Will be updated by webhook
      discount_cents: 0,
      total_cents: subtotalCents, // Will be updated by webhook with final amount
      stripe_session_id: session.id,
      // Store shipping address if provided
      ...(shipping_address && {
        shipping_first_name: shipping_address.first_name,
        shipping_last_name: shipping_address.last_name,
        shipping_address_line1: shipping_address.address_line1,
        shipping_address_line2: shipping_address.address_line2,
        shipping_city: shipping_address.city,
        shipping_state: shipping_address.state,
        shipping_postal_code: shipping_address.postal_code,
        shipping_country: shipping_address.country || 'US',
        shipping_phone: shipping_address.phone,
      }),
    };

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert(orderData)
      .select()
      .single();

    if (orderError) {
      logStep('Error creating order', orderError);
      throw new Error(`Failed to create order: ${orderError.message}`);
    }

    logStep('Order created successfully', { orderId: order.id, orderNumber: order.order_number });

    // Create order items
    const orderItemsWithOrderId = orderItems.map(item => ({
      ...item,
      order_id: order.id,
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItemsWithOrderId);

    if (itemsError) {
      logStep('Error creating order items', itemsError);
      throw new Error(`Failed to create order items: ${itemsError.message}`);
    }

    logStep('Order items created successfully');

    return new Response(JSON.stringify({ 
      url: session.url,
      order_id: order.id,
      order_number: order.order_number,
      session_id: session.id
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    logStep("Error in create-checkout-session function", error);
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
