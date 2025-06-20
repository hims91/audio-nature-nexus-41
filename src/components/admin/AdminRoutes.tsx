
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import AdminProducts from '@/pages/admin/AdminProducts';
import AdminProductForm from '@/pages/admin/components/AdminProductForm';
import AdminCategories from '@/pages/admin/AdminCategories';
import AdminInventory from '@/pages/admin/AdminInventory';
import AdminOrders from '@/pages/admin/AdminOrders';
import AdminOrderDetail from '@/pages/admin/AdminOrderDetail';
import AdminSettings from '@/pages/admin/AdminSettings';
import AdminPortfolio from '@/pages/admin/AdminPortfolio';
import AdminUsers from '@/pages/admin/AdminUsers';
import AdminContactManager from '@/components/admin/AdminContactManager';
import AdminUserManagement from '@/components/admin/AdminUserManagement';
import AdminAnalyticsCharts from '@/components/admin/AdminAnalyticsCharts';

const AdminRoutes: React.FC = () => {
  return (
    <Routes>
      <Route index element={<AdminDashboard />} />
      <Route path="dashboard" element={<AdminDashboard />} />
      <Route path="portfolio" element={<AdminPortfolio />} />
      <Route path="products" element={<AdminProducts />} />
      <Route path="products/new" element={<AdminProductForm />} />
      <Route path="products/:id/edit" element={<AdminProductForm />} />
      <Route path="categories" element={<AdminCategories />} />
      <Route path="inventory" element={<AdminInventory />} />
      <Route path="orders" element={<AdminOrders />} />
      <Route path="orders/:id" element={<AdminOrderDetail />} />
      <Route path="analytics" element={<AdminAnalyticsCharts />} />
      <Route path="users" element={<AdminUsers />} />
      <Route path="contact" element={<AdminContactManager />} />
      <Route path="settings" element={<AdminSettings />} />
    </Routes>
  );
};

export default AdminRoutes;
