
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { usePortfolioRealtime } from './usePortfolioRealtime';
import { type Tables } from '@/integrations/supabase/types';
import { type PortfolioItem } from '@/types/portfolio';

type PortfolioItemRow = Tables<'portfolio_items'>;

const mapToPortfolioItem = (item: PortfolioItemRow): PortfolioItem => {
  // Supabase returns snake_case, but our app's type `PortfolioItem` uses camelCase.
  // This function maps the data to match the app's type definition.
  return {
    id: item.id,
    title: item.title,
    client: item.client,
    category: item.category as PortfolioItem['category'],
    description: item.description,
    coverImageUrl: item.cover_image_url ?? '',
    audioUrl: item.audio_url ?? undefined,
    videoUrl: item.video_url ?? undefined,
    externalLinks: (item.external_links as any) || [],
    featured: item.featured ?? false,
    createdAt: item.created_at,
    updatedAt: item.updated_at,
  };
};

// Fetch all portfolio items
const fetchPortfolioItems = async (): Promise<PortfolioItem[]> => {
  console.log('🔍 Fetching portfolio items from Supabase...');
  const { data, error } = await supabase
    .from('portfolio_items')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('❌ Error fetching portfolio items:', error);
    throw error;
  }

  console.log('✅ Successfully fetched', data?.length || 0, 'portfolio items');
  return (data || []).map(mapToPortfolioItem);
};

// Fetch featured portfolio items
const fetchFeaturedPortfolioItems = async (limit: number = 6): Promise<PortfolioItem[]> => {
  const { data, error } = await supabase
    .from('portfolio_items')
    .select('*')
    .eq('featured', true)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('❌ Error fetching featured portfolio items:', error);
    throw error;
  }

  return (data || []).map(mapToPortfolioItem);
};

// Hook to get all portfolio items with real-time updates
export const usePortfolioItems = () => {
  // Set up real-time subscription
  usePortfolioRealtime();

  return useQuery({
    queryKey: ['portfolio_items'],
    queryFn: fetchPortfolioItems,
  });
};

// Hook to get featured portfolio items
export const useFeaturedPortfolioItems = (limit: number = 6) => {
  return useQuery({
    queryKey: ['featured_portfolio_items', limit],
    queryFn: () => fetchFeaturedPortfolioItems(limit),
  });
};

// Hook to get portfolio items by category
export const usePortfolioItemsByCategory = (category?: string) => {
  return useQuery({
    queryKey: ['portfolio_items', 'category', category],
    queryFn: async (): Promise<PortfolioItem[]> => {
      if (!category) return fetchPortfolioItems();
      
      const { data, error } = await supabase
        .from('portfolio_items')
        .select('*')
        .eq('category', category)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Error fetching portfolio items by category:', error);
        throw error;
      }

      return (data || []).map(mapToPortfolioItem);
    },
  });
};
