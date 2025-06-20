
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calculator, MapPin, Info } from 'lucide-react';
import { formatPrice } from '@/utils/currency';

interface TaxRate {
  jurisdiction: string;
  type: 'state' | 'county' | 'city' | 'district';
  rate: number;
  description?: string;
}

interface TaxBreakdown {
  subtotal: number;
  taxRates: TaxRate[];
  totalTax: number;
  total: number;
  jurisdiction: string;
}

interface TaxCalculatorProps {
  subtotal: number;
  shippingAddress: {
    state: string;
    city: string;
    postal_code: string;
    country: string;
  };
  onTaxCalculated: (taxInfo: TaxBreakdown) => void;
  className?: string;
}

const TaxCalculator: React.FC<TaxCalculatorProps> = ({
  subtotal,
  shippingAddress,
  onTaxCalculated,
  className = ""
}) => {
  const [taxBreakdown, setTaxBreakdown] = useState<TaxBreakdown | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (subtotal > 0 && shippingAddress.state && shippingAddress.postal_code) {
      calculateTax();
    }
  }, [subtotal, shippingAddress.state, shippingAddress.postal_code, shippingAddress.city]);

  const calculateTax = async () => {
    setIsCalculating(true);
    setError(null);

    try {
      // Mock tax calculation - replace with real tax service like TaxJar, Avalara, etc.
      const taxRates = await fetchTaxRates(shippingAddress);
      const totalTaxRate = taxRates.reduce((sum, rate) => sum + rate.rate, 0);
      const totalTax = Math.round(subtotal * totalTaxRate);

      const breakdown: TaxBreakdown = {
        subtotal,
        taxRates,
        totalTax,
        total: subtotal + totalTax,
        jurisdiction: `${shippingAddress.city}, ${shippingAddress.state}`
      };

      setTaxBreakdown(breakdown);
      onTaxCalculated(breakdown);

    } catch (err: any) {
      console.error('Tax calculation failed:', err);
      setError(err.message || 'Failed to calculate tax');
      
      // Fallback to default tax rate
      const fallbackRate = 0.05; // 5% default
      const fallbackTax = Math.round(subtotal * fallbackRate);
      const fallbackBreakdown: TaxBreakdown = {
        subtotal,
        taxRates: [{
          jurisdiction: shippingAddress.state,
          type: 'state',
          rate: fallbackRate,
          description: 'Estimated tax rate'
        }],
        totalTax: fallbackTax,
        total: subtotal + fallbackTax,
        jurisdiction: `${shippingAddress.city}, ${shippingAddress.state}`
      };
      
      setTaxBreakdown(fallbackBreakdown);
      onTaxCalculated(fallbackBreakdown);
    } finally {
      setIsCalculating(false);
    }
  };

  const fetchTaxRates = async (address: typeof shippingAddress): Promise<TaxRate[]> => {
    // Mock implementation - replace with actual tax service API
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call

    const stateTaxRates: Record<string, TaxRate[]> = {
      'CA': [
        { jurisdiction: 'California', type: 'state', rate: 0.0725, description: 'State sales tax' },
        { jurisdiction: 'Los Angeles County', type: 'county', rate: 0.0025, description: 'County tax' },
        { jurisdiction: address.city, type: 'city', rate: 0.0125, description: 'City tax' }
      ],
      'NY': [
        { jurisdiction: 'New York', type: 'state', rate: 0.08, description: 'State sales tax' },
        { jurisdiction: 'Local', type: 'city', rate: 0.005, description: 'Local tax' }
      ],
      'TX': [
        { jurisdiction: 'Texas', type: 'state', rate: 0.0625, description: 'State sales tax' },
        { jurisdiction: 'Local', type: 'city', rate: 0.02, description: 'Local tax' }
      ],
      'FL': [
        { jurisdiction: 'Florida', type: 'state', rate: 0.06, description: 'State sales tax' },
        { jurisdiction: 'County', type: 'county', rate: 0.01, description: 'County tax' }
      ],
      'WA': [
        { jurisdiction: 'Washington', type: 'state', rate: 0.065, description: 'State sales tax' },
        { jurisdiction: 'Local', type: 'city', rate: 0.015, description: 'Local tax' }
      ]
    };

    return stateTaxRates[address.state] || [
      { jurisdiction: address.state, type: 'state', rate: 0.05, description: 'Estimated state tax' }
    ];
  };

  if (!subtotal || !shippingAddress.state) {
    return null;
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-lg">
          <Calculator className="h-5 w-5 mr-2" />
          Tax Calculation
          {isCalculating && (
            <div className="ml-2 w-4 h-4 border-2 border-gray-300 border-t-nature-forest rounded-full animate-spin" />
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {error && (
          <div className="flex items-start space-x-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <Info className="h-4 w-4 text-yellow-600 mt-0.5" />
            <div className="text-sm">
              <p className="text-yellow-800 font-medium">Tax Calculation Notice</p>
              <p className="text-yellow-700">{error}</p>
              <p className="text-yellow-600 text-xs mt-1">Using estimated tax rate.</p>
            </div>
          </div>
        )}

        {taxBreakdown && (
          <div className="space-y-3">
            {/* Location */}
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <MapPin className="h-4 w-4" />
              <span>Tax jurisdiction: {taxBreakdown.jurisdiction}</span>
            </div>

            {/* Tax Breakdown */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal:</span>
                <span>{formatPrice(taxBreakdown.subtotal)}</span>
              </div>

              {taxBreakdown.taxRates.map((rate, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <span>{rate.description || rate.jurisdiction}:</span>
                    <Badge variant="outline" className="text-xs">
                      {(rate.rate * 100).toFixed(2)}%
                    </Badge>
                  </div>
                  <span>{formatPrice(Math.round(taxBreakdown.subtotal * rate.rate))}</span>
                </div>
              ))}

              <div className="border-t pt-2 flex justify-between font-medium">
                <span>Total Tax:</span>
                <span>{formatPrice(taxBreakdown.totalTax)}</span>
              </div>

              <div className="border-t pt-2 flex justify-between font-bold text-lg">
                <span>Total with Tax:</span>
                <span className="text-nature-forest">{formatPrice(taxBreakdown.total)}</span>
              </div>
            </div>

            {/* Tax-exempt notice */}
            <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
              <p>• Tax rates are calculated based on your shipping address</p>
              <p>• Rates may vary by product type and local regulations</p>
              <p>• Final tax amount will be confirmed at checkout</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TaxCalculator;
