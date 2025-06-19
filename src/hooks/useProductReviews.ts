
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ProductReview } from '@/types/ecommerce';
import { toast } from 'sonner';

// Hook for fetching product reviews
export const useProductReviews = (productId: string) => {
  return useQuery({
    queryKey: ['product-reviews', productId],
    queryFn: async (): Promise<ProductReview[]> => {
      const { data, error } = await supabase
        .from('product_reviews')
        .select(`
          *,
          user_profiles!inner(first_name, last_name, username)
        `)
        .eq('product_id', productId)
        .eq('is_approved', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Transform the data to match our expected structure
      const reviews = (data || []).map(review => ({
        ...review,
        user_profile: Array.isArray(review.user_profiles) 
          ? review.user_profiles[0] 
          : review.user_profiles || undefined
      }));

      return reviews as ProductReview[];
    },
    enabled: !!productId,
  });
};

// Hook for review mutations
export const useReviewMutations = () => {
  const queryClient = useQueryClient();

  const createReview = useMutation({
    mutationFn: async (reviewData: {
      product_id: string;
      rating: number;
      title?: string;
      review_text?: string;
    }) => {
      const { data, error } = await supabase
        .from('product_reviews')
        .insert({
          ...reviewData,
          user_id: (await supabase.auth.getUser()).data.user?.id,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data as ProductReview;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['product-reviews', data.product_id] });
      toast.success('Review submitted successfully');
    },
    onError: (error) => {
      console.error('Error creating review:', error);
      toast.error('Failed to submit review');
    },
  });

  return { createReview };
};

// Hook for admin review management
export const useAdminReviewMutations = () => {
  const queryClient = useQueryClient();

  const updateReviewStatus = useMutation({
    mutationFn: async ({ id, is_approved }: { id: string; is_approved: boolean }) => {
      const { data, error } = await supabase
        .from('product_reviews')
        .update({ is_approved })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data as ProductReview;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product-reviews'] });
      toast.success('Review status updated');
    },
    onError: (error) => {
      console.error('Error updating review:', error);
      toast.error('Failed to update review');
    },
  });

  return { updateReviewStatus };
};
