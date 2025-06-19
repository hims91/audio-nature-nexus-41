
import React, { useState, useEffect, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Search, Filter, X, ChevronDown, Star, SlidersHorizontal } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Product, ProductCategory } from '@/types/ecommerce';
import { formatPrice } from '@/utils/currency';

interface ProductSearchProps {
  onFiltersChange: (filters: ProductFilters) => void;
}

export interface ProductFilters {
  search: string;
  categoryId?: string;
  priceRange: [number, number];
  sortBy: 'name' | 'price_asc' | 'price_desc' | 'rating' | 'newest';
  inStock: boolean;
  featured?: boolean;
  minRating?: number;
}

const ProductSearch: React.FC<ProductSearchProps> = ({ onFiltersChange }) => {
  const [filters, setFilters] = useState<ProductFilters>({
    search: '',
    priceRange: [0, 500],
    sortBy: 'name',
    inStock: false,
  });

  const [showAdvanced, setShowAdvanced] = useState(false);

  // Fetch categories for filter options
  const { data: categories = [] } = useQuery({
    queryKey: ['product-categories'],
    queryFn: async (): Promise<ProductCategory[]> => {
      const { data, error } = await supabase
        .from('product_categories')
        .select('*')
        .eq('is_active', true)
        .order('sort_order');

      if (error) throw error;
      return data || [];
    },
  });

  // Get price range from actual products
  const { data: priceRange } = useQuery({
    queryKey: ['product-price-range'],
    queryFn: async (): Promise<[number, number]> => {
      const { data, error } = await supabase
        .from('products')
        .select('price_cents')
        .eq('is_active', true);

      if (error) throw error;
      
      if (!data || data.length === 0) return [0, 500];
      
      const prices = data.map(p => p.price_cents / 100);
      const min = Math.floor(Math.min(...prices));
      const max = Math.ceil(Math.max(...prices));
      
      return [min, max];
    },
  });

  // Update price range when data loads
  useEffect(() => {
    if (priceRange) {
      setFilters(prev => ({
        ...prev,
        priceRange: [priceRange[0], priceRange[1]]
      }));
    }
  }, [priceRange]);

  // Notify parent component of filter changes
  useEffect(() => {
    onFiltersChange(filters);
  }, [filters, onFiltersChange]);

  const handleFilterChange = (key: keyof ProductFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      priceRange: priceRange || [0, 500],
      sortBy: 'name',
      inStock: false,
    });
  };

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.search) count++;
    if (filters.categoryId) count++;
    if (filters.priceRange[0] !== (priceRange?.[0] || 0) || 
        filters.priceRange[1] !== (priceRange?.[1] || 500)) count++;
    if (filters.inStock) count++;
    if (filters.featured) count++;
    if (filters.minRating) count++;
    return count;
  }, [filters, priceRange]);

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search & Filter
            {activeFiltersCount > 0 && (
              <Badge variant="secondary">{activeFiltersCount} active</Badge>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-2"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Advanced
            <ChevronDown className={`h-4 w-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Basic Search */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search products..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filters.sortBy} onValueChange={(value) => handleFilterChange('sortBy', value)}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name A-Z</SelectItem>
              <SelectItem value="price_asc">Price: Low to High</SelectItem>
              <SelectItem value="price_desc">Price: High to Low</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
              <SelectItem value="newest">Newest First</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Advanced Filters */}
        <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
          <CollapsibleContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Category Filter */}
              <div>
                <label className="text-sm font-medium mb-2 block">Category</label>
                <Select value={filters.categoryId || ''} onValueChange={(value) => handleFilterChange('categoryId', value || undefined)}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Price Range */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Price Range: {formatPrice(filters.priceRange[0] * 100)} - {formatPrice(filters.priceRange[1] * 100)}
                </label>
                <Slider
                  min={priceRange?.[0] || 0}
                  max={priceRange?.[1] || 500}
                  step={5}
                  value={filters.priceRange}
                  onValueChange={(value) => handleFilterChange('priceRange', value)}
                  className="mt-2"
                />
              </div>

              {/* Rating Filter */}
              <div>
                <label className="text-sm font-medium mb-2 block">Minimum Rating</label>
                <Select value={filters.minRating?.toString() || ''} onValueChange={(value) => handleFilterChange('minRating', value ? parseInt(value) : undefined)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Any Rating" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any Rating</SelectItem>
                    {[5, 4, 3, 2, 1].map((rating) => (
                      <SelectItem key={rating} value={rating.toString()}>
                        <div className="flex items-center gap-1">
                          {rating}
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          & up
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Quick Filters */}
            <div className="flex flex-wrap gap-2">
              <Button
                variant={filters.inStock ? "default" : "outline"}
                size="sm"
                onClick={() => handleFilterChange('inStock', !filters.inStock)}
              >
                In Stock Only
              </Button>
              <Button
                variant={filters.featured ? "default" : "outline"}
                size="sm"
                onClick={() => handleFilterChange('featured', !filters.featured)}
              >
                Featured Products
              </Button>
            </div>

            {/* Clear Filters */}
            {activeFiltersCount > 0 && (
              <div className="flex justify-end">
                <Button variant="outline" size="sm" onClick={clearFilters}>
                  <X className="h-4 w-4 mr-1" />
                  Clear All Filters
                </Button>
              </div>
            )}
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
};

export default ProductSearch;
