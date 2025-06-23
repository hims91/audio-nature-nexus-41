
-- First, drop existing trigger and function to avoid conflicts
DROP TRIGGER IF EXISTS set_order_number_trigger ON public.orders;
DROP FUNCTION IF EXISTS public.set_order_number();
DROP FUNCTION IF EXISTS public.generate_order_number();
DROP SEQUENCE IF EXISTS order_number_seq;

-- Create the sequence
CREATE SEQUENCE order_number_seq START 1000;

-- Create the generate_order_number function
CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS TEXT AS $$
BEGIN
  RETURN 'ORD-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(NEXTVAL('order_number_seq')::TEXT, 6, '0');
END;
$$ LANGUAGE plpgsql;

-- Create the trigger function with explicit column reference
CREATE OR REPLACE FUNCTION public.set_order_number()
RETURNS TRIGGER AS $$
DECLARE
  generated_order_number TEXT;
BEGIN
  -- Use NEW.order_number explicitly to avoid ambiguity
  IF NEW.order_number IS NULL OR NEW.order_number = '' THEN
    generated_order_number := public.generate_order_number();
    NEW.order_number := generated_order_number;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger
CREATE TRIGGER set_order_number_trigger
  BEFORE INSERT ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.set_order_number();
