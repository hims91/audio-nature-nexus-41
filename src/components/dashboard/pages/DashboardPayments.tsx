
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const DashboardPayments: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Payment Methods</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your saved payment methods.
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Payment Method
        </Button>
      </div>

      <Card>
        <CardContent className="text-center py-8">
          <p className="text-gray-500 mb-4">No payment methods saved.</p>
          <p className="text-sm text-gray-400 mb-4">
            Payment methods will be managed during checkout for security.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPayments;
