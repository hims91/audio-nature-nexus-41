
-- Create payment retry logs table for tracking payment retry attempts
CREATE TABLE IF NOT EXISTS public.payment_retry_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  retry_count INTEGER NOT NULL DEFAULT 1,
  attempted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  success BOOLEAN DEFAULT FALSE,
  error_message TEXT,
  new_session_id TEXT,
  retry_url TEXT,
  reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_payment_retry_logs_order_id ON public.payment_retry_logs(order_id);
CREATE INDEX IF NOT EXISTS idx_payment_retry_logs_attempted_at ON public.payment_retry_logs(attempted_at);

-- Enable RLS
ALTER TABLE public.payment_retry_logs ENABLE ROW LEVEL SECURITY;

-- Create policies for payment retry logs
CREATE POLICY "Admin can view all payment retry logs" ON public.payment_retry_logs
  FOR SELECT
  USING (public.is_admin());

CREATE POLICY "Service can insert payment retry logs" ON public.payment_retry_logs
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Service can update payment retry logs" ON public.payment_retry_logs
  FOR UPDATE
  USING (true);
