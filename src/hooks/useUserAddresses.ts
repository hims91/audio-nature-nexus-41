
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';
import { useEffect, useState } from 'react';

type UserAddress = Tables<'user_addresses'>;
type UserAddressInsert = TablesInsert<'user_addresses'>;
type UserAddressUpdate = TablesUpdate<'user_addresses'>;

export const useUserAddresses = () => {
  const [realTimeAddresses, setRealTimeAddresses] = useState<Record<string, UserAddress>>({});
  const queryClient = useQueryClient();

  const addressesQuery = useQuery({
    queryKey: ['user-addresses'],
    queryFn: async (): Promise<UserAddress[]> => {
      const { data, error } = await supabase
        .from('user_addresses')
        .select('*')
        .order('is_default', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });

  // Set up real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('user-addresses-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_addresses',
        },
        (payload) => {
          console.log('Address update:', payload);
          if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
            setRealTimeAddresses(prev => ({
              ...prev,
              [payload.new.id]: payload.new as UserAddress
            }));
          } else if (payload.eventType === 'DELETE') {
            setRealTimeAddresses(prev => {
              const updated = { ...prev };
              delete updated[payload.old.id];
              return updated;
            });
          }
          // Invalidate and refetch
          queryClient.invalidateQueries({ queryKey: ['user-addresses'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const createAddressMutation = useMutation({
    mutationFn: async (address: UserAddressInsert) => {
      const { data, error } = await supabase
        .from('user_addresses')
        .insert(address)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-addresses'] });
    },
  });

  const updateAddressMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: UserAddressUpdate }) => {
      const { data, error } = await supabase
        .from('user_addresses')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-addresses'] });
    },
  });

  const deleteAddressMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('user_addresses')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-addresses'] });
    },
  });

  const setDefaultAddressMutation = useMutation({
    mutationFn: async (addressId: string) => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('User not authenticated');

      const { error } = await supabase.rpc('set_default_address', {
        address_id: addressId,
        user_id: user.user.id
      });

      if (error) throw error;
      return addressId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-addresses'] });
    },
  });

  return {
    addresses: addressesQuery.data || [],
    isLoading: addressesQuery.isLoading,
    error: addressesQuery.error,
    createAddress: createAddressMutation.mutateAsync,
    updateAddress: updateAddressMutation.mutateAsync,
    deleteAddress: deleteAddressMutation.mutateAsync,
    setDefaultAddress: setDefaultAddressMutation.mutateAsync,
    isCreating: createAddressMutation.isPending,
    isUpdating: updateAddressMutation.isPending,
    isDeleting: deleteAddressMutation.isPending,
    isSettingDefault: setDefaultAddressMutation.isPending,
  };
};
