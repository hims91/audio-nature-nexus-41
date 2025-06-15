
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from '@/contexts/AuthContext';
import { EnhancedAuthProvider } from '@/contexts/EnhancedAuthContext';
import { Toaster } from "@/components/ui/toaster"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import { useSettings } from '@/hooks/useSettings';
import { useEnhancedAuth } from '@/contexts/EnhancedAuthContext';
import LoadingSpinner from '@/components/animations/LoadingSpinner';

// Pages
import Index from './pages/Index';
import PortfolioPage from './pages/PortfolioPage';
import ContactPage from './pages/ContactPage';
import AuthEnhanced from './pages/AuthEnhanced';
import NotFound from './pages/NotFound';
import MaintenancePage from './pages/MaintenancePage';
import ProfilePage from './pages/ProfilePage';

// Admin Pages
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminPortfolio from './pages/admin/AdminPortfolio';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import AdminUsers from './pages/admin/AdminUsers';
import AdminSettings from './pages/admin/AdminSettings';

// Components
import ProtectedRoute from './components/ProtectedRoute';
import AdminGuard from './components/admin/AdminGuard';
import AuthErrorBoundary from '@/components/auth/AuthErrorBoundary';
import MaintenanceBanner from '@/components/MaintenanceBanner';

const queryClient = new QueryClient();

const AppRoutes: React.FC = () => {
  const { data: settings, isLoading: isLoadingSettings } = useSettings();
  const { isAdmin, loading: isLoadingAuth } = useEnhancedAuth();
  
  const isLoading = isLoadingSettings || isLoadingAuth;
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <LoadingSpinner size="lg" />
      </div>
    );
  }
  
  const inMaintenance = settings?.maintenance_mode && !isAdmin;

  return (
    <>
      {settings?.maintenance_mode && <MaintenanceBanner />}
      <Toaster />
      <Routes>
        <Route path="/auth" element={<AuthErrorBoundary><AuthEnhanced /></AuthErrorBoundary>} />
        
        {inMaintenance ? (
          <Route path="*" element={<MaintenancePage />} />
        ) : (
          <>
            <Route path="/" element={<Index />} />
            <Route path="/portfolio" element={<PortfolioPage />} />
            <Route path="/contact" element={<ContactPage />} />
            
            <Route 
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />

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
          </>
        )}
      </Routes>
    </>
  );
};

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="ui-theme">
      <QueryClientProvider client={queryClient}>
        <HelmetProvider>
          <BrowserRouter>
            <AuthProvider>
              <EnhancedAuthProvider>
                <AppRoutes />
              </EnhancedAuthProvider>
            </AuthProvider>
          </BrowserRouter>
        </HelmetProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
