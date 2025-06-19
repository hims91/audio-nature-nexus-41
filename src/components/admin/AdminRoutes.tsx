import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import LoadingSpinner from '@/components/animations/LoadingSpinner';

// Lazy load admin components for better performance
const AdminProducts = lazy(() => import('./AdminProducts'));
const AdminOrders = lazy(() => import('./AdminOrders'));
const AdminInventory = lazy(() => import('./AdminInventory'));
const AdminAnalytics = lazy(() => import('./AdminAnalytics'));
const AdminUsers = lazy(() => import('./AdminUsers'));
const AdminSettings = lazy(() => import('./AdminSettings'));
const AdminPortfolio = lazy(() => import('./AdminPortfolio'));
const AdminDashboard = lazy(() => import('./AdminDashboard'));

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
        <Route path="settings" element={<AdminSettings />} />
      </Routes>
    </Suspense>
  );
};

export default AdminRoutes;