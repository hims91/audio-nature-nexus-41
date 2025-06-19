
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Star } from 'lucide-react';
import { Product } from '@/types/ecommerce';
import { formatPrice } from '@/utils/currency';
import { useCart } from '@/hooks/useCart';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, isAddingToCart } = useCart();
  
  const primaryImage = product.images?.find(img => img.is_primary) || product.images?.[0];
  const hasDiscount = product.compare_at_price_cents && product.compare_at_price_cents > product.price_cents;
  const discountPercentage = hasDiscount 
    ? Math.round(((product.compare_at_price_cents! - product.price_cents) / product.compare_at_price_cents!) * 100)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({ productId: product.id });
  };

  const isOutOfStock = product.track_inventory && product.inventory_quantity <= 0 && !product.allow_backorders;

  return (
    <Card className="group hover:shadow-lg transition-shadow duration-300 relative overflow-hidden">
      <Link to={`/shop/products/${product.slug}`}>
        <div className="relative aspect-square overflow-hidden">
          {primaryImage ? (
            <img
              src={primaryImage.image_url}
              alt={primaryImage.alt_text || product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              <span className="text-gray-400">No Image</span>
            </div>
          )}
          
          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product.is_featured && (
              <Badge className="bg-yellow-500 text-white">
                <Star className="w-3 h-3 mr-1" />
                Featured
              </Badge>
            )}
            {hasDiscount && (
              <Badge variant="destructive">
                -{discountPercentage}%
              </Badge>
            )}
            {isOutOfStock && (
              <Badge variant="secondary">
                Out of Stock
              </Badge>
            )}
          </div>
        </div>

        <CardContent className="p-4">
          <div className="space-y-2">
            <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-nature-forest transition-colors">
              {product.name}
            </h3>
            
            {product.short_description && (
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                {product.short_description}
              </p>
            )}

            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-nature-forest">
                {formatPrice(product.price_cents)}
              </span>
              {hasDiscount && (
                <span className="text-sm text-gray-500 line-through">
                  {formatPrice(product.compare_at_price_cents!)}
                </span>
              )}
            </div>

            {product.category && (
              <Badge variant="outline" className="text-xs">
                {product.category.name}
              </Badge>
            )}
          </div>
        </CardContent>
      </Link>

      <CardFooter className="p-4 pt-0">
        <Button
          onClick={handleAddToCart}
          disabled={isOutOfStock || isAddingToCart}
          className="w-full bg-nature-forest hover:bg-nature-leaf text-white"
          size="sm"
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
