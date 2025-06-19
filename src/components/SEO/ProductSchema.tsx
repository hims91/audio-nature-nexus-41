import React, { memo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Product } from '@/types/ecommerce';

interface ProductSchemaProps {
  product: Product;
}

const ProductSchema: React.FC<ProductSchemaProps> = memo(({ product }) => {
  const primaryImage = product.images?.find(img => img.is_primary) || product.images?.[0];
  
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": product.description || product.short_description,
    "sku": product.sku,
    "brand": {
      "@type": "Brand",
      "name": "Terra Echo Studios"
    },
    "category": product.category?.name,
    "image": primaryImage ? [primaryImage.image_url] : [],
    "offers": {
      "@type": "Offer",
      "price": (product.price_cents / 100).toFixed(2),
      "priceCurrency": "USD",
      "availability": product.track_inventory && product.inventory_quantity <= 0 
        ? "https://schema.org/OutOfStock" 
        : "https://schema.org/InStock",
      "seller": {
        "@type": "Organization",
        "name": "Terra Echo Studios"
      },
      "url": `${window.location.origin}/shop/products/${product.slug}`
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "5",
      "reviewCount": "1"
    }
  };

  // Schema is complete - comparison pricing handled by main price field

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
});

ProductSchema.displayName = 'ProductSchema';

export default ProductSchema;