
-- Update the delete_product_with_orders function with better error handling and debugging
CREATE OR REPLACE FUNCTION public.delete_product_with_orders(product_id_param UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  affected_orders INTEGER;
  product_exists BOOLEAN;
  affected_images INTEGER;
  affected_variants INTEGER;
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
  
  GET DIAGNOSTICS affected_orders = ROW_COUNT;
  RAISE NOTICE 'Updated % order items to remove product reference', affected_orders;

  -- Delete related product images
  DELETE FROM public.product_images 
  WHERE product_id = product_id_param;
  
  GET DIAGNOSTICS affected_images = ROW_COUNT;
  RAISE NOTICE 'Deleted % product images for product %', affected_images, product_id_param;

  -- Delete related product variants
  DELETE FROM public.product_variants 
  WHERE product_id = product_id_param;
  
  GET DIAGNOSTICS affected_variants = ROW_COUNT;
  RAISE NOTICE 'Deleted % product variants for product %', affected_variants, product_id_param;

  -- Now we can safely delete the product
  DELETE FROM public.products 
  WHERE id = product_id_param;
  
  -- Verify the product was actually deleted
  SELECT EXISTS(SELECT 1 FROM public.products WHERE id = product_id_param) INTO product_exists;
  
  IF product_exists THEN
    RAISE NOTICE 'ERROR: Product % still exists after deletion attempt', product_id_param;
    RETURN FALSE;
  END IF;
  
  RAISE NOTICE 'Successfully deleted product %', product_id_param;
  
  RETURN TRUE;
  
EXCEPTION 
  WHEN OTHERS THEN
    RAISE NOTICE 'Error deleting product %: SQLSTATE = %, SQLERRM = %', product_id_param, SQLSTATE, SQLERRM;
    RETURN FALSE;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.delete_product_with_orders(UUID) TO authenticated;
