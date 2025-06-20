
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useUserAddresses } from '@/hooks/useUserAddresses';
import AddressForm from '../components/AddressForm';
import AddressCard from '../components/AddressCard';
import LoadingSpinner from '@/components/animations/LoadingSpinner';
import { toast } from 'sonner';
import { Tables } from '@/integrations/supabase/types';

type UserAddress = Tables<'user_addresses'>;

const DashboardAddresses: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<UserAddress | null>(null);

  const {
    addresses,
    isLoading,
    createAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
    isCreating,
    isUpdating,
    isDeleting,
    isSettingDefault,
  } = useUserAddresses();

  const handleSubmit = async (data: any) => {
    try {
      if (editingAddress) {
        await updateAddress({ id: editingAddress.id, updates: data });
        toast.success('Address updated successfully');
      } else {
        await createAddress(data);
        toast.success('Address added successfully');
      }
      setShowForm(false);
      setEditingAddress(null);
    } catch (error) {
      toast.error('Failed to save address');
      console.error('Address save error:', error);
    }
  };

  const handleEdit = (address: UserAddress) => {
    setEditingAddress(address);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteAddress(id);
      toast.success('Address deleted successfully');
    } catch (error) {
      toast.error('Failed to delete address');
      console.error('Address delete error:', error);
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      await setDefaultAddress(id);
      toast.success('Default address updated');
    } catch (error) {
      toast.error('Failed to set default address');
      console.error('Set default error:', error);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingAddress(null);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (showForm) {
    return (
      <div className="space-y-6">
        <AddressForm
          address={editingAddress}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isCreating || isUpdating}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Addresses</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your shipping and billing addresses.
          </p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Address
        </Button>
      </div>

      {addresses.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {addresses.map((address) => (
            <AddressCard
              key={address.id}
              address={address}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onSetDefault={handleSetDefault}
              isDeleting={isDeleting}
              isSettingDefault={isSettingDefault}
            />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-500 mb-4">No addresses saved yet.</p>
            <Button onClick={() => setShowForm(true)}>
              Add Your First Address
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DashboardAddresses;
