import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Package, 
  Search, 
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  BarChart3,
  Minus,
  Plus,
  RefreshCw,
  Download
} from 'lucide-react';
import { useAdminProducts, useProductStats, useProductMutations } from '@/hooks/useAdminProducts';
import { useCategories } from '@/hooks/useProducts';
import { formatPrice } from '@/utils/currency';
import LoadingSpinner from '@/components/animations/LoadingSpinner';
import FadeInView from '@/components/animations/FadeInView';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

const AdminInventory: React.FC = () => {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [stockFilter, setStockFilter] = useState<string>('all');
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [newStock, setNewStock] = useState<number>(0);
  const [stockChangeReason, setStockChangeReason] = useState<string>('');

  const { data: categories = [] } = useCategories();
  const { data: productStats, isLoading: isLoadingStats } = useProductStats();
  
  const filters = {
    search: search || undefined,
    categoryId: categoryFilter || undefined,
    isOutOfStock: stockFilter === 'out-of-stock' ? true : undefined,
  };

  const { data: productsData, isLoading: isLoadingProducts } = useAdminProducts(filters);
  const { updateProduct } = useProductMutations();

  const products = productsData?.products || [];

  const handleStockUpdate = (productId: string, currentStock: number, newStockValue: number) => {
    updateProduct.mutate({
      id: productId,
      updates: { inventory_quantity: newStockValue }
    });
    setSelectedProduct(null);
    setNewStock(0);
    setStockChangeReason('');
  };

  const handleQuickStockChange = (productId: string, currentStock: number, change: number) => {
    const newStockValue = Math.max(0, currentStock + change);
    updateProduct.mutate({
      id: productId,
      updates: { inventory_quantity: newStockValue }
    });
  };

  const filteredProducts = products.filter(product => {
    if (!product.track_inventory) return false;
    
    switch (stockFilter) {
      case 'out-of-stock':
        return product.inventory_quantity <= 0;
      case 'low-stock':
        return product.inventory_quantity > 0 && product.inventory_quantity <= 5;
      case 'in-stock':
        return product.inventory_quantity > 5;
      default:
        return true;
    }
  });

  const stockSummary = {
    outOfStock: products.filter(p => p.track_inventory && p.inventory_quantity <= 0).length,
    lowStock: products.filter(p => p.track_inventory && p.inventory_quantity > 0 && p.inventory_quantity <= 5).length,
    inStock: products.filter(p => p.track_inventory && p.inventory_quantity > 5).length,
    totalValue: products.reduce((total, p) => total + (p.price_cents * p.inventory_quantity), 0),
  };

  return (
    <div className="space-y-6">
      <FadeInView direction="up">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-nature-forest dark:text-white">
              Inventory Management
            </h1>
            <p className="text-nature-bark dark:text-gray-300 mt-2">
              Track stock levels, manage inventory, and monitor low stock alerts
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>
      </FadeInView>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <FadeInView direction="up" delay={0.1}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                {stockSummary.outOfStock}
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Products need restocking
              </p>
            </CardContent>
          </Card>
        </FadeInView>

        <FadeInView direction="up" delay={0.2}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
              <TrendingDown className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {stockSummary.lowStock}
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Products running low
              </p>
            </CardContent>
          </Card>
        </FadeInView>

        <FadeInView direction="up" delay={0.3}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Stock</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {stockSummary.inStock}
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Products well stocked
              </p>
            </CardContent>
          </Card>
        </FadeInView>

        <FadeInView direction="up" delay={0.4}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Value</CardTitle>
              <BarChart3 className="h-4 w-4 text-nature-forest" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-nature-forest dark:text-white">
                {formatPrice(stockSummary.totalValue)}
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Total inventory value
              </p>
            </CardContent>
          </Card>
        </FadeInView>
      </div>

      {/* Filters */}
      <FadeInView direction="up" delay={0.5}>
        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
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

              <Select value={stockFilter} onValueChange={setStockFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Stock Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Products</SelectItem>
                  <SelectItem value="out-of-stock">Out of Stock</SelectItem>
                  <SelectItem value="low-stock">Low Stock (≤5)</SelectItem>
                  <SelectItem value="in-stock">In Stock (>5)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </FadeInView>

      {/* Inventory Table */}
      <FadeInView direction="up" delay={0.6}>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Inventory Levels</CardTitle>
                <CardDescription>
                  {filteredProducts.length} products with inventory tracking
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoadingProducts ? (
              <div className="flex justify-center py-8">
                <LoadingSpinner size="lg" />
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold mb-2">No inventory found</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {search || categoryFilter || stockFilter !== 'all'
                    ? 'Try adjusting your filters'
                    : 'No products have inventory tracking enabled'
                  }
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Current Stock</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product) => {
                    const primaryImage = product.images?.find(img => img.is_primary) || product.images?.[0];
                    const isOutOfStock = product.inventory_quantity <= 0;
                    const isLowStock = product.inventory_quantity > 0 && product.inventory_quantity <= 5;
                    const stockValue = product.price_cents * product.inventory_quantity;

                    return (
                      <TableRow key={product.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-md overflow-hidden bg-gray-100 dark:bg-gray-800">
                              {primaryImage ? (
                                <img
                                  src={primaryImage.image_url}
                                  alt={product.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Package className="h-4 w-4 text-gray-400" />
                                </div>
                              )}
                            </div>
                            <div>
                              <p className="font-medium">{product.name}</p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                SKU: {product.sku || 'N/A'}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {product.category?.name || 'Uncategorized'}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <span className={`text-2xl font-bold ${
                              isOutOfStock ? 'text-red-600' : 
                              isLowStock ? 'text-yellow-600' : 
                              'text-green-600'
                            }`}>
                              {product.inventory_quantity}
                            </span>
                            <div className="flex items-center space-x-1">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleQuickStockChange(product.id, product.inventory_quantity, -1)}
                                disabled={product.inventory_quantity <= 0}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleQuickStockChange(product.id, product.inventory_quantity, 1)}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={
                            isOutOfStock ? 'destructive' : 
                            isLowStock ? 'secondary' : 
                            'default'
                          }>
                            {isOutOfStock ? 'Out of Stock' : 
                             isLowStock ? 'Low Stock' : 
                             'In Stock'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{formatPrice(stockValue)}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              @ {formatPrice(product.price_cents)} each
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => {
                                  setSelectedProduct(product);
                                  setNewStock(product.inventory_quantity);
                                }}
                              >
                                Adjust Stock
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Adjust Stock Level</DialogTitle>
                                <DialogDescription>
                                  Update the inventory quantity for {selectedProduct?.name}
                                </DialogDescription>
                              </DialogHeader>
                              
                              <div className="space-y-4">
                                <div>
                                  <Label htmlFor="current-stock">Current Stock</Label>
                                  <Input
                                    id="current-stock"
                                    value={selectedProduct?.inventory_quantity || 0}
                                    disabled
                                  />
                                </div>
                                
                                <div>
                                  <Label htmlFor="new-stock">New Stock Level</Label>
                                  <Input
                                    id="new-stock"
                                    type="number"
                                    min="0"
                                    value={newStock}
                                    onChange={(e) => setNewStock(parseInt(e.target.value) || 0)}
                                  />
                                </div>
                                
                                <div>
                                  <Label htmlFor="reason">Reason (Optional)</Label>
                                  <Input
                                    id="reason"
                                    placeholder="e.g., Inventory count, damaged goods, etc."
                                    value={stockChangeReason}
                                    onChange={(e) => setStockChangeReason(e.target.value)}
                                  />
                                </div>
                              </div>

                              <DialogFooter>
                                <Button variant="outline" onClick={() => setSelectedProduct(null)}>
                                  Cancel
                                </Button>
                                <Button 
                                  onClick={() => handleStockUpdate(
                                    selectedProduct.id, 
                                    selectedProduct.inventory_quantity, 
                                    newStock
                                  )}
                                >
                                  Update Stock
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </FadeInView>
    </div>
  );
};

export default AdminInventory;