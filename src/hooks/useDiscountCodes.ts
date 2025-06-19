
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { DiscountCode } from '@/types/ecommerce';
import { toast } from 'sonner';

// Hook for validating discount codes
export const useDiscountValidation = () => {
  const validateCode = useMutation({
    mutationFn: async ({ code, orderTotal }: { code: string; orderTotal: number }) => {
      const { data, error } = await supabase.rpc('validate_discount_code', {
        code_text: code,
        order_total_cents: orderTotal
      });

      if (error) throw error;
      return data[0];
    },
    onError: (error) => {
      console.error('Error validating discount code:', error);
      toast.error('Failed to validate discount code');
    },
  });

  return { validateCode };
};

// Hook for admin discount code management
export const useAdminDiscountCodes = (filters?: {
  isActive?: boolean;
  search?: string;
}) => {
  return useQuery({
    queryKey: ['admin-discount-codes', filters],
    queryFn: async (): Promise<DiscountCode[]> => {
      let query = supabase
        .from('discount_codes')
        .select('*');

      if (filters?.isActive !== undefined) {
        query = query.eq('is_active', filters.isActive);
      }

      if (filters?.search) {
        query = query.or(`code.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }

      query = query.order('created_at', { ascending: false });

      const { data, error } = await query;
      if (error) throw error;
      
      // Type assertion to ensure proper typing
      return (data || []) as DiscountCode[];
    },
  });
};

// Hook for discount code mutations
export const useDiscountCodeMutations = () => {
  const queryClient = useQueryClient();

  const createDiscountCode = useMutation({
    mutationFn: async (codeData: Omit<DiscountCode, 'id' | 'usage_count' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('discount_codes')
        .insert(codeData)
        .select()
        .single();
      
      if (error) throw error;
      return data as DiscountCode;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-discount-codes'] });
      toast.success('Discount code created successfully');
    },
    onError: (error) => {
      console.error('Error creating discount code:', error);
      toast.error('Failed to create discount code');
    },
  });

  const updateDiscountCode = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<DiscountCode> }) => {
      const { data, error } = await supabase
        .from('discount_codes')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data as DiscountCode;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-discount-codes'] });
      toast.success('Discount code updated successfully');
    },
    onError: (error) => {
      console.error('Error updating discount code:', error);
      toast.error('Failed to update discount code');
    },
  });

  const deleteDiscountCode = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('discount_codes')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-discount-codes'] });
      toast.success('Discount code deleted successfully');
    },
    onError: (error) => {
      console.error('Error deleting discount code:', error);
      toast.error('Failed to delete discount code');
    },
  });

  return {
    createDiscountCode,
    updateDiscountCode,
    deleteDiscountCode,
  };
};
