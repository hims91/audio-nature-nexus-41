
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { usePortfolioManager } from "@/pages/ManagePortfolio/hooks/usePortfolioManager";
import PortfolioHeader from "@/pages/ManagePortfolio/components/PortfolioHeader";
import PortfolioSidebar from "@/pages/ManagePortfolio/components/PortfolioSidebar";
import PortfolioMainContent from "@/pages/ManagePortfolio/components/PortfolioMainContent";

const AdminPortfolio: React.FC = () => {
  const { user } = useAuth();
  const {
    portfolioItems,
    selectedItem,
    isCreating,
    isLoading,
    handleCreateNew,
    handleSelectItem,
    handleSaveNew,
    handleUpdate,
    handleDelete,
    handleCancel,
  } = usePortfolioManager();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-80 bg-white dark:bg-gray-800 shadow-lg overflow-hidden">
          <PortfolioHeader 
            userEmail={user?.email}
            onCreateNew={handleCreateNew}
            isCreating={isCreating}
            isLoading={isLoading}
          />
          
          <PortfolioSidebar
            portfolioItems={portfolioItems}
            selectedItem={selectedItem}
            onSelectItem={handleSelectItem}
            isCreating={isCreating}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-6">
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Portfolio Management
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400">
                    Create and manage your portfolio items
                  </p>
                </div>
              </div>
            </div>

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
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPortfolio;
