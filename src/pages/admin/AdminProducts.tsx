import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Package, 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  AlertTriangle,
  TrendingUp,
  DollarSign
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAdminProducts, useProductStats, useProductMutations } from '@/hooks/useAdminProducts';
import { useCategories } from '@/hooks/useProducts';
import { formatPrice } from '@/utils/currency';
import LoadingSpinner from '@/components/animations/LoadingSpinner';
import FadeInView from '@/components/animations/FadeInView';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const AdminProducts: React.FC = () => {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [stockFilter, setStockFilter] = useState<string>('');
  const [currentTab, setCurrentTab] = useState('all');

  const { data: categories = [] } = useCategories();
  const { data: productStats, isLoading: isLoadingStats } = useProductStats();
  
  const filters = {
    search: search || undefined,
    categoryId: categoryFilter || undefined,
    isActive: statusFilter === 'active' ? true : statusFilter === 'inactive' ? false : undefined,
    isOutOfStock: stockFilter === 'out-of-stock' ? true : undefined,
  };

  const { data: productsData, isLoading: isLoadingProducts } = useAdminProducts(filters);
  const { updateProduct, deleteProduct } = useProductMutations();

  const products = productsData?.products || [];
  const totalProducts = productsData?.total || 0;

  const handleStatusToggle = (productId: string, currentStatus: boolean) => {
    updateProduct.mutate({
      id: productId,
      updates: { is_active: !currentStatus }
    });
  };

  const handleDeleteProduct = (productId: string) => {
    if (confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      deleteProduct.mutate(productId);
    }
  };

  const filteredProducts = products.filter(product => {
    if (currentTab === 'active') return product.is_active;
    if (currentTab === 'inactive') return !product.is_active;
    if (currentTab === 'low-stock') {
      return product.track_inventory && product.inventory_quantity <= 5;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <FadeInView direction="up">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-nature-forest dark:text-white">
              Product Management
            </h1>
            <p className="text-nature-bark dark:text-gray-300 mt-2">
              Manage your product catalog, inventory, and pricing
            </p>
          </div>
          <Button asChild className="bg-nature-forest hover:bg-nature-leaf">
            <Link to="/admin/products/new">
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Link>
          </Button>
        </div>
      </FadeInView>

      {/* Stats Cards */}
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
                Active products in catalog
              </p>
            </CardContent>
          </Card>
        </FadeInView>

        <FadeInView direction="up" delay={0.2}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Categories</CardTitle>
              <Filter className="h-4 w-4 text-nature-forest" />
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

        <FadeInView direction="up" delay={0.3}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {isLoadingStats ? '...' : productStats?.lowStockCount || 0}
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Products need restocking
              </p>
            </CardContent>
          </Card>
        </FadeInView>

        <FadeInView direction="up" delay={0.4}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Featured</CardTitle>
              <TrendingUp className="h-4 w-4 text-nature-forest" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-nature-forest dark:text-white">
                {products.filter(p => p.is_featured).length}
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Featured products
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>

              <Select value={stockFilter} onValueChange={setStockFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Stock" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Stock</SelectItem>
                  <SelectItem value="out-of-stock">Out of Stock</SelectItem>
                  <SelectItem value="low-stock">Low Stock</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </FadeInView>

      {/* Products Table */}
      <FadeInView direction="up" delay={0.6}>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Products</CardTitle>
                <CardDescription>
                  {totalProducts} total products
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs value={currentTab} onValueChange={setCurrentTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="all">All Products</TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="inactive">Inactive</TabsTrigger>
                <TabsTrigger value="low-stock">Low Stock</TabsTrigger>
              </TabsList>

              <TabsContent value={currentTab} className="space-y-4">
                {isLoadingProducts ? (
                  <div className="flex justify-center py-8">
                    <LoadingSpinner size="lg" />
                  </div>
                ) : filteredProducts.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No products found</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      {search || categoryFilter || statusFilter || stockFilter
                        ? 'Try adjusting your filters'
                        : 'Get started by adding your first product'
                      }
                    </p>
                    <Button asChild>
                      <Link to="/admin/products/new">Add Product</Link>
                    </Button>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Stock</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredProducts.map((product) => {
                        const primaryImage = product.images?.find(img => img.is_primary) || product.images?.[0];
                        const isLowStock = product.track_inventory && product.inventory_quantity <= 5;
                        const isOutOfStock = product.track_inventory && product.inventory_quantity <= 0;

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
                              <div className="space-y-1">
                                <p className="font-medium">{formatPrice(product.price_cents)}</p>
                                {product.compare_at_price_cents && (
                                  <p className="text-sm text-gray-500 line-through">
                                    {formatPrice(product.compare_at_price_cents)}
                                  </p>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              {product.track_inventory ? (
                                <div className="flex items-center space-x-2">
                                  <span className={`font-medium ${
                                    isOutOfStock ? 'text-red-600' : 
                                    isLowStock ? 'text-yellow-600' : 
                                    'text-green-600'
                                  }`}>
                                    {product.inventory_quantity}
                                  </span>
                                  {isLowStock && (
                                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                                  )}
                                </div>
                              ) : (
                                <span className="text-gray-500">Not tracked</span>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <Badge variant={product.is_active ? 'default' : 'secondary'}>
                                  {product.is_active ? 'Active' : 'Inactive'}
                                </Badge>
                                {product.is_featured && (
                                  <Badge variant="outline">Featured</Badge>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem asChild>
                                    <Link to={`/shop/products/${product.slug}`}>
                                      <Eye className="h-4 w-4 mr-2" />
                                      View
                                    </Link>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem asChild>
                                    <Link to={`/admin/products/${product.id}/edit`}>
                                      <Edit className="h-4 w-4 mr-2" />
                                      Edit
                                    </Link>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => handleStatusToggle(product.id, product.is_active)}
                                  >
                                    {product.is_active ? 'Deactivate' : 'Activate'}
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => handleDeleteProduct(product.id)}
                                    className="text-red-600"
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </FadeInView>
    </div>
  );
};

export default AdminProducts;