
import React from 'react';
import { Helmet } from 'react-helmet-async';
import UnifiedNavbar from '@/components/UnifiedNavbar';
import Footer from '@/components/Footer';
import PortfolioLayout from './ManagePortfolio/components/PortfolioLayout';
import PortfolioMainContent from './ManagePortfolio/components/PortfolioMainContent';
import { usePortfolioManager } from './ManagePortfolio/hooks/usePortfolioManager';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const ManagePortfolio: React.FC = () => {
  const { user, loading } = useAuth();
  const {
    selectedItem,
    isCreating,
    isLoading,
    handleCreateNew,
    handleSaveNew,
    handleUpdate,
    handleDelete,
    handleCancel
  } = usePortfolioManager();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-nature-forest"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <>
      <Helmet>
        <title>Manage Portfolio - Terra Echo Studios</title>
        <meta name="description" content="Manage your portfolio items and showcase your work." />
      </Helmet>

      <UnifiedNavbar />
      
      <div className="min-h-screen bg-white dark:bg-gray-900 pt-20">
        <PortfolioLayout>
          <PortfolioMainContent
            isCreating={isCreating}
            selectedItem={selectedItem}
            onSaveNew={handleSaveNew}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
            onCancel={handleCancel}
            onCreateNew={handleCreateNew}
            isLoading={isLoading}
          />
        </PortfolioLayout>
      </div>
      
      <Footer />
    </>
  );
};

export default ManagePortfolio;
