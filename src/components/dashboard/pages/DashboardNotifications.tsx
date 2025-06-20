
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

const DashboardNotifications: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Notification Preferences</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage how you receive notifications from us.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Email Notifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="order-updates">Order updates</Label>
            <Switch id="order-updates" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="marketing-emails">Marketing emails</Label>
            <Switch id="marketing-emails" />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="product-recommendations">Product recommendations</Label>
            <Switch id="product-recommendations" defaultChecked />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Push Notifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="push-orders">Order status updates</Label>
            <Switch id="push-orders" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="push-promotions">Promotions and deals</Label>
            <Switch id="push-promotions" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardNotifications;
