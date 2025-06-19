
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './components/theme-provider';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from '@/components/ui/toaster';
import SEOManager from '@/components/SEO/SEOManager';
import PWAInstallerEnhanced from '@/components/performance/PWAInstallerEnhanced';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Index from '@/pages/Index';
import ShopPage from '@/pages/ShopPage';
import ProductDetailPage from '@/pages/ProductDetailPage';
import CartPage from '@/pages/CartPage';
import AuthEnhanced from '@/pages/AuthEnhanced';
import ProfilePage from '@/pages/ProfilePage';
import AdminRoutes from '@/components/admin/AdminRoutes';
import AdminLayout from '@/components/admin/AdminLayout';
import ContactPage from '@/pages/ContactPage';
import CustomerOrderHistory from '@/pages/CustomerOrderHistory';
import PortfolioPage from '@/pages/PortfolioPage';
import OrderDetailPage from '@/pages/OrderDetailPage';
import NotFound from '@/pages/NotFound';

// Create QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

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
                <Route path="/" element={<Index />} />
                <Route path="/shop" element={<ShopPage />} />
                <Route path="/shop/products/:slug" element={<ProductDetailPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/auth" element={<AuthEnhanced />} />
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                } />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/portfolio" element={<PortfolioPage />} />
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
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Toaster />
            </div>
          </Router>
        </ThemeProvider>
      </HelmetProvider>
    </QueryClientProvider>
  );
}

export default App;
