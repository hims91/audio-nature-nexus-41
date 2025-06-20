
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { Link } from 'react-router-dom';

const CartIcon: React.FC = () => {
  const { cartItemCount } = useCart();

  return (
    <Button variant="ghost" size="sm" asChild className="relative">
      <Link to="/cart">
        <ShoppingCart className="h-5 w-5" />
        {cartItemCount > 0 && (
          <Badge 
            variant="destructive" 
            className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
          >
            {cartItemCount > 99 ? '99+' : cartItemCount}
          </Badge>
        )}
      </Link>
    </Button>
  );
};

export default CartIcon;
