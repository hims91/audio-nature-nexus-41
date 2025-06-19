
-- Add product reviews and ratings system
CREATE TABLE public.product_reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  review_text TEXT,
  is_verified_purchase BOOLEAN DEFAULT false,
  is_approved BOOLEAN DEFAULT true,
  helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add discount codes system
CREATE TABLE public.discount_codes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  description TEXT,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed_amount')),
  discount_value INTEGER NOT NULL, -- percentage (1-100) or cents for fixed amount
  minimum_order_cents INTEGER DEFAULT 0,
  maximum_discount_cents INTEGER, -- cap for percentage discounts
  usage_limit INTEGER, -- null for unlimited
  usage_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  starts_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add order discount tracking
ALTER TABLE public.orders ADD COLUMN discount_code TEXT;
ALTER TABLE public.orders ADD COLUMN discount_code_id UUID REFERENCES public.discount_codes(id);

-- Add enhanced order tracking
ALTER TABLE public.orders ADD COLUMN fulfillment_status TEXT DEFAULT 'unfulfilled' CHECK (fulfillment_status IN ('unfulfilled', 'partial', 'fulfilled'));
ALTER TABLE public.orders ADD COLUMN payment_method TEXT;
ALTER TABLE public.orders ADD COLUMN payment_gateway TEXT DEFAULT 'stripe';

-- Enable RLS for product reviews
ALTER TABLE public.product_reviews ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read approved reviews
CREATE POLICY "Anyone can view approved reviews" ON public.product_reviews
  FOR SELECT USING (is_approved = true);

-- Allow authenticated users to create reviews
CREATE POLICY "Users can create their own reviews" ON public.product_reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own reviews
CREATE POLICY "Users can update their own reviews" ON public.product_reviews
  FOR UPDATE USING (auth.uid() = user_id);

-- Allow admins to manage all reviews
CREATE POLICY "Admins can manage all reviews" ON public.product_reviews
  FOR ALL USING (public.is_admin());

-- Enable RLS for discount codes
ALTER TABLE public.discount_codes ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read active discount codes for validation
CREATE POLICY "Anyone can read active discount codes" ON public.discount_codes
  FOR SELECT USING (is_active = true AND (starts_at IS NULL OR starts_at <= now()) AND (expires_at IS NULL OR expires_at > now()));

-- Allow admins to manage discount codes
CREATE POLICY "Admins can manage discount codes" ON public.discount_codes
  FOR ALL USING (public.is_admin());

-- Add indexes for performance
CREATE INDEX idx_product_reviews_product_id ON public.product_reviews(product_id);
CREATE INDEX idx_product_reviews_user_id ON public.product_reviews(user_id);
CREATE INDEX idx_product_reviews_rating ON public.product_reviews(rating);
CREATE INDEX idx_discount_codes_code ON public.discount_codes(code);
CREATE INDEX idx_discount_codes_active ON public.discount_codes(is_active) WHERE is_active = true;
CREATE INDEX idx_orders_discount_code ON public.orders(discount_code) WHERE discount_code IS NOT NULL;

-- Add trigger to update discount code usage count
CREATE OR REPLACE FUNCTION update_discount_usage()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.discount_code_id IS NOT NULL AND (OLD.discount_code_id IS NULL OR OLD.payment_status != 'paid') AND NEW.payment_status = 'paid' THEN
    UPDATE public.discount_codes 
    SET usage_count = usage_count + 1
    WHERE id = NEW.discount_code_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_discount_usage
  AFTER UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION update_discount_usage();

-- Add function to validate discount codes
CREATE OR REPLACE FUNCTION public.validate_discount_code(
  code_text TEXT,
  order_total_cents INTEGER
) RETURNS TABLE (
  is_valid BOOLEAN,
  discount_id UUID,
  discount_amount_cents INTEGER,
  error_message TEXT
) AS $$
DECLARE
  discount_record public.discount_codes%ROWTYPE;
  calculated_discount INTEGER;
BEGIN
  -- Find the discount code
  SELECT * INTO discount_record
  FROM public.discount_codes
  WHERE code = code_text AND is_active = true;

  -- Check if code exists
  IF NOT FOUND THEN
    RETURN QUERY SELECT false, NULL::UUID, 0, 'Invalid discount code';
    RETURN;
  END IF;

  -- Check if code is within date range
  IF discount_record.starts_at IS NOT NULL AND discount_record.starts_at > now() THEN
    RETURN QUERY SELECT false, NULL::UUID, 0, 'Discount code is not yet active';
    RETURN;
  END IF;

  IF discount_record.expires_at IS NOT NULL AND discount_record.expires_at <= now() THEN
    RETURN QUERY SELECT false, NULL::UUID, 0, 'Discount code has expired';
    RETURN;
  END IF;

  -- Check usage limit
  IF discount_record.usage_limit IS NOT NULL AND discount_record.usage_count >= discount_record.usage_limit THEN
    RETURN QUERY SELECT false, NULL::UUID, 0, 'Discount code usage limit reached';
    RETURN;
  END IF;

  -- Check minimum order amount
  IF order_total_cents < discount_record.minimum_order_cents THEN
    RETURN QUERY SELECT false, NULL::UUID, 0, 'Order does not meet minimum amount for this discount';
    RETURN;
  END IF;

  -- Calculate discount amount
  IF discount_record.discount_type = 'percentage' THEN
    calculated_discount := (order_total_cents * discount_record.discount_value) / 100;
    -- Apply maximum discount cap if set
    IF discount_record.maximum_discount_cents IS NOT NULL AND calculated_discount > discount_record.maximum_discount_cents THEN
      calculated_discount := discount_record.maximum_discount_cents;
    END IF;
  ELSE
    calculated_discount := discount_record.discount_value;
  END IF;

  -- Ensure discount doesn't exceed order total
  IF calculated_discount > order_total_cents THEN
    calculated_discount := order_total_cents;
  END IF;

  RETURN QUERY SELECT true, discount_record.id, calculated_discount, NULL::TEXT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
