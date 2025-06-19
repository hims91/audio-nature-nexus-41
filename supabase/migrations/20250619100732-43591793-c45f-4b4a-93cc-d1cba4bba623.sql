
-- Create e-commerce related tables

-- Product categories table
CREATE TABLE public.product_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Products table
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  short_description TEXT,
  price_cents INTEGER NOT NULL, -- Price in cents to avoid decimal issues
  compare_at_price_cents INTEGER, -- Original price for sale items
  sku TEXT UNIQUE,
  category_id UUID REFERENCES public.product_categories(id),
  inventory_quantity INTEGER DEFAULT 0,
  track_inventory BOOLEAN DEFAULT true,
  allow_backorders BOOLEAN DEFAULT false,
  weight_grams INTEGER, -- For shipping calculations
  requires_shipping BOOLEAN DEFAULT true,
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  meta_title TEXT,
  meta_description TEXT,
  stripe_product_id TEXT, -- Stripe product ID for sync
  stripe_price_id TEXT, -- Stripe price ID for sync
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Product images table
CREATE TABLE public.product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  alt_text TEXT,
  sort_order INTEGER DEFAULT 0,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Product variants table (for size, color variations)
CREATE TABLE public.product_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  name TEXT NOT NULL, -- e.g., "Small", "Red", "Small/Red"
  sku TEXT UNIQUE,
  price_cents INTEGER, -- Override product price if different
  inventory_quantity INTEGER DEFAULT 0,
  option1_name TEXT, -- e.g., "Size"
  option1_value TEXT, -- e.g., "Small"
  option2_name TEXT, -- e.g., "Color"
  option2_value TEXT, -- e.g., "Red"
  option3_name TEXT,
  option3_value TEXT,
  stripe_price_id TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Shopping cart table
CREATE TABLE public.shopping_cart (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id TEXT, -- For guest users
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  variant_id UUID REFERENCES public.product_variants(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, product_id, variant_id),
  UNIQUE(session_id, product_id, variant_id)
);

-- Orders table
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  email TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded')),
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  
  -- Pricing
  subtotal_cents INTEGER NOT NULL,
  shipping_cents INTEGER DEFAULT 0,
  tax_cents INTEGER DEFAULT 0,
  discount_cents INTEGER DEFAULT 0,
  total_cents INTEGER NOT NULL,
  
  -- Shipping information
  shipping_first_name TEXT,
  shipping_last_name TEXT,
  shipping_address_line1 TEXT,
  shipping_address_line2 TEXT,
  shipping_city TEXT,
  shipping_state TEXT,
  shipping_postal_code TEXT,
  shipping_country TEXT DEFAULT 'US',
  shipping_phone TEXT,
  
  -- Billing information (can be same as shipping)
  billing_first_name TEXT,
  billing_last_name TEXT,
  billing_address_line1 TEXT,
  billing_address_line2 TEXT,
  billing_city TEXT,
  billing_state TEXT,
  billing_postal_code TEXT,
  billing_country TEXT DEFAULT 'US',
  
  -- Stripe integration
  stripe_session_id TEXT,
  stripe_payment_intent_id TEXT,
  
  -- Tracking
  tracking_number TEXT,
  tracking_url TEXT,
  shipped_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  
  -- Notes
  customer_notes TEXT,
  admin_notes TEXT,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Order items table
CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id),
  variant_id UUID REFERENCES public.product_variants(id),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price_cents INTEGER NOT NULL,
  total_price_cents INTEGER NOT NULL,
  product_name TEXT NOT NULL, -- Snapshot of product name at time of order
  variant_name TEXT, -- Snapshot of variant name
  sku TEXT, -- Snapshot of SKU
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Inventory logs table for tracking stock changes
CREATE TABLE public.inventory_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES public.products(id),
  variant_id UUID REFERENCES public.product_variants(id),
  change_type TEXT NOT NULL CHECK (change_type IN ('sale', 'restock', 'adjustment', 'return')),
  quantity_change INTEGER NOT NULL,
  previous_quantity INTEGER NOT NULL,
  new_quantity INTEGER NOT NULL,
  reference_id UUID, -- Could be order_id for sales
  notes TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shopping_cart ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for public read access to active products
CREATE POLICY "Anyone can view active product categories" ON public.product_categories
  FOR SELECT USING (is_active = true);

CREATE POLICY "Anyone can view active products" ON public.products
  FOR SELECT USING (is_active = true);

CREATE POLICY "Anyone can view product images" ON public.product_images
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.products 
      WHERE products.id = product_images.product_id 
      AND products.is_active = true
    )
  );

CREATE POLICY "Anyone can view active product variants" ON public.product_variants
  FOR SELECT USING (
    is_active = true AND 
    EXISTS (
      SELECT 1 FROM public.products 
      WHERE products.id = product_variants.product_id 
      AND products.is_active = true
    )
  );

