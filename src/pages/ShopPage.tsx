
import React, { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, Grid, List } from 'lucide-react';
import ProductCard from '@/components/shop/ProductCard';
import { useProducts, useCategories } from '@/hooks/useProducts';
import LoadingSpinner from '@/components/animations/LoadingSpinner';
import UnifiedNavbar from '@/components/UnifiedNavbar';
import Footer from '@/components/Footer';
import { usePerformanceOptimization } from '@/hooks/usePerformanceOptimization';
import { BrandHeading, BrandText } from '@/components/enhanced/BrandConsistencyManager';
import BrandCard from '@/components/enhanced/BrandCard';

const ShopPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Performance optimization hook
  const { debounce } = usePerformanceOptimization('ShopPage');

  const { data: categories = [] } = useCategories();
  const { data: products = [], isLoading } = useProducts({
    categoryId: selectedCategory || undefined,
    search: search || undefined,
  });

  // Memoize sorted products for performance
  const sortedProducts = useMemo(() => {
    return [...products].sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price_cents - b.price_cents;
        case 'price-high':
          return b.price_cents - a.price_cents;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'newest':
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });
  }, [products, sortBy]);

  // Debounced search to improve performance
  const debouncedSetSearch = useMemo(
    () => debounce((value: string) => setSearch(value), 300),
    [debounce]
  );

  const handleCategoryFilter = (categoryId: string) => {
    setSelectedCategory(categoryId === selectedCategory ? '' : categoryId);
  };

  return (
    <>
      <Helmet>
        <title>Shop - Terra Echo Studios | Premium Audio Merchandise</title>
        <meta name="description" content="Shop premium Terra Echo Studios merchandise including t-shirts, hoodies, stickers, and exclusive audio gear." />
        <meta name="keywords" content="terra echo studios, merchandise, t-shirts, hoodies, stickers, audio gear, music apparel" />
      </Helmet>

      <UnifiedNavbar />
      
      <div className="min-h-screen bg-white dark:bg-gray-900 pt-20">
        {/* Hero Section - Updated with brand colors */}
        <div className="bg-gradient-to-r from-nature-forest to-nature-leaf dark:from-nature-bark dark:to-nature-forest text-white py-16">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <BrandHeading level={1} className="text-white mb-4">
                Terra Echo Shop
              </BrandHeading>
              <BrandText className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto text-nature-cream">
                Premium merchandise and exclusive audio gear from Terra Echo Studios
              </BrandText>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Filters and Search */}
          <BrandCard className="mb-8">
            <div className="p-6">
              <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                {/* Search */}
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-nature-stone h-4 w-4" />
                  <Input
                    placeholder="Search products..."
                    onChange={(e) => debouncedSetSearch(e.target.value)}
                    className="pl-10 border-nature-mist dark:border-nature-forest bg-white dark:bg-nature-bark/50"
                  />
                </div>

                {/* Sort and View */}
                <div className="flex items-center gap-4">
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-40 border-nature-mist dark:border-nature-forest">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                      <SelectItem value="name">Name A-Z</SelectItem>
                    </SelectContent>
                  </Select>

                  <div className="flex border border-nature-mist dark:border-nature-forest rounded-md">
                    <Button
                      variant={viewMode === 'grid' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('grid')}
                      className="rounded-r-none bg-nature-forest hover:bg-nature-leaf dark:bg-nature-leaf dark:hover:bg-nature-forest"
                    >
                      <Grid className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('list')}
                      className="rounded-l-none bg-nature-forest hover:bg-nature-leaf dark:bg-nature-leaf dark:hover:bg-nature-forest"
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Category Filters */}
              {categories.length > 0 && (
                <div className="mt-4 pt-4 border-t border-nature-mist dark:border-nature-forest">
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant={selectedCategory === '' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedCategory('')}
                      className="bg-nature-forest hover:bg-nature-leaf border-nature-forest dark:bg-nature-leaf dark:hover:bg-nature-forest dark:border-nature-leaf"
                    >
                      All Categories
                    </Button>
                    {categories.map((category) => (
                      <Button
                        key={category.id}
                        variant={selectedCategory === category.id ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handleCategoryFilter(category.id)}
                        className="bg-nature-forest hover:bg-nature-leaf border-nature-forest dark:bg-nature-leaf dark:hover:bg-nature-forest dark:border-nature-leaf"
                      >
                        {category.name}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </BrandCard>

          {/* Products */}
          {isLoading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner />
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-6">
                <BrandHeading level={2}>
                  {selectedCategory ? categories.find(c => c.id === selectedCategory)?.name : 'All Products'}
                </BrandHeading>
                <BrandText variant="muted" className="text-sm">
                  {sortedProducts.length} {sortedProducts.length === 1 ? 'product' : 'products'}
                </BrandText>
              </div>

              {sortedProducts.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🛍️</div>
                  <BrandHeading level={3} className="mb-2">No products found</BrandHeading>
                  <BrandText variant="muted">
                    {search ? 'Try adjusting your search terms' : 'Products will be available soon!'}
                  </BrandText>
                </div>
              ) : (
                <div className={
                  viewMode === 'grid' 
                    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                    : 'space-y-4'
                }>
                  {sortedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
      
      <Footer />
    </>
  );
};

export default ShopPage;
