
import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const usePortfolioRealtime = () => {
  const queryClient = useQueryClient();
  const channelRef = useRef<any>(null);

  useEffect(() => {
    // Clean up any existing channel first
    if (channelRef.current) {
      console.log('🔄 Cleaning up portfolio real-time subscription...');
      console.log('📡 Portfolio subscription status:', channelRef.current.state);
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }

    // Create new channel with unique name
    const channelName = `portfolio_changes_${Date.now()}`;
    console.log('🔄 Setting up real-time subscription for portfolio items...');
    
    channelRef.current = supabase
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
      .subscribe();

    return () => {
      if (channelRef.current) {
        console.log('🔄 Cleaning up portfolio real-time subscription...');
        console.log('📡 Portfolio subscription status:', channelRef.current.state);
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [queryClient]);
};
