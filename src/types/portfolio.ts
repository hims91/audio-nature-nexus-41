
export interface PortfolioItem {
  id: string;
  user_id: string;
  title: string;
  client: string;
  category: string;
  description: string;
  cover_image_url?: string;
  audio_url?: string;
  video_url?: string;
  external_links: Array<{
    title: string;
    url: string;
  }>;
  featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreatePortfolioItem {
  title: string;
  client: string;
  category: string;
  description: string;
  cover_image_url?: string;
  audio_url?: string;
  video_url?: string;
  external_links?: Array<{
    title: string;
    url: string;
  }>;
  featured?: boolean;
}

export interface UpdatePortfolioItem extends Partial<CreatePortfolioItem> {
  id: string;
}
