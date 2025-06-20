
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, Star, DollarSign, AlertTriangle } from 'lucide-react';
import FadeInView from '@/components/animations/FadeInView';

interface AdminProductsStatsProps {
  isLoadingStats: boolean;
  productStats?: {
    totalProducts: number;
    totalCategories: number;
    lowStockCount: number;
  };
  featuredCount: number;
}

const AdminProductsStats: React.FC<AdminProductsStatsProps> = ({
  isLoadingStats,
  productStats,
  featuredCount
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <FadeInView direction="up" delay={0.1}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-nature-forest" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-nature-forest dark:text-white">
              {isLoadingStats ? '...' : productStats?.totalProducts || 0}
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Products in catalog
            </p>
          </CardContent>
        </Card>
      </FadeInView>

      <FadeInView direction="up" delay={0.2}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Featured Products</CardTitle>
            <Star className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
              {featuredCount}
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Featured in homepage
            </p>
          </CardContent>
        </Card>
      </FadeInView>

      <FadeInView direction="up" delay={0.3}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <DollarSign className="h-4 w-4 text-nature-forest" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-nature-forest dark:text-white">
              {isLoadingStats ? '...' : productStats?.totalCategories || 0}
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Product categories
            </p>
          </CardContent>
        </Card>
      </FadeInView>

      <FadeInView direction="up" delay={0.4}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
              {isLoadingStats ? '...' : productStats?.lowStockCount || 0}
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Items need restocking
            </p>
          </CardContent>
        </Card>
      </FadeInView>
    </div>
  );
};

export default AdminProductsStats;
