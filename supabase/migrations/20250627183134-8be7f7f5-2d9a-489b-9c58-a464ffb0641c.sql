
-- Fix the delete_product_with_orders function to handle foreign key constraints properly
-- The issue is that order_items.product_id is NOT NULL, so we can't set it to NULL
-- Instead, we'll make product_id nullable and preserve order history

-- First, make product_id nullable in order_items to allow preserving order history
ALTER TABLE public.order_items 
ALTER COLUMN product_id DROP NOT NULL;

-- Now recreate the delete function with proper error handling
CREATE OR REPLACE FUNCTION public.delete_product_with_orders(product_id_param UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  affected_orders INTEGER;
BEGIN
  -- Check if product exists
  IF NOT EXISTS (SELECT 1 FROM public.products WHERE id = product_id_param) THEN
    RAISE NOTICE 'Product with ID % does not exist', product_id_param;
    RETURN FALSE;
  END IF;

  -- Count affected order items for logging
  SELECT COUNT(*) INTO affected_orders 
  FROM public.order_items 
  WHERE product_id = product_id_param;
  
  RAISE NOTICE 'Found % order items referencing product %', affected_orders, product_id_param;

  -- First, preserve order history by setting product_id to NULL in order_items
  -- This maintains the order record but removes the foreign key reference
  UPDATE public.order_items 
  SET product_id = NULL
  WHERE product_id = product_id_param;
  
  RAISE NOTICE 'Updated % order items to remove product reference', affected_orders;

  -- Now we can safely delete the product
  DELETE FROM public.products 
  WHERE id = product_id_param;
  
  RAISE NOTICE 'Successfully deleted product %', product_id_param;
  
  RETURN TRUE;
  
EXCEPTION 
  WHEN OTHERS THEN
    RAISE NOTICE 'Error deleting product %: %', product_id_param, SQLERRM;
    RETURN FALSE;
END;
$$;

-- Update the foreign key constraint to allow the new behavior
-- Drop and recreate with SET NULL behavior for better handling
ALTER TABLE public.order_items 
DROP CONSTRAINT IF EXISTS order_items_product_id_fkey;

ALTER TABLE public.order_items 
ADD CONSTRAINT order_items_product_id_fkey 
FOREIGN KEY (product_id) REFERENCES public.products(id) 
ON DELETE SET NULL;
