
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const DashboardAddresses: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Addresses</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your shipping and billing addresses.
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Address
        </Button>
      </div>

      <Card>
        <CardContent className="text-center py-8">
          <p className="text-gray-500 mb-4">No addresses saved yet.</p>
          <Button>Add Your First Address</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardAddresses;
