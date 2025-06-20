import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './components/theme-provider';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/AuthContext';
import { EnhancedAuthProvider } from '@/contexts/EnhancedAuthContext';
import SEOManager from '@/components/SEO/SEOManager';
import PWAInstallerEnhanced from '@/components/performance/PWAInstallerEnhanced';
import ErrorBoundary from '@/components/security/ErrorBoundary';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { DatabaseOptimizerProvider } from '@/components/performance/DatabaseOptimizer';
import MemoryOptimizer from '@/components/performance/MemoryOptimizer';
import { ErrorTrackerProvider } from '@/components/monitoring/ErrorTracker';
import Index from '@/pages/Index';
import ShopPage from '@/pages/ShopPage';
import ProductDetailPage from '@/pages/ProductDetailPage';
import CartPage from '@/pages/CartPage';
import CheckoutPage from '@/components/shop/CheckoutPage';
import OrderSuccessPage from '@/pages/OrderSuccessPage';
import OrderCancelPage from '@/pages/OrderCancelPage';
import AuthEnhanced from '@/pages/AuthEnhanced';
import ProfilePage from '@/pages/ProfilePage';
import DashboardPage from '@/pages/DashboardPage';
import AdminLayout from '@/components/admin/AdminLayout';
import ContactPage from '@/pages/ContactPage';
import CustomerOrderHistory from '@/pages/CustomerOrderHistory';
import PortfolioPage from '@/pages/PortfolioPage';
import OrderDetailPage from '@/pages/OrderDetailPage';
import NotFound from '@/pages/NotFound';

// Create QueryClient instance with optimized settings for performance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
      retry: (failureCount, error: any) => {
        // Don't retry on 4xx errors
        if (error?.status >= 400 && error?.status < 500) return false;
        return failureCount < 2;
      },
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <HelmetProvider>
          <AuthProvider>
            <EnhancedAuthProvider>
              <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
                <DatabaseOptimizerProvider queryClient={queryClient}>
                  <MemoryOptimizer>
                    <ErrorTrackerProvider>
                      <Router>
                        <div className="min-h-screen bg-gradient-to-br from-nature-mist via-white to-nature-sage/10 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
                          <PWAInstallerEnhanced />
                          <SEOManager />
                          <Routes>
                            <Route path="/" element={<Index />} />
                            <Route path="/shop" element={<ShopPage />} />
                            <Route path="/shop/products/:slug" element={<ProductDetailPage />} />
                            <Route path="/cart" element={<CartPage />} />
                            <Route path="/checkout" element={<CheckoutPage />} />
                            <Route path="/order-success" element={<OrderSuccessPage />} />
                            <Route path="/order-cancel" element={<OrderCancelPage />} />
                            <Route path="/auth" element={<AuthEnhanced />} />
                            <Route path="/profile" element={
                              <ProtectedRoute>
                                <ProfilePage />
                              </ProtectedRoute>
                            } />
                            <Route path="/dashboard/*" element={
                              <ProtectedRoute>
                                <DashboardPage />
                              </ProtectedRoute>
                            } />
                            <Route path="/contact" element={<ContactPage />} />
                            <Route path="/portfolio" element={<PortfolioPage />} />
                            <Route path="/admin/*" element={
                              <ProtectedRoute requiredRole="admin">
                                <AdminLayout />
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
                    </ErrorTrackerProvider>
                  </MemoryOptimizer>
                </DatabaseOptimizerProvider>
              </ThemeProvider>
            </EnhancedAuthProvider>
          </AuthProvider>
        </HelmetProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
