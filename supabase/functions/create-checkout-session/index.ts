
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from 'https://esm.sh/stripe@14.21.0';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CheckoutItem {
  product_id: string;
  variant_id?: string;
  quantity: number;
}

interface ShippingAddress {
  first_name: string;
  last_name: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone?: string;
}

interface CheckoutRequest {
  items: CheckoutItem[];
  shipping_address?: ShippingAddress;
  customer_email?: string;
  success_url: string;
  cancel_url: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting checkout session creation...');
    
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
    });

    console.log('Stripe initialized successfully');

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log('Supabase client initialized');

    const { items, shipping_address, customer_email, success_url, cancel_url }: CheckoutRequest = await req.json();

    console.log('Received checkout request:', { items: items.length, customer_email, has_shipping: !!shipping_address });

    // Fetch product and variant data from Supabase
    const line_items = [];
    let order_total = 0;

    for (const item of items) {
      console.log(`Processing item: ${item.product_id}`);
      
      // Get product data
      const { data: product, error: productError } = await supabase
        .from('products')
        .select('*')
        .eq('id', item.product_id)
        .single();

      if (productError || !product) {
        console.error('Product fetch error:', productError);
        throw new Error(`Product not found: ${item.product_id}`);
      }

      console.log(`Found product: ${product.name}`);

      let price_cents = product.price_cents;
      let name = product.name;
      let description = product.short_description || '';

      // Get variant data if variant_id is provided
      if (item.variant_id) {
        const { data: variant, error: variantError } = await supabase
          .from('product_variants')
          .select('*')
          .eq('id', item.variant_id)
          .single();

        if (variantError || !variant) {
          console.error('Variant fetch error:', variantError);
          throw new Error(`Variant not found: ${item.variant_id}`);
        }

        if (variant.price_cents) {
          price_cents = variant.price_cents;
        }
        name = `${product.name} - ${variant.name}`;
        console.log(`Using variant: ${variant.name}`);
      }

      // Check inventory
      const available_quantity = item.variant_id 
        ? (await supabase.from('product_variants').select('inventory_quantity').eq('id', item.variant_id).single()).data?.inventory_quantity || 0
        : product.inventory_quantity;

      if (product.track_inventory && available_quantity < item.quantity && !product.allow_backorders) {
        throw new Error(`Insufficient inventory for ${name}`);
      }

      // Get primary product image
      const { data: images } = await supabase
        .from('product_images')
        .select('image_url')
        .eq('product_id', product.id)
        .eq('is_primary', true)
        .limit(1);

      const image_url = images?.[0]?.image_url;

      line_items.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name,
            description,
            images: image_url ? [image_url] : [],
            metadata: {
              product_id: item.product_id,
              variant_id: item.variant_id || '',
            },
          },
          unit_amount: price_cents,
        },
        quantity: item.quantity,
      });

      order_total += price_cents * item.quantity;
      console.log(`Added line item: ${name}, price: ${price_cents}, qty: ${item.quantity}`);
    }

    console.log(`Total order amount: ${order_total} cents`);

    // Check if a Stripe customer record exists for this user
    let customerId;
    if (customer_email) {
      const customers = await stripe.customers.list({ email: customer_email, limit: 1 });
      if (customers.data.length > 0) {
        customerId = customers.data[0].id;
        console.log(`Found existing customer: ${customerId}`);
      }
    }

    // Create Stripe checkout session
    const session_config: any = {
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url,
      cancel_url,
      automatic_tax: { enabled: true },
      shipping_address_collection: {
        allowed_countries: ['US', 'CA'],
      },
      billing_address_collection: 'required',
      metadata: {
        source: 'terra_echo_studios',
        order_total: order_total.toString(),
      },
    };

    // Add customer email if provided
    if (customer_email) {
      if (customerId) {
        session_config.customer = customerId;
      } else {
        session_config.customer_email = customer_email;
      }
    }

    // Add shipping options
    session_config.shipping_options = [
      {
        shipping_rate_data: {
          type: 'fixed_amount',
          fixed_amount: { amount: 500, currency: 'usd' }, // $5 flat rate
          display_name: 'Standard Shipping',
          delivery_estimate: {
            minimum: { unit: 'business_day', value: 5 },
            maximum: { unit: 'business_day', value: 7 },
          },
        },
      },
      {
        shipping_rate_data: {
          type: 'fixed_amount',
          fixed_amount: { amount: 1500, currency: 'usd' }, // $15 express
          display_name: 'Express Shipping',
          delivery_estimate: {
            minimum: { unit: 'business_day', value: 1 },
            maximum: { unit: 'business_day', value: 3 },
          },
        },
      },
    ];

    console.log('Creating Stripe checkout session...');
    const session = await stripe.checkout.sessions.create(session_config);

    console.log(`Checkout session created: ${session.id}`);

    // Create order record in Supabase
    if (customer_email) {
      try {
        const { data: orderData, error: orderError } = await supabase
          .from('orders')
          .insert({
            email: customer_email,
            total_amount_cents: order_total,
            status: 'pending',
            payment_status: 'pending',
            stripe_session_id: session.id,
            shipping_address: shipping_address,
          })
          .select()
          .single();

        if (orderError) {
          console.error('Error creating order:', orderError);
        } else {
          console.log(`Order created: ${orderData.id}`);
          
          // Create order items
          for (const item of items) {
            const { data: product } = await supabase
              .from('products')
              .select('name, price_cents')
              .eq('id', item.product_id)
              .single();

            let price_cents = product?.price_cents || 0;
            let product_name = product?.name || 'Unknown Product';

            if (item.variant_id) {
              const { data: variant } = await supabase
                .from('product_variants')
                .select('name, price_cents')
                .eq('id', item.variant_id)
                .single();
              
              if (variant?.price_cents) {
                price_cents = variant.price_cents;
              }
              if (variant?.name) {
                product_name = `${product_name} - ${variant.name}`;
              }
            }

            await supabase
              .from('order_items')
              .insert({
                order_id: orderData.id,
                product_id: item.product_id,
                variant_id: item.variant_id,
                quantity: item.quantity,
                unit_price_cents: price_cents,
                product_name,
              });
          }
        }
      } catch (error) {
        console.error('Error creating order record:', error);
      }
    }

    return new Response(
      JSON.stringify({ 
        url: session.url,
        session_id: session.id 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error: any) {
    console.error('Error creating checkout session:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
