
import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { mapDBToPortfolioItem, type PortfolioItem, type PortfolioItemDB } from "@/types/portfolio";

export const usePortfolioRealtime = () => {
  const queryClient = useQueryClient();
  const channelRef = useRef<any>(null);
  const isSubscribedRef = useRef(false);

  useEffect(() => {
    // Prevent multiple subscriptions
    if (isSubscribedRef.current || channelRef.current) {
      console.log('🔄 Portfolio realtime already subscribed, skipping...');
      return;
    }

    console.log('🔄 Setting up real-time subscription for portfolio items...');
    
    // Create unique channel name to avoid conflicts
    const channelName = `portfolio-realtime-${Math.random().toString(36).substr(2, 9)}`;
    
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
          console.log('📡 Real-time update received:', payload.eventType, payload);
          
          // Optimistic updates for better UX
          switch (payload.eventType) {
            case 'INSERT':
              if (payload.new) {
                const newItem = mapDBToPortfolioItem(payload.new as PortfolioItemDB);
                queryClient.setQueryData(['portfolio-items'], (old: PortfolioItem[] = []) => 
                  [newItem, ...old]
                );
                if (newItem.featured) {
                  queryClient.setQueryData(['featured-portfolio-items'], (old: PortfolioItem[] = []) => 
                    [newItem, ...old.slice(0, 5)]
                  );
                }
              }
              break;
            case 'UPDATE':
              if (payload.new) {
                const updatedItem = mapDBToPortfolioItem(payload.new as PortfolioItemDB);
                queryClient.setQueryData(['portfolio-items'], (old: PortfolioItem[] = []) => 
                  old.map(item => item.id === updatedItem.id ? updatedItem : item)
                );
                queryClient.setQueryData(['featured-portfolio-items'], (old: PortfolioItem[] = []) => 
                  old.map(item => item.id === updatedItem.id ? updatedItem : item)
                );
              }
              break;
            case 'DELETE':
              if (payload.old) {
                const deletedId = payload.old.id;
                queryClient.setQueryData(['portfolio-items'], (old: PortfolioItem[] = []) => 
                  old.filter(item => item.id !== deletedId)
                );
                queryClient.setQueryData(['featured-portfolio-items'], (old: PortfolioItem[] = []) => 
                  old.filter(item => item.id !== deletedId)
                );
              }
              break;
          }
        }
      )
      .subscribe((status) => {
        console.log('📡 Portfolio subscription status:', status);
        if (status === 'SUBSCRIBED') {
          isSubscribedRef.current = true;
        } else if (status === 'CLOSED' || status === 'CHANNEL_ERROR') {
          isSubscribedRef.current = false;
        }
      });

    channelRef.current = channel;

    return () => {
      console.log('🔄 Cleaning up portfolio real-time subscription...');
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
      isSubscribedRef.current = false;
    };
  }, [queryClient]);
};
