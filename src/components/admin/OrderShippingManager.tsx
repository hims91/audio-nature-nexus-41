
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Truck, Package, ExternalLink, Mail } from 'lucide-react';
import { useOrderMutations } from '@/hooks/useAdminOrders';
import { Order } from '@/types/ecommerce';
import { toast } from 'sonner';

interface OrderShippingManagerProps {
  order: Order;
  onOrderUpdate?: () => void;
}

const OrderShippingManager: React.FC<OrderShippingManagerProps> = ({ order, onOrderUpdate }) => {
  const [trackingNumber, setTrackingNumber] = useState(order.tracking_number || '');
  const [trackingUrl, setTrackingUrl] = useState(order.tracking_url || '');
  const [carrier, setCarrier] = useState<string>('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [sendEmailOnUpdate, setSendEmailOnUpdate] = useState(true);

  const { updateOrder } = useOrderMutations();

  const carriers = [
    { value: 'usps', label: 'USPS', trackingUrlPattern: 'https://tools.usps.com/go/TrackConfirmAction?tLabels=' },
    { value: 'fedex', label: 'FedEx', trackingUrlPattern: 'https://www.fedex.com/fedextrack/?trknbr=' },
    { value: 'ups', label: 'UPS', trackingUrlPattern: 'https://www.ups.com/track?tracknum=' },
    { value: 'dhl', label: 'DHL', trackingUrlPattern: 'https://www.dhl.com/us-en/home/tracking/tracking-express.html?submit=1&tracking-id=' },
  ];

  const generateTrackingUrl = (carrierValue: string, trackingNum: string) => {
    const selectedCarrier = carriers.find(c => c.value === carrierValue);
    if (selectedCarrier && trackingNum) {
      return selectedCarrier.trackingUrlPattern + trackingNum;
    }
    return trackingUrl;
  };

  const handleCarrierChange = (carrierValue: string) => {
    setCarrier(carrierValue);
    if (trackingNumber) {
      const newTrackingUrl = generateTrackingUrl(carrierValue, trackingNumber);
      setTrackingUrl(newTrackingUrl);
    }
  };

  const handleTrackingNumberChange = (value: string) => {
    setTrackingNumber(value);
    if (carrier) {
      const newTrackingUrl = generateTrackingUrl(carrier, value);
      setTrackingUrl(newTrackingUrl);
    }
  };

  const handleUpdateShipping = async () => {
    if (!trackingNumber.trim()) {
      toast.error('Please enter a tracking number');
      return;
    }

    setIsUpdating(true);
    try {
      const updates: Partial<Order> = {
        tracking_number: trackingNumber,
        tracking_url: trackingUrl,
        status: 'shipped',
        shipped_at: new Date().toISOString(),
      };

      await updateOrder.mutateAsync({ 
        id: order.id, 
        updates,
        sendEmail: sendEmailOnUpdate,
        carrierInfo: carrier ? carriers.find(c => c.value === carrier)?.label : undefined
      });
      
      onOrderUpdate?.();
      
      if (sendEmailOnUpdate) {
        toast.success('Shipping information updated and customer notified automatically');
      } else {
        toast.success('Shipping information updated successfully');
      }
    } catch (error) {
      console.error('Error updating shipping:', error);
      toast.error('Failed to update shipping information');
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'processing': return 'bg-blue-500';
      case 'shipped': return 'bg-purple-500';
      case 'delivered': return 'bg-green-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const handleEmailCheckboxChange = (checked: boolean | "indeterminate") => {
    // Convert CheckedState to boolean, treating "indeterminate" as false
    setSendEmailOnUpdate(checked === true);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Truck className="h-5 w-5" />
          Shipping & Tracking
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Status */}
        <div className="flex items-center justify-between">
          <span className="font-medium">Current Status:</span>
          <Badge className={`${getStatusColor(order.status)} text-white`}>
            {order.status.toUpperCase()}
          </Badge>
        </div>

        {/* Carrier Selection */}
        <div className="space-y-2">
          <Label htmlFor="carrier">Shipping Carrier</Label>
          <Select value={carrier} onValueChange={handleCarrierChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select shipping carrier" />
            </SelectTrigger>
            <SelectContent>
              {carriers.map((c) => (
                <SelectItem key={c.value} value={c.value}>
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Tracking Number */}
        <div className="space-y-2">
          <Label htmlFor="tracking-number">Tracking Number</Label>
          <Input
            id="tracking-number"
            value={trackingNumber}
            onChange={(e) => handleTrackingNumberChange(e.target.value)}
            placeholder="Enter tracking number"
          />
        </div>

        {/* Tracking URL */}
        <div className="space-y-2">
          <Label htmlFor="tracking-url">Tracking URL</Label>
          <div className="flex gap-2">
            <Input
              id="tracking-url"
              value={trackingUrl}
              onChange={(e) => setTrackingUrl(e.target.value)}
              placeholder="Tracking URL (auto-generated)"
            />
            {trackingUrl && (
              <Button variant="outline" size="sm" asChild>
                <a href={trackingUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            )}
          </div>
        </div>

        {/* Shipped Date */}
        {order.shipped_at && (
          <div className="space-y-2">
            <Label>Shipped Date</Label>
            <p className="text-sm text-gray-600">
              {new Date(order.shipped_at).toLocaleDateString()}
            </p>
          </div>
        )}

        {/* Email Notification Setting */}
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="send-email" 
            checked={sendEmailOnUpdate}
            onCheckedChange={handleEmailCheckboxChange}
          />
          <Label htmlFor="send-email" className="text-sm">
            Automatically send email notification to customer when updating tracking info
          </Label>
        </div>

        {/* Action Button */}
        <div className="pt-4">
          <Button 
            onClick={handleUpdateShipping}
            disabled={isUpdating || !trackingNumber.trim()}
            className="w-full"
          >
            <Package className="h-4 w-4 mr-2" />
            {isUpdating ? 'Updating...' : 'Update Shipping Info & Mark as Shipped'}
            {sendEmailOnUpdate && <Mail className="h-4 w-4 ml-2" />}
          </Button>
        </div>

        {/* Helper Text */}
        <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded-lg">
          <p className="text-xs text-blue-800 dark:text-blue-300">
            <strong>Automatic Email Notifications:</strong><br />
            When you update shipping info with email enabled, the order status will automatically change to "shipped", 
            a timestamp will be recorded, and the customer will receive a professional email notification with tracking details.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderShippingManager;
