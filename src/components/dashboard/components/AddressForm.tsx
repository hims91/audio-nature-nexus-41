
import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tables, TablesInsert } from '@/integrations/supabase/types';
import { useEnhancedAuth } from '@/contexts/EnhancedAuthContext';

type UserAddress = Tables<'user_addresses'>;

interface AddressFormProps {
  address?: UserAddress;
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

const AddressForm: React.FC<AddressFormProps> = ({ address, onSubmit, onCancel, isLoading }) => {
  const { user } = useEnhancedAuth();
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    defaultValues: {
      first_name: address?.first_name || '',
      last_name: address?.last_name || '',
      company: address?.company || '',
      address_line1: address?.address_line1 || '',
      address_line2: address?.address_line2 || '',
      city: address?.city || '',
      state: address?.state || '',
      postal_code: address?.postal_code || '',
      country: address?.country || 'US',
      phone: address?.phone || '',
      type: address?.type || 'shipping',
      is_default: address?.is_default || false,
    }
  });

  const watchType = watch('type');

  const handleFormSubmit = async (data: any) => {
    try {
      await onSubmit({
        ...data,
        user_id: user?.id,
      });
    } catch (error) {
      console.error('Error submitting address:', error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{address ? 'Edit Address' : 'Add New Address'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="first_name">First Name *</Label>
              <Input
                id="first_name"
                {...register('first_name', { required: 'First name is required' })}
                error={errors.first_name?.message}
              />
            </div>
            <div>
              <Label htmlFor="last_name">Last Name *</Label>
              <Input
                id="last_name"
                {...register('last_name', { required: 'Last name is required' })}
                error={errors.last_name?.message}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="company">Company</Label>
            <Input id="company" {...register('company')} />
          </div>

          <div>
            <Label htmlFor="address_line1">Address Line 1 *</Label>
            <Input
              id="address_line1"
              {...register('address_line1', { required: 'Address is required' })}
              error={errors.address_line1?.message}
            />
          </div>

          <div>
            <Label htmlFor="address_line2">Address Line 2</Label>
            <Input id="address_line2" {...register('address_line2')} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                {...register('city', { required: 'City is required' })}
                error={errors.city?.message}
              />
            </div>
            <div>
              <Label htmlFor="state">State *</Label>
              <Input
                id="state"
                {...register('state', { required: 'State is required' })}
                error={errors.state?.message}
              />
            </div>
            <div>
              <Label htmlFor="postal_code">Postal Code *</Label>
              <Input
                id="postal_code"
                {...register('postal_code', { required: 'Postal code is required' })}
                error={errors.postal_code?.message}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="country">Country</Label>
              <Select defaultValue="US" onValueChange={(value) => setValue('country', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="US">United States</SelectItem>
                  <SelectItem value="CA">Canada</SelectItem>
                  <SelectItem value="GB">United Kingdom</SelectItem>
                  <SelectItem value="AU">Australia</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" {...register('phone')} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="type">Address Type</Label>
              <Select defaultValue={watchType} onValueChange={(value) => setValue('type', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="shipping">Shipping</SelectItem>
                  <SelectItem value="billing">Billing</SelectItem>
                  <SelectItem value="both">Both</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2 pt-8">
              <Switch
                id="is_default"
                onCheckedChange={(checked) => setValue('is_default', checked)}
                defaultChecked={address?.is_default}
              />
              <Label htmlFor="is_default">Set as default address</Label>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : address ? 'Update Address' : 'Add Address'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddressForm;
