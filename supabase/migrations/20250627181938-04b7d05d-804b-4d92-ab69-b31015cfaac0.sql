
-- First, let's check the current foreign key constraint and modify it
-- We'll drop the existing constraint and recreate it with CASCADE or SET NULL behavior

-- Drop the existing foreign key constraint
ALTER TABLE public.order_items 
DROP CONSTRAINT IF EXISTS order_items_product_id_fkey;

-- Recreate the constraint with RESTRICT but allow manual deletion
-- We'll keep the constraint for data integrity but handle it differently
ALTER TABLE public.order_items 
ADD CONSTRAINT order_items_product_id_fkey 
FOREIGN KEY (product_id) REFERENCES public.products(id) 
ON DELETE RESTRICT;

-- Create a function to handle product deletion with order history
CREATE OR REPLACE FUNCTION public.delete_product_with_orders(product_id_param UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- First, update order_items to set product info to preserve order history
  UPDATE public.order_items 
  SET product_id = NULL
  WHERE product_id = product_id_param;
  
  -- Then delete the product
  DELETE FROM public.products 
  WHERE id = product_id_param;
  
  RETURN TRUE;
EXCEPTION 
  WHEN OTHERS THEN
    RETURN FALSE;
END;
$$;

-- Grant execute permission to authenticated users (admins will be checked in RLS)
GRANT EXECUTE ON FUNCTION public.delete_product_with_orders(UUID) TO authenticated;
