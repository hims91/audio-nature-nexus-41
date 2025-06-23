
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
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
import TaxCalculator from './TaxCalculator';

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

interface TaxInfo {
  rate: number;
  amount: number;
  jurisdiction: string;
}

const CheckoutPage: React.FC = () => {
  const { cartItems, cartTotal, isLoading, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [step, setStep] = useState<'shipping' | 'review'>('shipping');
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

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Validation function
  const validateShippingInfo = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!shippingInfo.first_name.trim()) {
      errors.first_name = 'First name is required';
    }
    if (!shippingInfo.last_name.trim()) {
      errors.last_name = 'Last name is required';
    }
    if (!shippingInfo.address_line1.trim()) {
      errors.address_line1 = 'Address is required';
    }
    if (!shippingInfo.city.trim()) {
      errors.city = 'City is required';
    }
    if (!shippingInfo.state.trim()) {
      errors.state = 'State is required';
    }
    if (!shippingInfo.postal_code.trim()) {
      errors.postal_code = 'ZIP code is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateCheckout = async () => {
    if (!user) {
      toast.error('Please sign in to continue');
      navigate('/auth');
      return;
    }

    if (!validateShippingInfo()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsProcessing(true);
    
    try {
      const checkoutItems = cartItems.map(item => ({
        product_id: item.product_id,
        variant_id: item.variant_id,
        quantity: item.quantity
      }));

      console.log('Creating checkout with items:', checkoutItems);
      console.log('Shipping info:', shippingInfo);

      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: {
          items: checkoutItems,
          shipping_address: shippingInfo,
          customer_email: user.email,
          success_url: `${window.location.origin}/order-success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${window.location.origin}/cart`,
        }
      });

      console.log('Checkout response:', data, error);

      if (error) throw error;

      if (data?.url) {
        // Clear cart before redirecting
        await clearCart();
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

  const handleTaxCalculated = (taxBreakdown: any) => {
    if (taxBreakdown && taxBreakdown.totalTax && taxBreakdown.subtotal) {
      setTaxInfo({
        rate: taxBreakdown.totalTax / taxBreakdown.subtotal,
        amount: taxBreakdown.totalTax,
        jurisdiction: taxBreakdown.jurisdiction || 'Local'
      });
    }
  };

  const totalAmount = cartTotal + shippingCost + (taxInfo?.amount || 0);

  // Check for required authentication
  useEffect(() => {
    if (!isLoading && !user) {
      toast.error('Please sign in to checkout');
      navigate('/auth');
    }
  }, [user, isLoading, navigate]);

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

  if (!user) {
    return (
      <>
        <UnifiedNavbar />
        <div className="min-h-screen bg-white dark:bg-gray-900 pt-20">
          <div className="container mx-auto px-4 py-8">
            <Card className="text-center py-12">
              <CardContent>
                <h2 className="text-2xl font-semibold mb-4">Sign in required</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Please sign in to complete your checkout.
                </p>
                <Button asChild>
                  <Link to="/auth">Sign In</Link>
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
                          className={formErrors.first_name ? 'border-red-500' : ''}
                          required
                        />
                        {formErrors.first_name && (
                          <p className="text-sm text-red-500 mt-1">{formErrors.first_name}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="last_name">Last Name *</Label>
                        <Input
                          id="last_name"
                          value={shippingInfo.last_name}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, last_name: e.target.value })}
                          className={formErrors.last_name ? 'border-red-500' : ''}
                          required
                        />
                        {formErrors.last_name && (
                          <p className="text-sm text-red-500 mt-1">{formErrors.last_name}</p>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="address_line1">Address *</Label>
                      <Input
                        id="address_line1"
                        value={shippingInfo.address_line1}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, address_line1: e.target.value })}
                        className={formErrors.address_line1 ? 'border-red-500' : ''}
                        required
                      />
                      {formErrors.address_line1 && (
                        <p className="text-sm text-red-500 mt-1">{formErrors.address_line1}</p>
                      )}
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
                          className={formErrors.city ? 'border-red-500' : ''}
                          required
                        />
                        {formErrors.city && (
                          <p className="text-sm text-red-500 mt-1">{formErrors.city}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="state">State *</Label>
                        <Select 
                          value={shippingInfo.state} 
                          onValueChange={(value) => setShippingInfo({ ...shippingInfo, state: value })}
                        >
                          <SelectTrigger className={formErrors.state ? 'border-red-500' : ''}>
                            <SelectValue placeholder="Select state" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="AL">Alabama</SelectItem>
                            <SelectItem value="AK">Alaska</SelectItem>
                            <SelectItem value="AZ">Arizona</SelectItem>
                            <SelectItem value="AR">Arkansas</SelectItem>
                            <SelectItem value="CA">California</SelectItem>
                            <SelectItem value="CO">Colorado</SelectItem>
                            <SelectItem value="CT">Connecticut</SelectItem>
                            <SelectItem value="DE">Delaware</SelectItem>
                            <SelectItem value="FL">Florida</SelectItem>
                            <SelectItem value="GA">Georgia</SelectItem>
                            <SelectItem value="HI">Hawaii</SelectItem>
                            <SelectItem value="ID">Idaho</SelectItem>
                            <SelectItem value="IL">Illinois</SelectItem>
                            <SelectItem value="IN">Indiana</SelectItem>
                            <SelectItem value="IA">Iowa</SelectItem>
                            <SelectItem value="KS">Kansas</SelectItem>
                            <SelectItem value="KY">Kentucky</SelectItem>
                            <SelectItem value="LA">Louisiana</SelectItem>
                            <SelectItem value="ME">Maine</SelectItem>
                            <SelectItem value="MD">Maryland</SelectItem>
                            <SelectItem value="MA">Massachusetts</SelectItem>
                            <SelectItem value="MI">Michigan</SelectItem>
                            <SelectItem value="MN">Minnesota</SelectItem>
                            <SelectItem value="MS">Mississippi</SelectItem>
                            <SelectItem value="MO">Missouri</SelectItem>
                            <SelectItem value="MT">Montana</SelectItem>
                            <SelectItem value="NE">Nebraska</SelectItem>
                            <SelectItem value="NV">Nevada</SelectItem>
                            <SelectItem value="NH">New Hampshire</SelectItem>
                            <SelectItem value="NJ">New Jersey</SelectItem>
                            <SelectItem value="NM">New Mexico</SelectItem>
                            <SelectItem value="NY">New York</SelectItem>
                            <SelectItem value="NC">North Carolina</SelectItem>
                            <SelectItem value="ND">North Dakota</SelectItem>
                            <SelectItem value="OH">Ohio</SelectItem>
                            <SelectItem value="OK">Oklahoma</SelectItem>
                            <SelectItem value="OR">Oregon</SelectItem>
                            <SelectItem value="PA">Pennsylvania</SelectItem>
                            <SelectItem value="RI">Rhode Island</SelectItem>
                            <SelectItem value="SC">South Carolina</SelectItem>
                            <SelectItem value="SD">South Dakota</SelectItem>
                            <SelectItem value="TN">Tennessee</SelectItem>
                            <SelectItem value="TX">Texas</SelectItem>
                            <SelectItem value="UT">Utah</SelectItem>
                            <SelectItem value="VT">Vermont</SelectItem>
                            <SelectItem value="VA">Virginia</SelectItem>
                            <SelectItem value="WA">Washington</SelectItem>
                            <SelectItem value="WV">West Virginia</SelectItem>
                            <SelectItem value="WI">Wisconsin</SelectItem>
                            <SelectItem value="WY">Wyoming</SelectItem>
                          </SelectContent>
                        </Select>
                        {formErrors.state && (
                          <p className="text-sm text-red-500 mt-1">{formErrors.state}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="postal_code">ZIP Code *</Label>
                        <Input
                          id="postal_code"
                          value={shippingInfo.postal_code}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, postal_code: e.target.value })}
                          className={formErrors.postal_code ? 'border-red-500' : ''}
                          required
                        />
                        {formErrors.postal_code && (
                          <p className="text-sm text-red-500 mt-1">{formErrors.postal_code}</p>
                        )}
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
                      onClick={() => {
                        if (validateShippingInfo()) {
                          setStep('review');
                        }
                      }} 
                      className="w-full"
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

              {/* Tax Calculator */}
              {shippingInfo.state && shippingInfo.postal_code && (
                <TaxCalculator
                  subtotal={cartTotal}
                  shippingAddress={{
                    state: shippingInfo.state,
                    city: shippingInfo.city,
                    postal_code: shippingInfo.postal_code,
                    country: shippingInfo.country
                  }}
                  onTaxCalculated={handleTaxCalculated}
                  className="mt-6"
                />
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
                  </div>

                  <Separator />

                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total:</span>
                    <span>{formatPrice(totalAmount)}</span>
                  </div>
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
