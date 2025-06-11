
import { supabase } from '@/integrations/supabase/client';
import { PortfolioItem, CreatePortfolioItem, UpdatePortfolioItem } from '@/types/portfolio';

export class PortfolioService {
  
  static async getPortfolioItems(): Promise<PortfolioItem[]> {
    try {
      const { data, error } = await supabase
        .from('portfolio_items')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching portfolio items:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching portfolio items:', error);
      return [];
    }
  }

  static async getUserPortfolioItems(): Promise<PortfolioItem[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('portfolio_items')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching user portfolio items:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching user portfolio items:', error);
      return [];
    }
  }

  static async getPortfolioItem(id: string): Promise<PortfolioItem | null> {
    try {
      const { data, error } = await supabase
        .from('portfolio_items')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching portfolio item:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error fetching portfolio item:', error);
      return null;
    }
  }

  static async createPortfolioItem(item: CreatePortfolioItem): Promise<PortfolioItem | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User must be authenticated');
      }

      const { data, error } = await supabase
        .from('portfolio_items')
        .insert({
          ...item,
          user_id: user.id,
          external_links: item.external_links || []
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating portfolio item:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error creating portfolio item:', error);
      throw error;
    }
  }

  static async updatePortfolioItem(item: UpdatePortfolioItem): Promise<PortfolioItem | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User must be authenticated');
      }

      const { id, ...updateData } = item;
      
      const { data, error } = await supabase
        .from('portfolio_items')
        .update(updateData)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating portfolio item:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error updating portfolio item:', error);
      throw error;
    }
  }

  static async deletePortfolioItem(id: string): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User must be authenticated');
      }

      const { error } = await supabase
        .from('portfolio_items')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error deleting portfolio item:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error deleting portfolio item:', error);
      return false;
    }
  }

  static async getPortfolioCategories(): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from('portfolio_items')
        .select('category')
        .order('category');

      if (error) {
        console.error('Error fetching categories:', error);
        return [];
      }

      const categories = [...new Set(data.map(item => item.category))];
      return categories;
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  }
}
