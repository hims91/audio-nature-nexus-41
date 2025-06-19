import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { XCircle, ArrowLeft, RefreshCw, HelpCircle } from 'lucide-react';

const OrderCancelPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Order Cancelled - Terra Echo Studios</title>
        <meta name="description" content="Your order was cancelled. You can return to the shop to continue browsing our products." />
        <meta name="robots" content="noindex" />
      </Helmet>

      <div className="min-h-screen bg-white dark:bg-gray-900 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <Card className="border-red-200 dark:border-red-800/40">
              <CardHeader className="text-center pb-8">
                <div className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4">
                  <XCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
                </div>
                <CardTitle className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  Order Cancelled
                </CardTitle>
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                  Your payment was cancelled and no charges were made to your account.
                </p>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800/40 rounded-lg p-4">
                  <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                    What happened?
                  </h3>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">
                    You either cancelled the payment process or there was an issue processing your payment. 
                    No money has been charged to your account.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3 p-4 border rounded-lg">
                    <RefreshCw className="w-6 h-6 text-nature-forest mt-1" />
                    <div>
                      <h3 className="font-semibold mb-1">Try Again</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Your cart items are still saved. You can complete your purchase anytime.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 border rounded-lg">
                    <HelpCircle className="w-6 h-6 text-nature-forest mt-1" />
                    <div>
                      <h3 className="font-semibold mb-1">Need Help?</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Contact our support team if you're experiencing payment issues.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                  <h3 className="font-semibold mb-3">Common reasons for payment cancellation:</h3>
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <li>• Payment window was closed before completion</li>
                    <li>• Payment method was declined by your bank</li>
                    <li>• Browser or network connection issues</li>
                    <li>• Insufficient funds or credit limit reached</li>
                  </ul>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-6">
                  <Button asChild className="flex-1 bg-nature-forest hover:bg-nature-leaf">
                    <Link to="/shop/cart">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Try Again
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="flex-1">
                    <Link to="/shop">
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back to Shop
                    </Link>
                  </Button>
                </div>

                <div className="text-center pt-6 border-t">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    Still having trouble? We're here to help
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

export default OrderCancelPage;