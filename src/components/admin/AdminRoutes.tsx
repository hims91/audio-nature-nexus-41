
import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import LoadingSpinner from '@/components/animations/LoadingSpinner';

// Lazy load admin components for better performance
const AdminProducts = lazy(() => import('../../pages/admin/AdminProducts'));
const AdminOrders = lazy(() => import('../../pages/admin/AdminOrders'));
const AdminInventory = lazy(() => import('../../pages/admin/AdminInventory'));
const AdminAnalytics = lazy(() => import('../../pages/admin/AdminAnalytics'));
const AdminUsers = lazy(() => import('../../pages/admin/AdminUsers'));
const AdminSettings = lazy(() => import('../../pages/admin/AdminSettings'));
const AdminPortfolio = lazy(() => import('../../pages/admin/AdminPortfolio'));
const AdminDashboard = lazy(() => import('../../pages/admin/AdminDashboard'));
const AdminDiscountCodes = lazy(() => import('../../pages/admin/AdminDiscountCodes'));
const AdminReviews = lazy(() => import('../../pages/admin/AdminReviews'));

// Loading component for lazy routes
const LazyLoadingFallback = () => (
  <div className="flex items-center justify-center py-12">
    <LoadingSpinner size="lg" />
  </div>
);

const AdminRoutes: React.FC = () => {
  return (
    <Suspense fallback={<LazyLoadingFallback />}>
      <Routes>
        <Route index element={<AdminDashboard />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="portfolio" element={<AdminPortfolio />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="inventory" element={<AdminInventory />} />
        <Route path="analytics" element={<AdminAnalytics />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="discount-codes" element={<AdminDiscountCodes />} />
        <Route path="reviews" element={<AdminReviews />} />
        <Route path="settings" element={<AdminSettings />} />
      </Routes>
    </Suspense>
  );
};

export default AdminRoutes;
