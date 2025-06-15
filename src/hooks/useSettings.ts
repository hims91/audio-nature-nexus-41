
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesUpdate } from '@/integrations/supabase/types';

type SiteSettings = Tables<'site_settings'>;

const SETTINGS_QUERY_KEY = ['site_settings'];

// Function to fetch settings
const fetchSettings = async (): Promise<SiteSettings> => {
  const { data, error } = await supabase
    .from('site_settings')
    .select('*')
    .eq('id', 1)
    .single();

  if (error) {
    console.error('Error fetching site settings:', error);
    throw new Error('Could not fetch site settings.');
  }
  
  // Fallback default config — ensure includes all required fields
  return data || {
    id: 1,
    site_name: 'Terra Echo Studios',
    site_description: 'Professional Audio Engineering Services',
    contact_email: 'terraechostudios@gmail.com',
    featured_items_limit: 6,
    allow_user_registration: true,
    email_notifications: true,
    portfolio_auto_approve: false,
    maintenance_mode: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    brand_colors: null,            // <-- added
    logo_url: null,                // <-- added
    social_links: [],              // <-- added
  };
};

// Custom hook to get settings
export const useSettings = () => {
  return useQuery({
    queryKey: SETTINGS_QUERY_KEY,
    queryFn: fetchSettings,
  });
};

// Function to update settings
const updateSettings = async (updatedSettings: TablesUpdate<'site_settings'>) => {
  const { data, error } = await supabase
    .from('site_settings')
    .update(updatedSettings)
    .eq('id', 1)
    .select()
    .single();

  if (error) {
    console.error('Error updating site settings:', error);
    throw new Error('Could not update site settings.');
  }

  return data;
};

// Custom hook for updating settings
export const useUpdateSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateSettings,
    onSuccess: (data) => {
      // Invalidate and refetch the settings query to update the cache
      queryClient.setQueryData(SETTINGS_QUERY_KEY, data);
    },
  });
};
