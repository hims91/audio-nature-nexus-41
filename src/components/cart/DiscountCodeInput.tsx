
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tag, X, Loader2 } from 'lucide-react';
import { useDiscountValidation } from '@/hooks/useDiscountCodes';
import { formatPrice } from '@/utils/currency';
import { toast } from 'sonner';

interface DiscountCodeInputProps {
  cartTotal: number;
  onDiscountApplied: (discount: {
    id: string;
    code: string;
    discountAmount: number;
  } | null) => void;
  appliedDiscount?: {
    id: string;
    code: string;
    discountAmount: number;
  } | null;
}

const DiscountCodeInput: React.FC<DiscountCodeInputProps> = ({
  cartTotal,
  onDiscountApplied,
  appliedDiscount
}) => {
  const [discountCode, setDiscountCode] = useState('');
  const { validateCode } = useDiscountValidation();

  const handleApplyDiscount = async () => {
    if (!discountCode.trim()) {
      toast.error('Please enter a discount code');
      return;
    }

    try {
      const result = await validateCode.mutateAsync({
        code: discountCode.toUpperCase(),
        orderTotal: cartTotal
      });

      if (result.is_valid) {
        onDiscountApplied({
          id: result.discount_id,
          code: discountCode.toUpperCase(),
          discountAmount: result.discount_amount_cents
        });
        toast.success(`Discount applied: ${formatPrice(result.discount_amount_cents)} off!`);
        setDiscountCode('');
      } else {
        toast.error(result.error_message || 'Invalid discount code');
      }
    } catch (error) {
      console.error('Error applying discount:', error);
      toast.error('Failed to apply discount code');
    }
  };

  const handleRemoveDiscount = () => {
    onDiscountApplied(null);
    toast.success('Discount code removed');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleApplyDiscount();
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4 text-gray-500" />
            <span className="font-medium text-sm">Discount Code</span>
          </div>

          {appliedDiscount ? (
            <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <div className="flex items-center gap-2">
                <Badge className="bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-400">
                  {appliedDiscount.code}
                </Badge>
                <span className="text-sm text-green-700 dark:text-green-400">
                  -{formatPrice(appliedDiscount.discountAmount)} saved
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRemoveDiscount}
                className="text-green-600 hover:text-green-700 h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Input
                placeholder="Enter discount code"
                value={discountCode}
                onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
                onKeyPress={handleKeyPress}
                className="flex-1"
                disabled={validateCode.isPending}
              />
              <Button
                onClick={handleApplyDiscount}
                disabled={validateCode.isPending || !discountCode.trim()}
                className="whitespace-nowrap"
              >
                {validateCode.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  'Apply'
                )}
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DiscountCodeInput;
