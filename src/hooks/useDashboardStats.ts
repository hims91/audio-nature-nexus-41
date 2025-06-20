
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { DashboardStats } from '@/types/dashboard';

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('User not authenticated');

      const { data, error } = await supabase.rpc('get_user_dashboard_stats', {
        p_user_id: user.user.id
      });

      if (error) throw error;
      return data as DashboardStats;
    },
  });
};

export const useUserAddresses = () => {
  return useQuery({
    queryKey: ['user-addresses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_addresses')
        .select('*')
        .order('is_default', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });
};

export const useUserPreferences = () => {
  return useQuery({
    queryKey: ['user-preferences'],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user.user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
  });
};

export const useUserActivity = () => {
  return useQuery({
    queryKey: ['user-activity'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_activity_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data;
    },
  });
};
