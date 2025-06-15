import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from "@/components/theme-provider"
import Index from './pages/Index';
import PortfolioPage from './pages/PortfolioPage';
import ContactPage from './pages/ContactPage';
import AuthEnhanced from './pages/AuthEnhanced';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminPortfolio from './pages/admin/AdminPortfolio';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import AdminUsers from './pages/admin/AdminUsers';
import AdminSettings from './pages/admin/AdminSettings';
import AdminGuard from './components/admin/AdminGuard';
import { AuthProvider } from '@/contexts/AuthContext';
import { EnhancedAuthProvider } from '@/contexts/EnhancedAuthContext';
import { Toaster } from "@/components/ui/toaster"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';

const queryClient = new QueryClient();

import AuthErrorBoundary from '@/components/auth/AuthErrorBoundary';

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="ui-theme">
      <QueryClientProvider client={queryClient}>
        <HelmetProvider>
          <BrowserRouter>
            <AuthProvider>
              <EnhancedAuthProvider>
                <Toaster />
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/portfolio" element={<PortfolioPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route 
                    path="/auth" 
                    element={
                      <AuthErrorBoundary>
                        <AuthEnhanced />
                      </AuthErrorBoundary>
                    } 
                  />
                  
                  {/* Admin Routes */}
                  <Route 
                    path="/admin/*" 
                    element={
                      <ProtectedRoute>
                        <AdminGuard>
                          <AdminLayout />
                        </AdminGuard>
                      </ProtectedRoute>
                    }
                  >
                    <Route path="dashboard" element={<AdminDashboard />} />
                    <Route path="portfolio" element={<AdminPortfolio />} />
                    <Route path="analytics" element={<AdminAnalytics />} />
                    <Route path="users" element={<AdminUsers />} />
                    <Route path="settings" element={<AdminSettings />} />
                  </Route>
                  
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </EnhancedAuthProvider>
            </AuthProvider>
          </BrowserRouter>
        </HelmetProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
