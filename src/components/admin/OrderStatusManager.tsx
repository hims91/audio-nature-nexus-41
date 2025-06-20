
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Truck, Package, CheckCircle, AlertCircle } from 'lucide-react';
import { useOrderMutations } from '@/hooks/useAdminOrders';
import { useOrderNotifications } from '@/hooks/useOrderNotifications';
import { Order } from '@/types/ecommerce';
import { toast } from 'sonner';

interface OrderStatusManagerProps {
  order: Order;
  onUpdate?: () => void;
}

const statusOptions = [
  { value: 'pending', label: 'Pending', icon: AlertCircle, color: 'bg-yellow-100 text-yellow-800' },
  { value: 'processing', label: 'Processing', icon: Package, color: 'bg-blue-100 text-blue-800' },
  { value: 'shipped', label: 'Shipped', icon: Truck, color: 'bg-purple-100 text-purple-800' },
  { value: 'delivered', label: 'Delivered', icon: CheckCircle, color: 'bg-green-100 text-green-800' },
  { value: 'cancelled', label: 'Cancelled', icon: AlertCircle, color: 'bg-red-100 text-red-800' },
];

const OrderStatusManager: React.FC<OrderStatusManagerProps> = ({ order, onUpdate }) => {
  const [selectedStatus, setSelectedStatus] = useState(order.status);
  const [trackingNumber, setTrackingNumber] = useState(order.tracking_number || '');
  const [trackingUrl, setTrackingUrl] = useState(order.tracking_url || '');
  const [adminNotes, setAdminNotes] = useState(order.admin_notes || '');
  const [isUpdating, setIsUpdating] = useState(false);

  const { updateOrder } = useOrderMutations();
  const { sendOrderStatusUpdate } = useOrderNotifications();

  const handleStatusUpdate = async () => {
    if (selectedStatus === order.status && 
        trackingNumber === (order.tracking_number || '') &&
        trackingUrl === (order.tracking_url || '') &&
        adminNotes === (order.admin_notes || '')) {
      toast.info('No changes to save');
      return;
    }

    setIsUpdating(true);

    try {
      const updates: Partial<Order> = {
        status: selectedStatus as Order['status'],
        tracking_number: trackingNumber || null,
        tracking_url: trackingUrl || null,
        admin_notes: adminNotes || null,
      };

      // Add timestamps based on status
      if (selectedStatus === 'shipped' && order.status !== 'shipped') {
        updates.shipped_at = new Date().toISOString();
      } else if (selectedStatus === 'delivered' && order.status !== 'delivered') {
        updates.delivered_at = new Date().toISOString();
      }

      await updateOrder.mutateAsync({ id: order.id, updates });

      // Send status update notification if status changed
      if (selectedStatus !== order.status) {
        try {
          await sendOrderStatusUpdate(order.id, selectedStatus);
        } catch (notificationError) {
          console.error('Failed to send status update notification:', notificationError);
          // Don't fail the entire operation if notification fails
        }
      }

      toast.success('Order updated successfully');
      onUpdate?.();
    } catch (error) {
      console.error('Error updating order:', error);
      toast.error('Failed to update order');
    } finally {
      setIsUpdating(false);
    }
  };

  const currentStatusInfo = statusOptions.find(opt => opt.value === order.status);
  const StatusIcon = currentStatusInfo?.icon || Package;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <StatusIcon className="h-5 w-5" />
          Order Status & Fulfillment
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-sm font-medium">Current Status:</span>
          <Badge className={currentStatusInfo?.color}>
            {currentStatusInfo?.label || order.status}
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="status">Update Status</Label>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => {
                  const OptionIcon = option.icon;
                  return (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        <OptionIcon className="h-4 w-4" />
                        {option.label}
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="tracking_number">Tracking Number</Label>
            <Input
              id="tracking_number"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              placeholder="Enter tracking number"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="tracking_url">Tracking URL</Label>
          <Input
            id="tracking_url"
            value={trackingUrl}
            onChange={(e) => setTrackingUrl(e.target.value)}
            placeholder="https://tracking.carrier.com/track?id=..."
          />
        </div>

        <div>
          <Label htmlFor="admin_notes">Admin Notes</Label>
          <Textarea
            id="admin_notes"
            value={adminNotes}
            onChange={(e) => setAdminNotes(e.target.value)}
            placeholder="Internal notes about this order..."
            rows={3}
          />
        </div>

        <div className="flex justify-end">
          <Button 
            onClick={handleStatusUpdate}
            disabled={isUpdating}
            className="bg-nature-forest hover:bg-nature-leaf"
          >
            {isUpdating ? 'Updating...' : 'Update Order'}
          </Button>
        </div>

        {order.created_at && (
          <div className="text-xs text-gray-500 space-y-1">
            <p>Created: {new Date(order.created_at).toLocaleString()}</p>
            {order.shipped_at && <p>Shipped: {new Date(order.shipped_at).toLocaleString()}</p>}
            {order.delivered_at && <p>Delivered: {new Date(order.delivered_at).toLocaleString()}</p>}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OrderStatusManager;
