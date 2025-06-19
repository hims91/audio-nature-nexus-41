
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Product, ProductCategory } from '@/types/ecommerce';

export const useProducts = (filters?: {
  categoryId?: string;
  featured?: boolean;
  search?: string;
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
        `)
        .eq('is_active', true);

      if (filters?.categoryId) {
        query = query.eq('category_id', filters.categoryId);
      }

      if (filters?.featured) {
        query = query.eq('is_featured', true);
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
        if (error.code === 'PGRST116') return null; // Not found
        throw error;
      }
      return data;
    },
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async (): Promise<ProductCategory[]> => {
      const { data, error } = await supabase
        .from('product_categories')
        .select('*')
        .eq('is_active', true)
        .order('sort_order');

      if (error) throw error;
      return data || [];
    },
  });
};
