
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Product, ProductCategory, ProductImage, ProductVariant } from '@/types/ecommerce';

// Categories hooks
export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async (): Promise<ProductCategory[]> => {
      const { data, error } = await supabase
        .from('product_categories')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) throw error;
      return data || [];
    },
  });
};

export const useCategoryMutations = () => {
  const queryClient = useQueryClient();

  const createCategory = useMutation({
    mutationFn: async (categoryData: Omit<ProductCategory, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('product_categories')
        .insert(categoryData)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
    },
    onError: (error) => {
      console.error('Error creating category:', error);
      toast.error('Failed to create category');
    },
  });

  const updateCategory = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<ProductCategory> }) => {
      const { data, error } = await supabase
        .from('product_categories')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
    },
    onError: (error) => {
      console.error('Error updating category:', error);
      toast.error('Failed to update category');
    },
  });

  const deleteCategory = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('product_categories')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
    },
    onError: (error) => {
      console.error('Error deleting category:', error);
      toast.error('Failed to delete category');
    },
  });

  return {
    createCategory,
    updateCategory,
    deleteCategory,
  };
};

// Products hooks
export const useProducts = (filters?: {
  categoryId?: string;
  search?: string;
  isActive?: boolean;
  limit?: number;
}) => {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: async (): Promise<Product[]> => {
      let query = supabase
        .from('products')
        .select(`
          *,
          category:product_categories(*),
          images:product_images(*),
          variants:product_variants(*)
        `);

      if (filters?.categoryId) {
        query = query.eq('category_id', filters.categoryId);
      }

      if (filters?.isActive !== undefined) {
        query = query.eq('is_active', filters.isActive);
      }

      if (filters?.search) {
        query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }

      if (filters?.limit) {
        query = query.limit(filters.limit);
      }

      query = query.order('created_at', { ascending: false });

      const { data, error } = await query;
      if (error) throw error;

      return data || [];
    },
  });
};

export const useProduct = (slug: string) => {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: async (): Promise<Product | null> => {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          category:product_categories(*),
          images:product_images(*),
          variants:product_variants(*)
        `)
        .eq('slug', slug)
        .eq('is_active', true)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null;
        throw error;
      }
      return data;
    },
    enabled: !!slug,
  });
};
