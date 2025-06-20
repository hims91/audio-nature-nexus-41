
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import { Order } from '@/types/ecommerce';
import { formatPrice } from '@/utils/currency';

interface OrderTrackerProps {
  order: Order;
}

const statusSteps = [
  { key: 'pending', label: 'Order Placed', icon: Clock },
  { key: 'processing', label: 'Processing', icon: Package },
  { key: 'shipped', label: 'Shipped', icon: Truck },
  { key: 'delivered', label: 'Delivered', icon: CheckCircle },
];

const OrderTracker: React.FC<OrderTrackerProps> = ({ order }) => {
  const getCurrentStep = () => {
    const statusIndex = statusSteps.findIndex(step => step.key === order.status);
    return statusIndex >= 0 ? statusIndex : 0;
  };

  const currentStep = getCurrentStep();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'processing': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'shipped': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
      case 'delivered': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Order #{order.order_number}
          </CardTitle>
          <Badge className={getStatusColor(order.status)}>
            {order.status.toUpperCase()}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Order Progress */}
        {order.status !== 'cancelled' && (
          <div className="space-y-4">
            <h4 className="font-medium">Order Progress</h4>
            <div className="flex items-center justify-between">
              {statusSteps.map((step, index) => {
                const StepIcon = step.icon;
                const isCompleted = index <= currentStep;
                const isCurrent = index === currentStep;
                
                return (
                  <div key={step.key} className="flex flex-col items-center relative">
                    <div className={`
                      w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors
                      ${isCompleted 
                        ? 'bg-nature-forest border-nature-forest text-white' 
                        : 'bg-gray-100 border-gray-300 text-gray-400'
                      }
                      ${isCurrent ? 'ring-2 ring-nature-sage ring-offset-2' : ''}
                    `}>
                      <StepIcon className="h-5 w-5" />
                    </div>
                    <span className={`text-xs mt-2 text-center ${
                      isCompleted ? 'text-nature-forest font-medium' : 'text-gray-500'
                    }`}>
                      {step.label}
                    </span>
                    {index < statusSteps.length - 1 && (
                      <div className={`
                        absolute top-5 left-12 w-16 h-0.5 -z-10
                        ${index < currentStep ? 'bg-nature-forest' : 'bg-gray-300'}
                      `} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Order Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium mb-2">Order Information</h4>
            <div className="space-y-1 text-sm">
              <p><span className="text-gray-600">Placed:</span> {formatDate(order.created_at)}</p>
              <p><span className="text-gray-600">Total:</span> {formatPrice(order.total_cents)}</p>
              <p><span className="text-gray-600">Payment:</span> 
                <Badge variant={order.payment_status === 'paid' ? 'default' : 'secondary'} className="ml-2">
                  {order.payment_status}
                </Badge>
              </p>
            </div>
          </div>

          {order.tracking_number && (
            <div>
              <h4 className="font-medium mb-2">Shipping Information</h4>
              <div className="space-y-2 text-sm">
                <p><span className="text-gray-600">Tracking:</span> {order.tracking_number}</p>
                {order.shipped_at && (
                  <p><span className="text-gray-600">Shipped:</span> {formatDate(order.shipped_at)}</p>
                )}
                {order.delivered_at && (
                  <p><span className="text-gray-600">Delivered:</span> {formatDate(order.delivered_at)}</p>
                )}
                {order.tracking_url && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={order.tracking_url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Track Package
                    </a>
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Order Items Summary */}
        <div>
          <h4 className="font-medium mb-2">Items ({order.items?.length || 0})</h4>
          <div className="space-y-2">
            {order.items?.slice(0, 3).map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span>{item.quantity}x {item.product_name}</span>
                <span>{formatPrice(item.total_price_cents)}</span>
              </div>
            ))}
            {(order.items?.length || 0) > 3 && (
              <p className="text-sm text-gray-500">
                +{(order.items?.length || 0) - 3} more items
              </p>
            )}
          </div>
        </div>

        {/* Special Messages */}
        {order.status === 'cancelled' && (
          <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <span className="text-red-800 dark:text-red-400">This order has been cancelled.</span>
          </div>
        )}

        {order.customer_notes && (
          <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h5 className="font-medium mb-1">Customer Notes</h5>
            <p className="text-sm text-gray-600 dark:text-gray-400">{order.customer_notes}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OrderTracker;
