
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Truck, Shield, ArrowLeft } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/contexts/AuthContext';
import { formatPrice } from '@/utils/currency';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';
import UnifiedNavbar from '@/components/UnifiedNavbar';
import Footer from '@/components/Footer';
import LoadingSpinner from '@/components/animations/LoadingSpinner';

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

interface BillingInfo extends ShippingInfo {
  same_as_shipping: boolean;
}

interface TaxInfo {
  rate: number;
  amount: number;
  jurisdiction: string;
}

const CheckoutPage: React.FC = () => {
  const { cartItems, cartTotal, isLoading } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [step, setStep] = useState<'shipping' | 'payment' | 'review'>('shipping');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'subscription'>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [taxInfo, setTaxInfo] = useState<TaxInfo | null>(null);
  const [shippingCost, setShippingCost] = useState(500); // $5 default
  
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

  const [billingInfo, setBillingInfo] = useState<BillingInfo>({
    ...shippingInfo,
    same_as_shipping: true
  });

  // Calculate tax when shipping info changes
  useEffect(() => {
    if (shippingInfo.state && shippingInfo.postal_code && cartTotal > 0) {
      calculateTax();
    }
  }, [shippingInfo.state, shippingInfo.postal_code, cartTotal]);

  const calculateTax = async () => {
    try {
      // Mock tax calculation - replace with real tax service
      const taxRate = getTaxRate(shippingInfo.state);
      const taxAmount = Math.round(cartTotal * taxRate);
      
      setTaxInfo({
        rate: taxRate,
        amount: taxAmount,
        jurisdiction: shippingInfo.state
      });
    } catch (error) {
      console.error('Tax calculation failed:', error);
      setTaxInfo(null);
    }
  };

  const getTaxRate = (state: string): number => {
    // Mock tax rates - replace with real tax service integration
    const taxRates: Record<string, number> = {
      'CA': 0.0875, // California
      'NY': 0.08,   // New York
      'TX': 0.0625, // Texas
      'FL': 0.06,   // Florida
      'WA': 0.065,  // Washington
    };
    return taxRates[state] || 0.05; // Default 5%
  };

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

      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: {
          items: checkoutItems,
          shipping_address: shippingInfo,
          customer_email: user.email,
          success_url: `${window.location.origin}/order-success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${window.location.origin}/cart`,
          payment_mode: paymentMethod === 'subscription' ? 'subscription' : 'payment'
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

  const handleRetryPayment = async (orderId: string) => {
    setIsProcessing(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('retry-payment', {
        body: { order_id: orderId }
      });

      if (error) throw error;

      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (error: any) {
      console.error('Payment retry failed:', error);
      toast.error(error.message || 'Failed to retry payment');
    } finally {
      setIsProcessing(false);
    }
  };

  const totalAmount = cartTotal + shippingCost + (taxInfo?.amount || 0);

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

  if (cartItems.length === 0) {
    return (
      <>
        <UnifiedNavbar />
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
        <Footer />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Checkout - Terra Echo Studios</title>
        <meta name="description" content="Secure checkout for your Terra Echo Studios order." />
      </Helmet>

      <UnifiedNavbar />
      
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
                {['shipping', 'payment', 'review'].map((stepName, index) => (
                  <div key={stepName} className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      step === stepName ? 'bg-nature-forest text-white' : 
                      ['shipping', 'payment', 'review'].indexOf(step) > index ? 'bg-green-500 text-white' : 
                      'bg-gray-200 text-gray-600'
                    }`}>
                      {index + 1}
                    </div>
                    <span className="ml-2 text-sm font-medium capitalize">{stepName}</span>
                    {index < 2 && <div className="w-12 h-0.5 bg-gray-200 ml-4" />}
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
                        <Label htmlFor="first_name">First Name</Label>
                        <Input
                          id="first_name"
                          value={shippingInfo.first_name}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, first_name: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="last_name">Last Name</Label>
                        <Input
                          id="last_name"
                          value={shippingInfo.last_name}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, last_name: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="address_line1">Address</Label>
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
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          value={shippingInfo.city}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="state">State</Label>
                        <Select value={shippingInfo.state} onValueChange={(value) => setShippingInfo({ ...shippingInfo, state: value })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select state" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="CA">California</SelectItem>
                            <SelectItem value="NY">New York</SelectItem>
                            <SelectItem value="TX">Texas</SelectItem>
                            <SelectItem value="FL">Florida</SelectItem>
                            <SelectItem value="WA">Washington</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="postal_code">ZIP Code</Label>
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
                      onClick={() => setStep('payment')} 
                      className="w-full"
                      disabled={!shippingInfo.first_name || !shippingInfo.last_name || !shippingInfo.address_line1 || !shippingInfo.city || !shippingInfo.state || !shippingInfo.postal_code}
                    >
                      Continue to Payment
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Payment Method */}
              {step === 'payment' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <CreditCard className="h-5 w-5 mr-2" />
                      Payment Method
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        paymentMethod === 'card' ? 'border-nature-forest bg-nature-mist' : 'border-gray-200'
                      }`} onClick={() => setPaymentMethod('card')}>
                        <div className="flex items-center space-x-3">
                          <div className={`w-4 h-4 rounded-full border-2 ${
                            paymentMethod === 'card' ? 'border-nature-forest bg-nature-forest' : 'border-gray-300'
                          }`} />
                          <div>
                            <h3 className="font-medium">One-time Payment</h3>
                            <p className="text-sm text-gray-600">Pay once for your order</p>
                          </div>
                        </div>
                      </div>

                      <div className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        paymentMethod === 'subscription' ? 'border-nature-forest bg-nature-mist' : 'border-gray-200'
                      }`} onClick={() => setPaymentMethod('subscription')}>
                        <div className="flex items-center space-x-3">
                          <div className={`w-4 h-4 rounded-full border-2 ${
                            paymentMethod === 'subscription' ? 'border-nature-forest bg-nature-forest' : 'border-gray-300'
                          }`} />
                          <div>
                            <h3 className="font-medium">Subscription</h3>
                            <p className="text-sm text-gray-600">Monthly billing</p>
                            <Badge variant="secondary" className="text-xs mt-1">Save 15%</Badge>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Shield className="h-4 w-4" />
                      <span>Secure payment powered by Stripe</span>
                    </div>

                    <div className="flex space-x-4">
                      <Button variant="outline" onClick={() => setStep('shipping')}>
                        Back
                      </Button>
                      <Button onClick={() => setStep('review')} className="flex-1">
                        Review Order
                      </Button>
                    </div>
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
                      <p className="text-sm text-gray-600">
                        {shippingInfo.first_name} {shippingInfo.last_name}<br />
                        {shippingInfo.address_line1}<br />
                        {shippingInfo.address_line2 && <>{shippingInfo.address_line2}<br /></>}
                        {shippingInfo.city}, {shippingInfo.state} {shippingInfo.postal_code}
                      </p>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <h4 className="font-medium">Payment Method</h4>
                      <p className="text-sm text-gray-600">
                        {paymentMethod === 'card' ? 'One-time Payment' : 'Monthly Subscription'}
                      </p>
                    </div>

                    <div className="flex space-x-4">
                      <Button variant="outline" onClick={() => setStep('payment')}>
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
                          `Complete Order - ${formatPrice(totalAmount)}`
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Cart Items */}
                  <div className="space-y-3">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex items-center space-x-3">
                        <img
                          src={item.product?.images?.[0]?.image_url || '/placeholder.svg'}
                          alt={item.product?.name}
                          className="h-12 w-12 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h4 className="text-sm font-medium">{item.product?.name}</h4>
                          {item.variant && (
                            <p className="text-xs text-gray-600">{item.variant.name}</p>
                          )}
                          <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                        </div>
                        <p className="text-sm font-medium">
                          {formatPrice((item.variant?.price_cents || item.product?.price_cents || 0) * item.quantity)}
                        </p>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  {/* Totals */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal:</span>
                      <span>{formatPrice(cartTotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Shipping:</span>
                      <span>{formatPrice(shippingCost)}</span>
                    </div>
                    {taxInfo && (
                      <div className="flex justify-between text-sm">
                        <span>Tax ({(taxInfo.rate * 100).toFixed(1)}%):</span>
                        <span>{formatPrice(taxInfo.amount)}</span>
                      </div>
                    )}
                    {paymentMethod === 'subscription' && (
                      <div className="flex justify-between text-sm text-green-600">
                        <span>Subscription Discount:</span>
                        <span>-{formatPrice(Math.round(cartTotal * 0.15))}</span>
                      </div>
                    )}
                  </div>

                  <Separator />

                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total:</span>
                    <span>{formatPrice(paymentMethod === 'subscription' ? totalAmount - Math.round(cartTotal * 0.15) : totalAmount)}</span>
                  </div>

                  {paymentMethod === 'subscription' && (
                    <p className="text-xs text-gray-600 text-center">
                      Billed monthly. Cancel anytime.
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </>
  );
};

export default CheckoutPage;
