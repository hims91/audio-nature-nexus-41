
import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Package } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useOrderTracking } from '@/hooks/useOrderTracking';
import { useAuth } from '@/contexts/AuthContext';
import LoadingSpinner from '@/components/animations/LoadingSpinner';
import FadeInView from '@/components/animations/FadeInView';
import OrderTracker from '@/components/OrderTracker';

const OrderTrackingPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { order, isLoading, error } = useOrderTracking(id || '');

  if (!id) {
    return <Navigate to="/orders" replace />;
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="text-center py-12">
            <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Order Not Found</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              The order you're looking for doesn't exist or you don't have permission to view it.
            </p>
            <Button asChild>
              <Link to={user ? "/orders" : "/shop"}>
                {user ? "View All Orders" : "Continue Shopping"}
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <FadeInView direction="up">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" size="sm" asChild>
            <Link to={user ? "/orders" : "/shop"}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              {user ? "Back to Orders" : "Continue Shopping"}
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-nature-forest dark:text-white">
              Order Tracking
            </h1>
            <p className="text-nature-bark dark:text-gray-300 mt-1">
              Track your order status and shipping information
            </p>
          </div>
        </div>
      </FadeInView>

      <FadeInView direction="up" delay={0.1}>
        <OrderTracker order={order} />
      </FadeInView>
    </div>
  );
};

export default OrderTrackingPage;
