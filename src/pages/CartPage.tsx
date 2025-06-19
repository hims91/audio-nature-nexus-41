
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { formatPrice } from '@/utils/currency';
import LoadingSpinner from '@/components/animations/LoadingSpinner';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const CartPage: React.FC = () => {
  const { cartItems, cartTotal, updateQuantity, removeFromCart, clearCart, isLoading } = useCart();

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeFromCart(itemId);
    } else {
      updateQuantity({ itemId, quantity: newQuantity });
    }
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) return;

    try {
      const checkoutItems = cartItems.map(item => ({
        product_id: item.product_id,
        variant_id: item.variant_id,
        quantity: item.quantity,
      }));

      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: {
          items: checkoutItems,
          success_url: `${window.location.origin}/order/success`,
          cancel_url: `${window.location.origin}/shop/cart`,
        },
      });

      if (error) throw error;

      // Open Stripe checkout in a new tab
      if (data.url) {
        window.open(data.url, '_blank');
      }

    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Failed to start checkout process');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Shopping Cart - Terra Echo Studios</title>
        <meta name="description" content="Review your Terra Echo Studios merchandise before checkout." />
      </Helmet>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <Button variant="ghost" asChild className="mb-4">
              <Link to="/shop">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Continue Shopping
              </Link>
            </Button>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Shopping Cart</h1>
          </div>

          {cartItems.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <ShoppingBag className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Looks like you haven't added anything to your cart yet.
                </p>
                <Button asChild>
                  <Link to="/shop">Start Shopping</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {cartItems.map((item) => {
                  const product = item.product!;
                  const variant = item.variant;
                  const price = variant?.price_cents || product.price_cents;
                  const primaryImage = product.images?.find(img => img.is_primary) || product.images?.[0];

                  return (
                    <Card key={item.id}>
                      <CardContent className="p-6">
                        <div className="flex items-center space-x-4">
                          {/* Product Image */}
                          <div className="w-20 h-20 flex-shrink-0">
                            {primaryImage ? (
                              <img
                                src={primaryImage.image_url}
                                alt={product.name}
                                className="w-full h-full object-cover rounded-md"
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-200 dark:bg-gray-700 rounded-md flex items-center justify-center">
                                <span className="text-xs text-gray-400">No Image</span>
                              </div>
                            )}
                          </div>

                          {/* Product Details */}
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                              {product.name}
                            </h3>
                            {variant && (
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {variant.name}
                              </p>
                            )}
                            <p className="text-lg font-bold text-nature-forest">
                              {formatPrice(price)}
                            </p>
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            >
                              <Minus className="w-4 h-4" />
                            </Button>
                            <Input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 0)}
                              className="w-16 text-center"
                              min="0"
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>

                          {/* Remove Button */}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}

                {/* Clear Cart */}
                <div className="flex justify-end">
                  <Button variant="outline" onClick={() => clearCart()}>
                    Clear Cart
                  </Button>
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <Card className="sticky top-4">
                  <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>{formatPrice(cartTotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span>Calculated at checkout</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax</span>
                      <span>Calculated at checkout</span>
                    </div>
                    <hr />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span>{formatPrice(cartTotal)}</span>
                    </div>

                    <Button 
                      onClick={handleCheckout} 
                      className="w-full bg-nature-forest hover:bg-nature-leaf text-white"
                      size="lg"
                    >
                      Proceed to Checkout
                    </Button>

                    <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
                      Secure checkout powered by Stripe
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CartPage;
