
-- Fix the orders table to match what the edge function expects
-- Add missing columns that are referenced in the create-checkout-session function
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS total_amount_cents INTEGER;

-- Update the create-checkout-session function to use correct column names
-- Also add a table for payment retry logs as referenced in retry-payment function
CREATE TABLE IF NOT EXISTS public.payment_retry_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  retry_count INTEGER NOT NULL,
  attempted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  reason TEXT,
  success BOOLEAN DEFAULT false,
  new_session_id TEXT,
  retry_url TEXT,
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add missing indexes for better performance
CREATE INDEX IF NOT EXISTS idx_orders_stripe_session_id ON public.orders(stripe_session_id);
CREATE INDEX IF NOT EXISTS idx_orders_stripe_payment_intent_id ON public.orders(stripe_payment_intent_id);
CREATE INDEX IF NOT EXISTS idx_orders_email ON public.orders(email);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON public.orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_payment_retry_logs_order_id ON public.payment_retry_logs(order_id);

-- Add RLS policies for payment_retry_logs
ALTER TABLE public.payment_retry_logs ENABLE ROW LEVEL SECURITY;

-- Allow service role to insert/update retry logs (for edge functions)
CREATE POLICY "Service role can manage payment retry logs" ON public.payment_retry_logs
  FOR ALL USING (true);

-- Add a trigger to automatically set order_number if not provided
CREATE OR REPLACE FUNCTION set_order_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.order_number IS NULL OR NEW.order_number = '' THEN
    NEW.order_number := generate_order_number();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for order_number generation
DROP TRIGGER IF EXISTS set_order_number_trigger ON public.orders;
CREATE TRIGGER set_order_number_trigger
  BEFORE INSERT ON public.orders
  FOR EACH ROW EXECUTE FUNCTION set_order_number();

-- Add check constraints for order status values
ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_status_check;
ALTER TABLE public.orders ADD CONSTRAINT orders_status_check 
  CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'));

ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_payment_status_check;
ALTER TABLE public.orders ADD CONSTRAINT orders_payment_status_check 
  CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded'));

ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_fulfillment_status_check;
ALTER TABLE public.orders ADD CONSTRAINT orders_fulfillment_status_check 
  CHECK (fulfillment_status IN ('unfulfilled', 'partial', 'fulfilled'));
