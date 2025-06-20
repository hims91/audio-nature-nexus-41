
import React from 'react';
import { useEnhancedAuth } from '@/contexts/EnhancedAuthContext';
import { Navigate } from 'react-router-dom';
import UnifiedNavbar from '@/components/UnifiedNavbar';
import Footer from '@/components/Footer';
import SEOManager from '@/components/SEO/SEOManager';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import DashboardContent from '@/components/dashboard/DashboardContent';
import LoadingSpinner from '@/components/animations/LoadingSpinner';

const DashboardPage: React.FC = () => {
  const { user, loading } = useEnhancedAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <>
      <SEOManager
        title="Dashboard"
        description="Manage your account, orders, and preferences"
        url={`${window.location.origin}/dashboard`}
      />
      <UnifiedNavbar />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <DashboardLayout>
          <DashboardContent />
        </DashboardLayout>
      </div>
      <Footer />
    </>
  );
};

export default DashboardPage;
