import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './components/theme-provider';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from '@/components/ui/toaster';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { SEOManager } from '@/components/SEO/SEOManager';
import { PWAInstallerEnhanced } from '@/components/PWA/PWAInstallerEnhanced';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import HomePage from '@/pages/HomePage';
import ShopPage from '@/pages/ShopPage';
import ProductDetailPage from '@/pages/ProductDetailPage';
import CategoryPage from '@/pages/CategoryPage';
import CartPage from '@/pages/CartPage';
import CheckoutPage from '@/pages/CheckoutPage';
import OrderConfirmationPage from '@/pages/OrderConfirmationPage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import AccountPage from '@/pages/AccountPage';
import AdminRoutes from '@/components/admin/AdminRoutes';
import AdminLayout from '@/components/admin/AdminLayout';
import ContactPage from '@/pages/ContactPage';
import AboutPage from '@/pages/AboutPage';
import OrderDetailPage from '@/pages/OrderDetailPage';
import CustomerOrderHistory from '@/pages/CustomerOrderHistory';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
          <Router>
            <div className="min-h-screen bg-gradient-to-br from-nature-mist via-white to-nature-sage/10 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
              <PWAInstallerEnhanced />
              <SEOManager />
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/shop" element={<ShopPage />} />
                <Route path="/shop/products/:slug" element={<ProductDetailPage />} />
                <Route path="/shop/categories/:slug" element={<CategoryPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/checkout" element={
                  <ProtectedRoute>
                    <CheckoutPage />
                  </ProtectedRoute>
                } />
                <Route path="/order-confirmation" element={
                  <ProtectedRoute>
                    <OrderConfirmationPage />
                  </ProtectedRoute>
                } />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/account" element={
                  <ProtectedRoute>
                    <AccountPage />
                  </ProtectedRoute>
                } />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/admin/*" element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminLayout>
                      <AdminRoutes />
                    </AdminLayout>
                  </ProtectedRoute>
                } />
                <Route path="/orders" element={
                  <ProtectedRoute>
                    <CustomerOrderHistory />
                  </ProtectedRoute>
                } />
                <Route path="/orders/:orderId" element={
                  <ProtectedRoute>
                    <OrderDetailPage />
                  </ProtectedRoute>
                } />
              </Routes>
            </div>
          </Router>
        </ThemeProvider>
      </HelmetProvider>
    </QueryClientProvider>
  );
}

export default App;
