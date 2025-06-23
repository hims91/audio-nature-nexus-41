
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { formatPrice } from '@/utils/currency';

interface OrderSummaryItem {
  id: string;
  name: string;
  variant?: string;
  quantity: number;
  price: number;
  image?: string;
}

interface OrderSummaryCardProps {
  items: OrderSummaryItem[];
  subtotal: number;
  shipping?: number;
  tax?: number;
  discount?: number;
  total: number;
  className?: string;
  isSticky?: boolean;
}

const OrderSummaryCard: React.FC<OrderSummaryCardProps> = ({
  items,
  subtotal,
  shipping = 0,
  tax = 0,
  discount = 0,
  total,
  className = '',
  isSticky = true
}) => {
  return (
    <Card className={`${isSticky ? 'sticky top-24' : ''} ${className}`}>
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Order Items */}
        <div className="space-y-3 max-h-60 overflow-y-auto">
          {items.map((item) => (
            <div key={item.id} className="flex items-center space-x-3">
              {item.image && (
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-12 w-12 object-cover rounded flex-shrink-0"
                  onError={(e) => {
                    e.currentTarget.src = '/placeholder.svg';
                  }}
                />
              )}
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium truncate">{item.name}</h4>
                {item.variant && (
                  <p className="text-xs text-gray-600 truncate">{item.variant}</p>
                )}
                <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
              </div>
              <p className="text-sm font-medium">
                {formatPrice(item.price * item.quantity)}
              </p>
            </div>
          ))}
        </div>

        <Separator />

        {/* Pricing Breakdown */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Subtotal:</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          
          {shipping > 0 && (
            <div className="flex justify-between text-sm">
              <span>Shipping:</span>
              <span>{formatPrice(shipping)}</span>
            </div>
          )}
          
          {tax > 0 && (
            <div className="flex justify-between text-sm">
              <span>Tax:</span>
              <span>{formatPrice(tax)}</span>
            </div>
          )}
          
          {discount > 0 && (
            <div className="flex justify-between text-sm text-green-600">
              <span>Discount:</span>
              <span>-{formatPrice(discount)}</span>
            </div>
          )}
        </div>

        <Separator />

        <div className="flex justify-between font-semibold text-lg">
          <span>Total:</span>
          <span>{formatPrice(total)}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderSummaryCard;
