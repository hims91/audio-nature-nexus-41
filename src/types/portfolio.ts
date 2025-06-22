
import type { Database } from "@/integrations/supabase/types";

// Database type from Supabase
export type PortfolioItemDB = Database['public']['Tables']['portfolio_items']['Row'];
export type PortfolioItemInsert = Database['public']['Tables']['portfolio_items']['Insert'];
export type PortfolioItemUpdate = Database['public']['Tables']['portfolio_items']['Update'];

// External link type for the application - compatible with both old and new systems
export interface ExternalLink {
  type: 'spotify' | 'appleMusic' | 'youtube' | 'vimeo' | 'soundcloud' | 'bandcamp' | 'facebook' | 'twitter' | 'instagram' | 'other';
  url: string;
  title?: string;
}

// Unified interface that works with both static and database data
export interface PortfolioItem {
  id: string;
  title: string;
  client: string;
  category: 'Mixing & Mastering' | 'Sound Design' | 'Podcasting' | 'Sound for Picture' | 'Dolby Atmos';
  description: string;
  coverImageUrl: string | null;
  coverImagePreview?: string;
  audioUrl?: string | null;
  videoUrl?: string | null;
  externalLinks: ExternalLink[];
  featured: boolean;
  recordedDate?: string | null;
  createdAt: string;
  updatedAt?: string;
  userId?: string | null;
}

// Mapper function to convert database format to application format
export const mapDBToPortfolioItem = (dbItem: PortfolioItemDB): PortfolioItem => {
  let externalLinks: ExternalLink[] = [];
  
  // Safely parse external_links from JSON
  if (dbItem.external_links) {
    try {
      const parsed = dbItem.external_links as any;
      externalLinks = Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.warn('Failed to parse external_links:', error);
      externalLinks = [];
    }
  }

  return {
    id: dbItem.id,
    title: dbItem.title,
    client: dbItem.client,
    category: dbItem.category as PortfolioItem['category'],
    description: dbItem.description,
    coverImageUrl: dbItem.cover_image_url,
    audioUrl: dbItem.audio_url,
    videoUrl: dbItem.video_url,
    externalLinks,
    featured: dbItem.featured || false,
    recordedDate: dbItem.recorded_date,
    createdAt: dbItem.created_at,
    updatedAt: dbItem.updated_at,
    userId: dbItem.user_id
  };
};

// Mapper function to convert application format to database format
export const mapPortfolioItemToDB = (item: Partial<PortfolioItem>): PortfolioItemInsert => {
  return {
    title: item.title!,
    client: item.client!,
    category: item.category!,
    description: item.description!,
    cover_image_url: item.coverImageUrl,
    audio_url: item.audioUrl,
    video_url: item.videoUrl,
    external_links: (item.externalLinks || []) as any,
    featured: item.featured || false,
    recorded_date: item.recordedDate,
    user_id: item.userId
  };
};
