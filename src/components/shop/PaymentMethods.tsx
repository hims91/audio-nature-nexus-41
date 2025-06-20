
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Calendar, RefreshCw, Shield, CheckCircle } from 'lucide-react';
import { formatPrice } from '@/utils/currency';

interface PaymentMethod {
  id: string;
  type: 'card' | 'subscription' | 'installment';
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  features: string[];
  popular?: boolean;
}

interface PaymentMethodsProps {
  methods: PaymentMethod[];
  selectedMethod: string;
  onMethodSelect: (methodId: string) => void;
  onConfirm: () => void;
  isProcessing?: boolean;
}

const PaymentMethods: React.FC<PaymentMethodsProps> = ({
  methods,
  selectedMethod,
  onMethodSelect,
  onConfirm,
  isProcessing = false
}) => {
  const getMethodIcon = (type: string) => {
    switch (type) {
      case 'card':
        return <CreditCard className="h-5 w-5" />;
      case 'subscription':
        return <Calendar className="h-5 w-5" />;
      case 'installment':
        return <RefreshCw className="h-5 w-5" />;
      default:
        return <CreditCard className="h-5 w-5" />;
    }
  };

  const selectedPaymentMethod = methods.find(method => method.id === selectedMethod);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {methods.map((method) => (
          <Card 
            key={method.id}
            className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
              selectedMethod === method.id 
                ? 'ring-2 ring-nature-forest border-nature-forest' 
                : 'hover:border-gray-300'
            } ${method.popular ? 'relative' : ''}`}
            onClick={() => onMethodSelect(method.id)}
          >
            {method.popular && (
              <Badge 
                className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-nature-forest"
              >
                Most Popular
              </Badge>
            )}
            
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {getMethodIcon(method.type)}
                  <CardTitle className="text-lg">{method.name}</CardTitle>
                </div>
                {selectedMethod === method.id && (
                  <CheckCircle className="h-5 w-5 text-nature-forest" />
                )}
              </div>
              <p className="text-sm text-gray-600">{method.description}</p>
            </CardHeader>
            
            <CardContent className="pt-0">
              <div className="space-y-3">
                {/* Pricing */}
                <div className="flex items-baseline space-x-2">
                  <span className="text-2xl font-bold text-nature-forest">
                    {formatPrice(method.price)}
                  </span>
                  {method.originalPrice && method.originalPrice > method.price && (
                    <span className="text-sm text-gray-500 line-through">
                      {formatPrice(method.originalPrice)}
                    </span>
                  )}
                  {method.type === 'subscription' && (
                    <span className="text-sm text-gray-600">/month</span>
                  )}
                </div>

                {/* Discount Badge */}
                {method.discount && (
                  <Badge variant="secondary" className="text-green-600">
                    Save {method.discount}%
                  </Badge>
                )}

                {/* Features */}
                <ul className="space-y-1">
                  {method.features.slice(0, 3).map((feature, index) => (
                    <li key={index} className="text-sm text-gray-600 flex items-center">
                      <CheckCircle className="h-3 w-3 text-green-500 mr-2 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                  {method.features.length > 3 && (
                    <li className="text-xs text-gray-500">
                      +{method.features.length - 3} more features
                    </li>
                  )}
                </ul>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Security Notice */}
      <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
        <Shield className="h-4 w-4" />
        <span>Secure payment processing powered by Stripe</span>
      </div>

      {/* Selected Method Details */}
      {selectedPaymentMethod && (
        <Card className="bg-nature-mist border-nature-forest">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-nature-forest">
                  Selected: {selectedPaymentMethod.name}
                </h3>
                <p className="text-sm text-gray-600">
                  {selectedPaymentMethod.description}
                </p>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-nature-forest">
                  {formatPrice(selectedPaymentMethod.price)}
                  {selectedPaymentMethod.type === 'subscription' && (
                    <span className="text-sm font-normal">/month</span>
                  )}
                </div>
                {selectedPaymentMethod.discount && (
                  <div className="text-sm text-green-600">
                    Save {selectedPaymentMethod.discount}%
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Button */}
      <Button 
        onClick={onConfirm}
        disabled={!selectedMethod || isProcessing}
        className="w-full py-3 text-lg"
        size="lg"
      >
        {isProcessing ? (
          <>
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            Processing Payment...
          </>
        ) : selectedPaymentMethod ? (
          `Continue with ${selectedPaymentMethod.name}`
        ) : (
          'Select a Payment Method'
        )}
      </Button>

      {/* Payment Method Specific Info */}
      {selectedPaymentMethod && (
        <div className="text-xs text-gray-500 text-center space-y-1">
          {selectedPaymentMethod.type === 'subscription' && (
            <p>You can cancel or modify your subscription at any time from your account settings.</p>
          )}
          {selectedPaymentMethod.type === 'installment' && (
            <p>Your payment will be split into manageable installments with no additional fees.</p>
          )}
          <p>All payments are secured with 256-bit SSL encryption.</p>
        </div>
      )}
    </div>
  );
};

export default PaymentMethods;
