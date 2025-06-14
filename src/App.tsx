import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from "@/components/theme-provider"
import { QueryClient } from "@tanstack/react-query";
import Index from './pages/Index';
import PortfolioPage from './pages/PortfolioPage';
import ContactPage from './pages/ContactPage';
import NotFound from './pages/NotFound';
import AuthEnhanced from './pages/AuthEnhanced';
import { AuthProvider } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import PageTransition from '@/components/animations/PageTransition';
import { Toaster } from "@/components/ui/toaster"

import AdminGuard from "@/components/admin/AdminGuard";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminPortfolio from "@/pages/admin/AdminPortfolio";
import AdminAnalytics from "@/pages/admin/AdminAnalytics";

function App() {
  return (
    <AuthProvider>
      <HelmetProvider>
        <QueryClient>
          <ThemeProvider defaultTheme="light" storageKey="terra-echo-theme">
            <BrowserRouter>
              <PageTransition>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/portfolio" element={<PortfolioPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/auth" element={<AuthEnhanced />} />
                  
                  {/* Admin Routes */}
                  <Route path="/admin" element={
                    <AdminGuard>
                      <AdminLayout />
                    </AdminGuard>
                  }>
                    <Route index element={<Navigate to="/admin/dashboard" replace />} />
                    <Route path="dashboard" element={<AdminDashboard />} />
                    <Route path="portfolio" element={<AdminPortfolio />} />
                    <Route path="analytics" element={<AdminAnalytics />} />
                    <Route path="users" element={<div className="p-6 text-center text-gray-500">User management coming soon</div>} />
                    <Route path="settings" element={<div className="p-6 text-center text-gray-500">Settings coming soon</div>} />
                  </Route>
                  
                  {/* Legacy portfolio management route - redirect to admin */}
                  <Route path="/manage-portfolio" element={
                    <ProtectedRoute>
                      <Navigate to="/admin/portfolio" replace />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </PageTransition>
              <Toaster />
            </BrowserRouter>
          </ThemeProvider>
        </QueryClient>
      </HelmetProvider>
    </AuthProvider>
  );
}

export default App;
