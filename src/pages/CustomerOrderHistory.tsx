
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Package, Eye, Truck, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCustomerOrders } from '@/hooks/useCustomerOrders';
import { formatPrice } from '@/utils/currency';
import LoadingSpinner from '@/components/animations/LoadingSpinner';
import FadeInView from '@/components/animations/FadeInView';

const statusConfig = {
  pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400', icon: Clock },
  processing: { label: 'Processing', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400', icon: Package },
  shipped: { label: 'Shipped', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400', icon: Truck },
  delivered: { label: 'Delivered', color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400', icon: CheckCircle },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400', icon: XCircle },
  refunded: { label: 'Refunded', color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400', icon: XCircle },
};

const CustomerOrderHistory: React.FC = () => {
  const { data: orders = [], isLoading, error } = useCustomerOrders();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-red-600">Failed to load order history. Please try again.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <FadeInView direction="up">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-nature-forest dark:text-white mb-2">
            Order History
          </h1>
          <p className="text-nature-bark dark:text-gray-300">
            Track your orders and view purchase history
          </p>
        </div>
      </FadeInView>

      {orders.length === 0 ? (
        <FadeInView direction="up" delay={0.1}>
          <Card>
            <CardContent className="text-center py-12">
              <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2">No orders yet</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                You haven't placed any orders yet. Start shopping to see your orders here.
              </p>
              <Button asChild>
                <Link to="/shop">Start Shopping</Link>
              </Button>
            </CardContent>
          </Card>
        </FadeInView>
      ) : (
        <div className="space-y-6">
          {orders.map((order, index) => {
            const statusInfo = statusConfig[order.status as keyof typeof statusConfig];
            const StatusIcon = statusInfo?.icon || Package;

            return (
              <FadeInView key={order.id} direction="up" delay={index * 0.1}>
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">
                          Order #{order.order_number}
                        </CardTitle>
                        <CardDescription>
                          Placed on {formatDate(order.created_at)}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className={statusInfo?.color || 'bg-gray-100 text-gray-800'}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {statusInfo?.label || order.status}
                        </Badge>
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/orders/${order.id}`}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <h4 className="font-medium mb-2">Items ({order.items?.length || 0})</h4>
                        <div className="space-y-1">
                          {order.items?.slice(0, 3).map((item) => (
                            <p key={item.id} className="text-sm text-gray-600 dark:text-gray-400">
                              {item.quantity}x {item.product_name}
                              {item.variant_name && ` - ${item.variant_name}`}
                            </p>
                          ))}
                          {(order.items?.length || 0) > 3 && (
                            <p className="text-sm text-gray-500">
                              +{(order.items?.length || 0) - 3} more items
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Total</h4>
                        <p className="text-lg font-semibold text-nature-forest dark:text-nature-sage">
                          {formatPrice(order.total_cents)}
                        </p>
                        {order.discount_cents && order.discount_cents > 0 && (
                          <p className="text-sm text-green-600">
                            {formatPrice(order.discount_cents)} discount applied
                          </p>
                        )}
                      </div>

                      <div>
                        <h4 className="font-medium mb-2">Delivery</h4>
                        {order.tracking_number ? (
                          <div className="space-y-1">
                            <p className="text-sm">Tracking: {order.tracking_number}</p>
                            {order.tracking_url && (
                              <Button variant="link" size="sm" className="p-0 h-auto" asChild>
                                <a href={order.tracking_url} target="_blank" rel="noopener noreferrer">
                                  Track Package
                                </a>
                              </Button>
                            )}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {order.status === 'pending' ? 'Processing' : 'Not shipped yet'}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </FadeInView>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CustomerOrderHistory;
