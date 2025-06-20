
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { formatPrice } from '@/utils/currency';
import LoadingSpinner from '@/components/animations/LoadingSpinner';
import UnifiedNavbar from '@/components/UnifiedNavbar';
import Footer from '@/components/Footer';
import FadeInView from '@/components/animations/FadeInView';

const CartPage: React.FC = () => {
  const { 
    cartItems, 
    isLoading, 
    cartTotal, 
    cartItemCount, 
    updateQuantity, 
    removeFromCart,
    clearCart 
  } = useCart();

  if (isLoading) {
    return (
      <>
        <UnifiedNavbar />
        <div className="min-h-screen bg-white dark:bg-gray-900 pt-20 flex items-center justify-center">
          <LoadingSpinner />
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Shopping Cart - Terra Echo Studios</title>
        <meta name="description" content="Review and manage items in your Terra Echo Studios shopping cart." />
      </Helmet>

      <UnifiedNavbar />
      
      <div className="min-h-screen bg-white dark:bg-gray-900 pt-20">
        <div className="container mx-auto px-4 py-8">
          <FadeInView direction="up">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4">
                <Button variant="outline" size="sm" asChild>
                  <Link to="/shop">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Continue Shopping
                  </Link>
                </Button>
                <div>
                  <h1 className="text-3xl font-bold text-nature-forest dark:text-white">
                    Shopping Cart
                  </h1>
                  <p className="text-nature-bark dark:text-gray-300 mt-2">
                    {cartItemCount} {cartItemCount === 1 ? 'item' : 'items'} in your cart
                  </p>
                </div>
              </div>
              {cartItems.length > 0 && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => clearCart()}
                  className="text-red-600 hover:text-red-700"
                >
                  Clear Cart
                </Button>
              )}
            </div>
          </FadeInView>

          {cartItems.length === 0 ? (
            <FadeInView direction="up" delay={0.1}>
              <Card className="text-center py-12">
                <CardContent>
                  <ShoppingBag className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Looks like you haven't added any items to your cart yet.
                  </p>
                  <Button asChild>
                    <Link to="/shop">Start Shopping</Link>
                  </Button>
                </CardContent>
              </Card>
            </FadeInView>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {cartItems.map((item, index) => (
                  <FadeInView key={item.id} direction="up" delay={index * 0.1}>
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center space-x-4">
                          {/* Product Image */}
                          <div className="flex-shrink-0">
                            <img
                              src={item.product?.images?.[0]?.image_url || '/placeholder.svg'}
                              alt={item.product?.name || 'Product image'}
                              className="h-20 w-20 object-cover rounded-lg"
                            />
                          </div>

                          {/* Product Details */}
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                              {item.product?.name}
                            </h3>
                            {item.variant && (
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {item.variant.name}
                              </p>
                            )}
                            <p className="text-lg font-medium text-nature-forest">
                              {formatPrice(item.variant?.price_cents || item.product?.price_cents || 0)}
                            </p>
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-12 text-center font-medium">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>

                          {/* Total Price */}
                          <div className="text-right">
                            <p className="text-lg font-semibold">
                              {formatPrice((item.variant?.price_cents || item.product?.price_cents || 0) * item.quantity)}
                            </p>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFromCart(item.id)}
                              className="text-red-600 hover:text-red-700 mt-2"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </FadeInView>
                ))}
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <FadeInView direction="up" delay={0.2}>
                  <Card className="sticky top-24">
                    <CardHeader>
                      <CardTitle>Order Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>{formatPrice(cartTotal)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Shipping:</span>
                        <span className="text-green-600">Free</span>
                      </div>
                      <div className="border-t pt-4">
                        <div className="flex justify-between font-semibold text-lg">
                          <span>Total:</span>
                          <span>{formatPrice(cartTotal)}</span>
                        </div>
                      </div>
                      <Button className="w-full mt-6" size="lg">
                        Proceed to Checkout
                      </Button>
                      <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
                        Secure checkout powered by Stripe
                      </p>
                    </CardContent>
                  </Card>
                </FadeInView>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </>
  );
};

export default CartPage;
