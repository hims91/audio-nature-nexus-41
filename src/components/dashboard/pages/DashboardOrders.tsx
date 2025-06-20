
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCustomerOrdersTracking } from '@/hooks/useOrderTracking';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { formatPrice } from '@/utils/currency';
import { format } from 'date-fns';
import LoadingSpinner from '@/components/animations/LoadingSpinner';

const DashboardOrders: React.FC = () => {
  const { orders, isLoading } = useCustomerOrdersTracking();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Order History</h1>
        <p className="text-gray-600 dark:text-gray-400">
          View and track all your orders.
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <LoadingSpinner size="lg" />
        </div>
      ) : orders && orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Order #{order.order_number}</CardTitle>
                  <Badge className={getStatusColor(order.status)}>
                    {order.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Date</p>
                    <p>{format(new Date(order.created_at), 'MMM dd, yyyy')}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total</p>
                    <p className="font-semibold">{formatPrice(order.total_cents)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Items</p>
                    <p>{order.items?.length || 0} items</p>
                  </div>
                  <div className="flex justify-end">
                    <Button asChild variant="outline" size="sm">
                      <Link to={`/orders/${order.id}`}>View Details</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-500 mb-4">You haven't placed any orders yet.</p>
            <Button asChild>
              <Link to="/shop">Start Shopping</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DashboardOrders;
