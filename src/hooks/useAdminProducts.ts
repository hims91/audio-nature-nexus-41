import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Product, ProductCategory, ProductVariant, ProductImage } from '@/types/ecommerce';
import { toast } from 'sonner';

// Hook for admin product queries with advanced filtering
export const useAdminProducts = (filters?: {
  categoryId?: string;
  isActive?: boolean;
  search?: string;
  isOutOfStock?: boolean;
  limit?: number;
  offset?: number;
}) => {
  return useQuery({
    queryKey: ['admin-products', filters],
    queryFn: async (): Promise<{ products: Product[]; total: number }> => {
      let query = supabase
        .from('products')
        .select(`
          *,
          category:product_categories(*),
          images:product_images(*),
          variants:product_variants(*)
        `, { count: 'exact' });

      if (filters?.categoryId) {
        query = query.eq('category_id', filters.categoryId);
      }

      if (filters?.isActive !== undefined) {
        query = query.eq('is_active', filters.isActive);
      }

      if (filters?.search) {
        query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%,sku.ilike.%${filters.search}%`);
      }

      if (filters?.isOutOfStock) {
        query = query.eq('track_inventory', true).lte('inventory_quantity', 0);
      }

      if (filters?.limit) {
        query = query.limit(filters.limit);
      }

      if (filters?.offset) {
        query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
      }

      query = query.order('created_at', { ascending: false });

      const { data, error, count } = await query;
      if (error) throw error;
      
      return { 
        products: data || [], 
        total: count || 0 
      };
    },
  });
};

// Hook for single product with admin privileges
export const useAdminProduct = (id: string) => {
  return useQuery({
    queryKey: ['admin-product', id],
    queryFn: async (): Promise<Product | null> => {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          category:product_categories(*),
          images:product_images(*),
          variants:product_variants(*)
        `)
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null;
        throw error;
      }
      return data;
    },
    enabled: !!id,
  });
};

// Hook for product statistics
export const useProductStats = () => {
  return useQuery({
    queryKey: ['product-stats'],
    queryFn: async () => {
      const [productsResult, categoriesResult, lowStockResult] = await Promise.all([
        supabase.from('products').select('*', { count: 'exact', head: true }),
        supabase.from('product_categories').select('*', { count: 'exact', head: true }),
        supabase
          .from('products')
          .select('*', { count: 'exact', head: true })
          .eq('track_inventory', true)
          .lte('inventory_quantity', 5)
      ]);

      return {
        totalProducts: productsResult.count || 0,
        totalCategories: categoriesResult.count || 0,
        lowStockCount: lowStockResult.count || 0,
      };
    },
  });
};

// Hook for creating/updating products
export const useProductMutations = () => {
  const queryClient = useQueryClient();

  const createProduct = useMutation({
    mutationFn: async (productData: Partial<Product>) => {
      const { data, error } = await supabase
        .from('products')
        .insert(productData)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      queryClient.invalidateQueries({ queryKey: ['product-stats'] });
      toast.success('Product created successfully');
    },
    onError: (error) => {
      console.error('Error creating product:', error);
      toast.error('Failed to create product');
    },
  });

  const updateProduct = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      const { data, error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      queryClient.invalidateQueries({ queryKey: ['admin-product'] });
      queryClient.invalidateQueries({ queryKey: ['product-stats'] });
      toast.success('Product updated successfully');
    },
    onError: (error) => {
      console.error('Error updating product:', error);
      toast.error('Failed to update product');
    },
  });

  const deleteProduct = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      queryClient.invalidateQueries({ queryKey: ['product-stats'] });
      toast.success('Product deleted successfully');
    },
    onError: (error) => {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
    },
  });

  const bulkUpdateProducts = useMutation({
    mutationFn: async (updates: { ids: string[]; updates: Partial<Product> }) => {
      const { data, error } = await supabase
        .from('products')
        .update(updates.updates)
        .in('id', updates.ids)
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      queryClient.invalidateQueries({ queryKey: ['product-stats'] });
      toast.success(`${data?.length || 0} products updated successfully`);
    },
    onError: (error) => {
      console.error('Error bulk updating products:', error);
      toast.error('Failed to update products');
    },
  });

  return {
    createProduct,
    updateProduct,
    deleteProduct,
    bulkUpdateProducts,
  };
};