-- RLS Policies for shopping cart
CREATE POLICY "Users can manage their own cart" ON public.shopping_cart
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Guest users can manage cart by session" ON public.shopping_cart
  FOR ALL USING (auth.uid() IS NULL AND session_id IS NOT NULL);

-- RLS Policies for orders
CREATE POLICY "Users can view their own orders" ON public.orders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own order items" ON public.order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.orders 
      WHERE orders.id = order_items.order_id 
      AND orders.user_id = auth.uid()
    )
  );

-- Admin policies (will be created after admin functions are set up)
CREATE POLICY "Admins can manage all product categories" ON public.product_categories
  FOR ALL USING (public.is_admin());

CREATE POLICY "Admins can manage all products" ON public.products
  FOR ALL USING (public.is_admin());

CREATE POLICY "Admins can manage all product images" ON public.product_images
  FOR ALL USING (public.is_admin());

CREATE POLICY "Admins can manage all product variants" ON public.product_variants
  FOR ALL USING (public.is_admin());

CREATE POLICY "Admins can view all orders" ON public.orders
  FOR ALL USING (public.is_admin());

CREATE POLICY "Admins can view all order items" ON public.order_items
  FOR ALL USING (public.is_admin());

CREATE POLICY "Admins can manage inventory logs" ON public.inventory_logs
  FOR ALL USING (public.is_admin());

-- Create storage bucket for product images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'product-images',
  'product-images',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
);

-- Storage policies for product images
CREATE POLICY "Anyone can view product images" ON storage.objects
  FOR SELECT USING (bucket_id = 'product-images');

CREATE POLICY "Admins can upload product images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'product-images' AND 
    public.is_admin()
  );

CREATE POLICY "Admins can update product images" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'product-images' AND 
    public.is_admin()
  );

CREATE POLICY "Admins can delete product images" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'product-images' AND 
    public.is_admin()
  );

-- Create updated_at trigger for all tables
CREATE TRIGGER update_product_categories_updated_at
  BEFORE UPDATE ON public.product_categories
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_product_variants_updated_at
  BEFORE UPDATE ON public.product_variants
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_shopping_cart_updated_at
  BEFORE UPDATE ON public.shopping_cart
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function to generate order numbers
CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS TEXT AS $$
DECLARE
  prefix TEXT := 'TE';
  timestamp_part TEXT;
  random_part TEXT;
  order_number TEXT;
BEGIN
  -- Get current timestamp in format YYMMDD
  timestamp_part := to_char(now(), 'YYMMDD');
  
  -- Generate 4 random digits
  random_part := LPAD(floor(random() * 10000)::TEXT, 4, '0');
  
  -- Combine parts
  order_number := prefix || timestamp_part || random_part;
  
  -- Check if order number already exists, if so regenerate
  WHILE EXISTS (SELECT 1 FROM public.orders WHERE order_number = order_number) LOOP
    random_part := LPAD(floor(random() * 10000)::TEXT, 4, '0');
    order_number := prefix || timestamp_part || random_part;
  END LOOP;
  
  RETURN order_number;
END;
$$ LANGUAGE plpgsql;

-- Function to update inventory when order is placed
CREATE OR REPLACE FUNCTION public.update_inventory_on_order()
RETURNS TRIGGER AS $$
BEGIN
  -- Update product inventory if track_inventory is true
  UPDATE public.products 
  SET inventory_quantity = inventory_quantity - NEW.quantity
  WHERE id = NEW.product_id 
    AND track_inventory = true;
  
  -- Update variant inventory if variant exists and track_inventory is true
  IF NEW.variant_id IS NOT NULL THEN
    UPDATE public.product_variants
    SET inventory_quantity = inventory_quantity - NEW.quantity
    WHERE id = NEW.variant_id;
  END IF;
  
  -- Log inventory change
  INSERT INTO public.inventory_logs (
    product_id,
    variant_id,
    change_type,
    quantity_change,
    previous_quantity,
    new_quantity,
    reference_id
  )
  SELECT 
    NEW.product_id,
    NEW.variant_id,
    'sale',
    -NEW.quantity,
    COALESCE(p.inventory_quantity + NEW.quantity, 0),
    COALESCE(p.inventory_quantity, 0),
    NEW.order_id
  FROM public.products p
  WHERE p.id = NEW.product_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update inventory when order items are inserted
CREATE TRIGGER update_inventory_on_order_trigger
  AFTER INSERT ON public.order_items
  FOR EACH ROW EXECUTE FUNCTION public.update_inventory_on_order();

-- Insert some default product categories
INSERT INTO public.product_categories (name, slug, description, sort_order) VALUES
('Apparel', 'apparel', 'T-shirts, hoodies, and other clothing items', 1),
('Accessories', 'accessories', 'Stickers, pins, and other accessories', 2),
('Music', 'music', 'Digital downloads and physical music products', 3);
