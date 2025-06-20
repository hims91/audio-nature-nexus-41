
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useProducts } from '@/hooks/useProducts';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { formatPrice } from '@/utils/currency';

const RecommendedProducts: React.FC = () => {
  const { data: products, isLoading } = useProducts();
  const recommendedProducts = products?.slice(0, 3) || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recommended for You</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-16 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-1"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : recommendedProducts.length > 0 ? (
          <div className="space-y-4">
            {recommendedProducts.map((product) => (
              <div key={product.id} className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gray-200 rounded-lg flex-shrink-0">
                  {product.images?.[0] && (
                    <img 
                      src={product.images[0].image_url} 
                      alt={product.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{product.name}</p>
                  <p className="text-sm text-gray-600">{formatPrice(product.price_cents)}</p>
                </div>
              </div>
            ))}
            <Button asChild variant="outline" className="w-full">
              <Link to="/shop">View All Products</Link>
            </Button>
          </div>
        ) : (
          <div className="text-center py-4 text-gray-500">
            <p className="text-sm">No recommendations available</p>
            <Button asChild variant="outline" className="mt-2">
              <Link to="/shop">Browse Products</Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecommendedProducts;
