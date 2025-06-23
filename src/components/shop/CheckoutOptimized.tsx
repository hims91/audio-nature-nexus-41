
import React, { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CreditCard, Truck, Shield, ArrowLeft } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/contexts/AuthContext';
import { formatPrice } from '@/utils/currency';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';
import LoadingSpinner from '@/components/animations/LoadingSpinner';
import OrderSummaryCard from './OrderSummaryCard';
import { debounce } from 'lodash';

interface ShippingInfo {
  first_name: string;
  last_name: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone?: string;
}

const STATES = [
  { value: 'CA', label: 'California' },
  { value: 'NY', label: 'New York' },
  { value: 'TX', label: 'Texas' },
  { value: 'FL', label: 'Florida' },
  { value: 'WA', label: 'Washington' },
  // Add more states as needed
];

const CheckoutOptimized: React.FC = () => {
  const { cartItems, cartTotal, isLoading: cartLoading } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [step, setStep] = useState<'shipping' | 'review'>('shipping');
  const [isProcessing, setIsProcessing] = useState(false);
  const [taxAmount, setTaxAmount] = useState(0);
  const [shippingCost, setShippingCost] = useState(500); // $5 default
  const [isCalculatingTax, setIsCalculatingTax] = useState(false);
  
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    first_name: '',
    last_name: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'US',
    phone: ''
  });

  // Memoized order summary items
  const orderSummaryItems = useMemo(() => {
    return cartItems.map(item => ({
      id: item.id,
      name: item.product?.name || 'Unknown Product',
      variant: item.variant?.name,
      quantity: item.quantity,
      price: (item.variant?.price_cents || item.product?.price_cents || 0) / 100,
      image: item.product?.images?.[0]?.image_url
    }));
  }, [cartItems]);

  // Debounced tax calculation
  const debouncedCalculateTax = useMemo(
    () => debounce(async (state: string, postalCode: string, subtotal: number) => {
      if (!state || !postalCode || subtotal === 0) {
        setTaxAmount(0);
        return;
      }

      setIsCalculatingTax(true);
      try {
        // Simple tax calculation - in production, use a tax service like TaxJar
        const taxRates: Record<string, number> = {
          'CA': 0.0875, // 8.75%
          'NY': 0.08,   // 8%
          'TX': 0.0625, // 6.25%
          'FL': 0.06,   // 6%
          'WA': 0.065,  // 6.5%
        };

        const rate = taxRates[state] || 0.05; // Default 5%
        const calculatedTax = Math.round(subtotal * rate);
        setTaxAmount(calculatedTax);
      } catch (error) {
        console.error('Tax calculation error:', error);
        setTaxAmount(0);
      } finally {
        setIsCalculatingTax(false);
      }
    }, 500),
    []
  );

  // Calculate tax when shipping info changes
  useEffect(() => {
    if (shippingInfo.state && shippingInfo.postal_code) {
      debouncedCalculateTax(shippingInfo.state, shippingInfo.postal_code, cartTotal);
    }
  }, [shippingInfo.state, shippingInfo.postal_code, cartTotal, debouncedCalculateTax]);

  const totalAmount = cartTotal + shippingCost + taxAmount;

  const handleCreateCheckout = async () => {
    if (!user) {
      toast.error('Please sign in to continue');
      navigate('/auth');
      return;
    }

    setIsProcessing(true);
    
    try {
      const checkoutItems = cartItems.map(item => ({
        product_id: item.product_id,
        variant_id: item.variant_id,
        quantity: item.quantity
      }));

      console.log('Creating optimized checkout with items:', checkoutItems);

      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: {
          items: checkoutItems,
          shipping_address: shippingInfo,
          customer_email: user.email,
          success_url: `${window.location.origin}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${window.location.origin}/payment-failed`,
        }
      });

      if (error) throw error;

      if (data?.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error: any) {
      console.error('Checkout failed:', error);
      toast.error(error.message || 'Failed to create checkout session');
    } finally {
      setIsProcessing(false);
    }
  };

  const isShippingValid = shippingInfo.first_name && 
                         shippingInfo.last_name && 
                         shippingInfo.address_line1 && 
                         shippingInfo.city && 
                         shippingInfo.state && 
                         shippingInfo.postal_code;

  if (cartLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 pt-20 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 pt-20">
        <div className="container mx-auto px-4 py-8">
          <Card className="text-center py-12">
            <CardContent>
              <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Add some items to your cart before checking out.
              </p>
              <Button asChild>
                <Link to="/shop">Continue Shopping</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Checkout - Terra Echo Studios</title>
        <meta name="description" content="Secure checkout for your Terra Echo Studios order." />
      </Helmet>

      <div className="min-h-screen bg-white dark:bg-gray-900 pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center space-x-4 mb-8">
            <Button variant="outline" size="sm" asChild>
              <Link to="/cart">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Cart
              </Link>
            </Button>
            <h1 className="text-3xl font-bold text-nature-forest dark:text-white">
              Secure Checkout
            </h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Step Indicator */}
              <div className="flex items-center space-x-4 mb-6">
                {['shipping', 'review'].map((stepName, index) => (
                  <div key={stepName} className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      step === stepName ? 'bg-nature-forest text-white' : 
                      ['shipping', 'review'].indexOf(step) > index ? 'bg-green-500 text-white' : 
                      'bg-gray-200 text-gray-600'
                    }`}>
                      {index + 1}
                    </div>
                    <span className="ml-2 text-sm font-medium capitalize">{stepName}</span>
                    {index < 1 && <div className="w-12 h-0.5 bg-gray-200 ml-4" />}
                  </div>
                ))}
              </div>

              {/* Shipping Information */}
              {step === 'shipping' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Truck className="h-5 w-5 mr-2" />
                      Shipping Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="first_name">First Name *</Label>
                        <Input
                          id="first_name"
                          value={shippingInfo.first_name}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, first_name: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="last_name">Last Name *</Label>
                        <Input
                          id="last_name"
                          value={shippingInfo.last_name}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, last_name: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="address_line1">Address *</Label>
                      <Input
                        id="address_line1"
                        value={shippingInfo.address_line1}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, address_line1: e.target.value })}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="address_line2">Apartment, suite, etc. (optional)</Label>
                      <Input
                        id="address_line2"
                        value={shippingInfo.address_line2}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, address_line2: e.target.value })}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="city">City *</Label>
                        <Input
                          id="city"
                          value={shippingInfo.city}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="state">State *</Label>
                        <Select value={shippingInfo.state} onValueChange={(value) => setShippingInfo({ ...shippingInfo, state: value })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select state" />
                          </SelectTrigger>
                          <SelectContent>
                            {STATES.map(state => (
                              <SelectItem key={state.value} value={state.value}>
                                {state.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="postal_code">ZIP Code *</Label>
                        <Input
                          id="postal_code"
                          value={shippingInfo.postal_code}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, postal_code: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="phone">Phone Number (optional)</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={shippingInfo.phone}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, phone: e.target.value })}
                      />
                    </div>

                    <Button 
                      onClick={() => setStep('review')} 
                      className="w-full"
                      disabled={!isShippingValid}
                    >
                      Continue to Review
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Review Order */}
              {step === 'review' && (
                <Card>
                  <CardHeader>
                    <CardTitle>Review Your Order</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <h4 className="font-medium">Shipping Address</h4>
                      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 text-sm">
                        <p>{shippingInfo.first_name} {shippingInfo.last_name}</p>
                        <p>{shippingInfo.address_line1}</p>
                        {shippingInfo.address_line2 && <p>{shippingInfo.address_line2}</p>}
                        <p>{shippingInfo.city}, {shippingInfo.state} {shippingInfo.postal_code}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium">Payment Method</h4>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Shield className="h-4 w-4" />
                        <span>Secure payment powered by Stripe</span>
                      </div>
                    </div>

                    <div className="flex space-x-4">
                      <Button variant="outline" onClick={() => setStep('shipping')}>
                        Back
                      </Button>
                      <Button 
                        onClick={handleCreateCheckout} 
                        className="flex-1"
                        disabled={isProcessing}
                      >
                        {isProcessing ? (
                          <>
                            <LoadingSpinner size="sm" className="mr-2" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <CreditCard className="h-4 w-4 mr-2" />
                            Complete Order - {formatPrice(totalAmount)}
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <OrderSummaryCard
                items={orderSummaryItems}
                subtotal={cartTotal}
                shipping={shippingCost}
                tax={isCalculatingTax ? 0 : taxAmount}
                total={totalAmount}
              />
              
              {isCalculatingTax && (
                <div className="mt-2 text-sm text-gray-500 text-center">
                  Calculating tax...
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CheckoutOptimized;
