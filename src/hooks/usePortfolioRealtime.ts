
import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { mapDBToPortfolioItem, type PortfolioItem, type PortfolioItemDB } from "@/types/portfolio";

export const usePortfolioRealtime = () => {
  const queryClient = useQueryClient();
  const channelRef = useRef<any>(null);

  useEffect(() => {
    console.log('🔄 Setting up real-time subscription for portfolio items...');
    
    // Clean up any existing channel
    if (channelRef.current) {
      console.log('🧹 Cleaning up existing channel...');
      supabase.removeChannel(channelRef.current);
    }
    
    const channel = supabase
      .channel(`portfolio-realtime-${Date.now()}`)
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
        console.log('📡 Subscription status:', status);
      });

    channelRef.current = channel;

    return () => {
      console.log('🔄 Cleaning up real-time subscription...');
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [queryClient]);
};
