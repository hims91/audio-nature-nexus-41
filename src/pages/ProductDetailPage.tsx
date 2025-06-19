
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ShoppingCart, ArrowLeft, Star, Truck, Shield, RefreshCw } from 'lucide-react';
import { useProduct } from '@/hooks/useProducts';
import { useCart } from '@/hooks/useCart';
import { formatPrice } from '@/utils/currency';
import LoadingSpinner from '@/components/animations/LoadingSpinner';
import { toast } from 'sonner';
import SocialMeta from '@/components/SEO/SocialMeta';
import ProductSchema from '@/components/SEO/ProductSchema';
import OptimizedImage from '@/components/performance/OptimizedImage';
import ProductReviews from '@/components/shop/ProductReviews';
import UnifiedNavbar from '@/components/UnifiedNavbar';
import Footer from '@/components/Footer';

const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: product, isLoading, error } = useProduct(slug!);
  const { addToCart, isAddingToCart } = useCart();
  const [selectedVariant, setSelectedVariant] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  if (isLoading) {
    return (
      <>
        <UnifiedNavbar />
        <div className="min-h-screen flex items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
        <Footer />
      </>
    );
  }

  if (error || !product) {
    return (
      <>
        <UnifiedNavbar />
        <div className="min-h-screen flex flex-col items-center justify-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">The product you're looking for doesn't exist.</p>
          <Button asChild>
            <Link to="/shop">Back to Shop</Link>
          </Button>
        </div>
        <Footer />
      </>
    );
  }

  const images = product.images || [];
  const primaryImage = images.find(img => img.is_primary) || images[0];
  const variants = product.variants || [];
  const selectedVariantData = variants.find(v => v.id === selectedVariant);
  
  const currentPrice = selectedVariantData?.price_cents || product.price_cents;
  const hasDiscount = product.compare_at_price_cents && product.compare_at_price_cents > currentPrice;
  const discountPercentage = hasDiscount 
    ? Math.round(((product.compare_at_price_cents! - currentPrice) / product.compare_at_price_cents!) * 100)
    : 0;

  const isOutOfStock = product.track_inventory && 
    (selectedVariantData ? selectedVariantData.inventory_quantity <= 0 : product.inventory_quantity <= 0) && 
    !product.allow_backorders;

  const handleAddToCart = () => {
    if (variants.length > 0 && !selectedVariant) {
      toast.error('Please select a variant');
      return;
    }

    addToCart({
      productId: product.id,
      variantId: selectedVariant || undefined,
      quantity,
    });
  };

  return (
    <>
      <Helmet>
        <title>{product.name} - Terra Echo Studios</title>
        <meta name="description" content={product.short_description || product.description || `${product.name} - Premium merchandise from Terra Echo Studios`} />
      </Helmet>
      
      <SocialMeta
        title={product.name}
        description={product.short_description || product.description || `${product.name} - Premium merchandise from Terra Echo Studios`}
        image={primaryImage?.image_url}
        type="product"
      />
      
      <ProductSchema product={product} />
      <UnifiedNavbar />

      <div className="min-h-screen bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-8">
            <Link to="/shop" className="hover:text-nature-forest transition-colors">Shop</Link>
            <span>/</span>
            {product.category && (
              <>
                <span>{product.category.name}</span>
                <span>/</span>
              </>
            )}
            <span className="text-gray-900 dark:text-white">{product.name}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="aspect-square overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
                {images.length > 0 ? (
                  <OptimizedImage
                    src={images[selectedImage]?.image_url || primaryImage?.image_url}
                    alt={images[selectedImage]?.alt_text || product.name}
                    className="w-full h-full object-cover"
                    priority={true}
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No Image Available
                  </div>
                )}
              </div>
              
              {/* Image Thumbnails */}
              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {images.map((image, index) => (
                    <button
                      key={image.id}
                      onClick={() => setSelectedImage(index)}
                      className={`aspect-square overflow-hidden rounded border-2 transition-all ${
                        selectedImage === index
                          ? 'border-nature-forest'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                    >
                      <OptimizedImage
                        src={image.image_url}
                        alt={image.alt_text || `${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                        sizes="(max-width: 768px) 25vw, 12.5vw"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  {product.is_featured && (
                    <Badge className="bg-yellow-500 text-white">
                      <Star className="w-3 h-3 mr-1" />
                      Featured
                    </Badge>
                  )}
                  {product.category && (
                    <Badge variant="outline">{product.category.name}</Badge>
                  )}
                </div>
                
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  {product.name}
                </h1>

                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl font-bold text-nature-forest">
                    {formatPrice(currentPrice)}
                  </span>
                  {hasDiscount && (
                    <>
                      <span className="text-xl text-gray-500 line-through">
                        {formatPrice(product.compare_at_price_cents!)}
                      </span>
                      <Badge variant="destructive">
                        -{discountPercentage}%
                      </Badge>
                    </>
                  )}
                </div>

                {isOutOfStock && (
                  <Badge variant="secondary" className="mb-4">
                    Out of Stock
                  </Badge>
                )}
              </div>

              {/* Product Description */}
              {product.description && (
                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {product.description}
                  </p>
                </div>
              )}

              {/* Variants */}
              {variants.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Options</h3>
                  <Select value={selectedVariant} onValueChange={setSelectedVariant}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select an option" />
                    </SelectTrigger>
                    <SelectContent>
                      {variants.map((variant) => (
                        <SelectItem key={variant.id} value={variant.id}>
                          {variant.name} 
                          {variant.price_cents && variant.price_cents !== product.price_cents && (
                            <span className="ml-2 font-semibold">
                              {formatPrice(variant.price_cents)}
                            </span>
                          )}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Quantity */}
              <div>
                <h3 className="font-semibold mb-2">Quantity</h3>
                <Select value={quantity.toString()} onValueChange={(value) => setQuantity(parseInt(value))}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Add to Cart */}
              <div className="space-y-4">
                <Button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock || isAddingToCart}
                  className="w-full bg-nature-forest hover:bg-nature-leaf text-white py-3 text-lg"
                  size="lg"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                </Button>

                <Button asChild variant="outline" className="w-full" size="lg">
                  <Link to="/shop">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Continue Shopping
                  </Link>
                </Button>
              </div>

              {/* Product Features */}
              <div className="grid grid-cols-1 gap-4 pt-6 border-t">
                <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                  <Truck className="w-5 h-5 text-nature-forest" />
                  <span>Free shipping on orders over $50</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                  <Shield className="w-5 h-5 text-nature-forest" />
                  <span>30-day return policy</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                  <RefreshCw className="w-5 h-5 text-nature-forest" />
                  <span>Secure & encrypted checkout</span>
                </div>
              </div>

              {/* SKU */}
              {product.sku && (
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  SKU: {product.sku}
                </div>
              )}
            </div>
          </div>

          {/* Product Reviews Section */}
          <div className="mt-12">
            <ProductReviews productId={product.id} />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProductDetailPage;
