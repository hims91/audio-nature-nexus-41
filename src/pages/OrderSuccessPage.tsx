import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Package, Mail, ArrowRight } from 'lucide-react';

const OrderSuccessPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');

  return (
    <>
      <Helmet>
        <title>Order Confirmed - Terra Echo Studios</title>
        <meta name="description" content="Your order has been successfully placed. Thank you for shopping with Terra Echo Studios!" />
        <meta name="robots" content="noindex" />
      </Helmet>

      <div className="min-h-screen bg-white dark:bg-gray-900 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <Card className="border-nature-forest/20">
              <CardHeader className="text-center pb-8">
                <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  Order Confirmed!
                </CardTitle>
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                  Thank you for your purchase. Your order has been successfully placed.
                </p>
              </CardHeader>

              <CardContent className="space-y-6">
                {sessionId && (
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                    <h3 className="font-semibold mb-2">Order Details</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Session ID: <span className="font-mono">{sessionId}</span>
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3 p-4 border rounded-lg">
                    <Mail className="w-6 h-6 text-nature-forest mt-1" />
                    <div>
                      <h3 className="font-semibold mb-1">Order Confirmation</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        You'll receive an email confirmation with your order details shortly.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 border rounded-lg">
                    <Package className="w-6 h-6 text-nature-forest mt-1" />
                    <div>
                      <h3 className="font-semibold mb-1">Shipping & Tracking</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        We'll send you tracking information once your order ships.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-nature-forest/5 dark:bg-nature-forest/10 rounded-lg p-6 border border-nature-forest/20">
                  <h3 className="font-semibold text-nature-forest dark:text-nature-leaf mb-2">
                    What's Next?
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <li>• You'll receive an order confirmation email within 5 minutes</li>
                    <li>• Your order will be processed within 1-2 business days</li>
                    <li>• Shipping typically takes 5-7 business days</li>
                    <li>• Track your order status in your account dashboard</li>
                  </ul>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-6">
                  <Button asChild className="flex-1 bg-nature-forest hover:bg-nature-leaf">
                    <Link to="/shop">
                      Continue Shopping
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="flex-1">
                    <Link to="/profile">
                      View Order History
                    </Link>
                  </Button>
                </div>

                <div className="text-center pt-6 border-t">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    Need help? Contact our support team
                  </p>
                  <Button asChild variant="ghost" size="sm">
                    <Link to="/contact">
                      Contact Support
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderSuccessPage;