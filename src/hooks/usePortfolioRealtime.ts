
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const usePortfolioRealtime = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    // Create new channel with a more unique name to avoid strict mode issues
    const channelName = `portfolio_changes_${Math.random().toString(36).substring(2, 9)}`;
    
    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'portfolio_items'
        },
        (payload) => {
          console.log('🔄 Portfolio item updated in real-time:', payload);
          // Invalidate portfolio queries to refetch data
          queryClient.invalidateQueries({ queryKey: ['portfolio_items'] });
          queryClient.invalidateQueries({ queryKey: ['featured_portfolio_items'] });
        }
      )
      .subscribe((status, error) => {
        if (error) {
          console.error(`Subscription error on channel ${channelName}:`, error);
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);
};
