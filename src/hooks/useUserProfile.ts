
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useEnhancedAuth } from '@/contexts/EnhancedAuthContext';
import { Tables, TablesUpdate } from '@/integrations/supabase/types';

type UserProfile = Tables<'user_profiles'>;

const USER_PROFILE_QUERY_KEY = 'user_profile';

// Fetch user profile
const fetchUserProfile = async (userId: string): Promise<UserProfile | null> => {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error && error.code !== 'PGRST116') { // Ignore "not found" error
    console.error('Error fetching user profile:', error);
    throw new Error(error.message);
  }
  return data;
};

// Update user profile
const updateUserProfile = async ({ userId, updates }: { userId: string; updates: TablesUpdate<'user_profiles'> }) => {
  const { data, error } = await supabase
    .from('user_profiles')
    .update(updates)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) {
    console.error('Error updating user profile:', error);
    throw new Error(error.message);
  }
  return data;
};

// Custom hook to manage user profile
export const useUserProfile = () => {
  const { user, refreshProfile } = useEnhancedAuth();
  const queryClient = useQueryClient();

  const profileQuery = useQuery({
    queryKey: [USER_PROFILE_QUERY_KEY, user?.id],
    queryFn: () => {
      if (!user) return null;
      return fetchUserProfile(user.id);
    },
    enabled: !!user,
  });

  const updateProfileMutation = useMutation({
    mutationFn: (updates: TablesUpdate<'user_profiles'>) => {
      if (!user) throw new Error('User not authenticated');
      return updateUserProfile({ userId: user.id, updates });
    },
    onSuccess: (data) => {
      // Update the cache for this hook
      queryClient.setQueryData([USER_PROFILE_QUERY_KEY, user?.id], data);
      // Refresh the profile in the auth context to ensure app-wide consistency
      refreshProfile();
    },
  });

  return {
    profile: profileQuery.data,
    isLoading: profileQuery.isLoading,
    isError: profileQuery.isError,
    updateProfile: updateProfileMutation.mutateAsync,
    isUpdating: updateProfileMutation.isPending,
  };
};
