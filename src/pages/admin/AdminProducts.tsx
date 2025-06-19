
import React, { useState } from 'react';
import { useAdminProducts, useProductStats, useProductMutations } from '@/hooks/useAdminProducts';
import { useAdminProductsRealtime } from '@/hooks/useAdminProductsRealtime';
import { useCategories } from '@/hooks/useProducts';
import AdminProductsHeader from './components/AdminProductsHeader';
import AdminProductsStats from './components/AdminProductsStats';
import AdminProductsFilters from './components/AdminProductsFilters';
import AdminProductsTable from './components/AdminProductsTable';

const AdminProducts: React.FC = () => {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [stockFilter, setStockFilter] = useState<string>('all');
  const [currentTab, setCurrentTab] = useState('all');

  // Enable real-time updates
  useAdminProductsRealtime();

  const { data: categories = [] } = useCategories();
  const { data: productStats, isLoading: isLoadingStats } = useProductStats();
  
  const filters = {
    search: search || undefined,
    categoryId: categoryFilter !== 'all' ? categoryFilter : undefined,
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

  const featuredCount = products.filter(p => p.is_featured).length;

  return (
    <div className="space-y-6">
      <AdminProductsHeader />
      
      <AdminProductsStats 
        isLoadingStats={isLoadingStats}
        productStats={productStats}
        featuredCount={featuredCount}
      />

      <AdminProductsFilters
        search={search}
        setSearch={setSearch}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        stockFilter={stockFilter}
        setStockFilter={setStockFilter}
        categories={categories}
      />

      <AdminProductsTable
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        isLoadingProducts={isLoadingProducts}
        filteredProducts={filteredProducts}
        totalProducts={totalProducts}
        handleStatusToggle={handleStatusToggle}
        handleDeleteProduct={handleDeleteProduct}
      />
    </div>
  );
};

export default AdminProducts;
