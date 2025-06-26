import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PaginationAdvanced } from '@/components/ui/pagination-advanced';
import { 
  Package, 
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  AlertTriangle,
} from 'lucide-react';
import { Link } from 'react-router-dom';
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

interface ProductsTableProps {
  currentTab: string;
  setCurrentTab: (value: string) => void;
  isLoadingProducts: boolean;
  filteredProducts: any[];
  totalProducts: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  handleStatusToggle: (productId: string, currentStatus: boolean) => void;
  handleDeleteProduct: (productId: string) => void;
}

const AdminProductsTable: React.FC<ProductsTableProps> = ({
  currentTab,
  setCurrentTab,
  isLoadingProducts,
  filteredProducts,
  totalProducts,
  totalPages,
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange,
  handleStatusToggle,
  handleDeleteProduct
}) => {
  return (
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
                    Get started by adding your first product
                  </p>
                  <Button asChild>
                    <Link to="/admin/products/new">Add Product</Link>
                  </Button>
                </div>
              ) : (
                <>
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
                  <PaginationAdvanced
                    currentPage={currentPage}
                    totalPages={totalPages}
                    pageSize={pageSize}
                    totalItems={totalProducts}
                    onPageChange={onPageChange}
                    onPageSizeChange={onPageSizeChange}
                    pageSizeOptions={[15, 20, 25, 50]}
                    showPageSizeSelector={true}
                    showItemCount={true}
                  />
                </>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </FadeInView>
  );
};

export default AdminProductsTable;
