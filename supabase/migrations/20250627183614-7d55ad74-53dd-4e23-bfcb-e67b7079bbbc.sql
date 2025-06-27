
-- Update the delete_product_with_orders function with enhanced debugging
CREATE OR REPLACE FUNCTION public.delete_product_with_orders(product_id_param UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  affected_orders INTEGER;
  product_exists BOOLEAN;
BEGIN
  -- Check if product exists
  SELECT EXISTS(SELECT 1 FROM public.products WHERE id = product_id_param) INTO product_exists;
  
  IF NOT product_exists THEN
    RAISE NOTICE 'Product with ID % does not exist', product_id_param;
    RETURN FALSE;
  END IF;

  RAISE NOTICE 'Product % exists, proceeding with deletion', product_id_param;

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

  -- Delete related product images
  DELETE FROM public.product_images 
  WHERE product_id = product_id_param;
  
  RAISE NOTICE 'Deleted product images for product %', product_id_param;

  -- Delete related product variants
  DELETE FROM public.product_variants 
  WHERE product_id = product_id_param;
  
  RAISE NOTICE 'Deleted product variants for product %', product_id_param;

  -- Now we can safely delete the product
  DELETE FROM public.products 
  WHERE id = product_id_param;
  
  RAISE NOTICE 'Successfully deleted product %', product_id_param;
  
  RETURN TRUE;
  
EXCEPTION 
  WHEN OTHERS THEN
    RAISE NOTICE 'Error deleting product %: % - %', product_id_param, SQLSTATE, SQLERRM;
    RETURN FALSE;
END;
$$;
