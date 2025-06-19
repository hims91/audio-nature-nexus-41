
export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  short_description?: string;
  price_cents: number;
  compare_at_price_cents?: number;
  sku?: string;
  category_id?: string;
  inventory_quantity: number;
  track_inventory: boolean;
  allow_backorders: boolean;
  weight_grams?: number;
  requires_shipping: boolean;
  is_active: boolean;
  is_featured: boolean;
  meta_title?: string;
  meta_description?: string;
  stripe_product_id?: string;
  stripe_price_id?: string;
  created_at: string;
  updated_at: string;
  category?: ProductCategory;
  images?: ProductImage[];
  variants?: ProductVariant[];
}

export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  alt_text?: string;
  sort_order: number;
  is_primary: boolean;
  created_at: string;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  name: string;
  sku?: string;
  price_cents?: number;
  inventory_quantity: number;
  option1_name?: string;
  option1_value?: string;
  option2_name?: string;
  option2_value?: string;
  option3_name?: string;
  option3_value?: string;
  stripe_price_id?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  id: string;
  user_id?: string;
  session_id?: string;
  product_id: string;
  variant_id?: string;
  quantity: number;
  created_at: string;
  updated_at: string;
  product?: Product;
  variant?: ProductVariant;
}

export interface Order {
  id: string;
  order_number: string;
  user_id?: string;
  email: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  subtotal_cents: number;
  shipping_cents: number;
  tax_cents: number;
  discount_cents: number;
  total_cents: number;
  shipping_first_name?: string;
  shipping_last_name?: string;
  shipping_address_line1?: string;
  shipping_address_line2?: string;
  shipping_city?: string;
  shipping_state?: string;
  shipping_postal_code?: string;
  shipping_country?: string;
  shipping_phone?: string;
  billing_first_name?: string;
  billing_last_name?: string;
  billing_address_line1?: string;
  billing_address_line2?: string;
  billing_city?: string;
  billing_state?: string;
  billing_postal_code?: string;
  billing_country?: string;
  stripe_session_id?: string;
  stripe_payment_intent_id?: string;
  tracking_number?: string;
  tracking_url?: string;
  shipped_at?: string;
  delivered_at?: string;
  customer_notes?: string;
  admin_notes?: string;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  variant_id?: string;
  quantity: number;
  unit_price_cents: number;
  total_price_cents: number;
  product_name: string;
  variant_name?: string;
  sku?: string;
  created_at: string;
}

export interface ShippingAddress {
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
