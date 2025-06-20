
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Edit, Trash2, Star } from 'lucide-react';
import { Tables } from '@/integrations/supabase/types';

type UserAddress = Tables<'user_addresses'>;

interface AddressCardProps {
  address: UserAddress;
  onEdit: (address: UserAddress) => void;
  onDelete: (id: string) => void;
  onSetDefault: (id: string) => void;
  isDeleting: boolean;
  isSettingDefault: boolean;
}

const AddressCard: React.FC<AddressCardProps> = ({
  address,
  onEdit,
  onDelete,
  onSetDefault,
  isDeleting,
  isSettingDefault
}) => {
  return (
    <Card className={`transition-all ${address.is_default ? 'ring-2 ring-nature-forest' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <MapPin className="h-5 w-5 text-gray-400 mt-1" />
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <h3 className="font-semibold">
                  {address.first_name} {address.last_name}
                </h3>
                {address.is_default && (
                  <Badge variant="secondary" className="bg-nature-forest text-white">
                    <Star className="h-3 w-3 mr-1" />
                    Default
                  </Badge>
                )}
                <Badge variant="outline" className="capitalize">
                  {address.type}
                </Badge>
              </div>
              
              {address.company && (
                <p className="text-sm text-gray-600 mb-1">{address.company}</p>
              )}
              
              <div className="text-sm text-gray-600 space-y-1">
                <p>{address.address_line1}</p>
                {address.address_line2 && <p>{address.address_line2}</p>}
                <p>
                  {address.city}, {address.state} {address.postal_code}
                </p>
                <p>{address.country}</p>
                {address.phone && <p>Phone: {address.phone}</p>}
              </div>
            </div>
          </div>
          
          <div className="flex flex-col space-y-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(address)}
            >
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
            
            {!address.is_default && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onSetDefault(address.id)}
                disabled={isSettingDefault}
              >
                <Star className="h-4 w-4 mr-1" />
                Set Default
              </Button>
            )}
            
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onDelete(address.id)}
              disabled={isDeleting}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AddressCard;
