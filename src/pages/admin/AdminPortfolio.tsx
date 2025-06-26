
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
    <div className="min-h-screen bg-white">
      {/* Mobile-first responsive layout */}
      <div className="flex flex-col lg:flex-row h-screen">
        {/* Sidebar - Full width on mobile, fixed width on desktop */}
        <div className="w-full lg:w-80 bg-white shadow-lg overflow-hidden">
          <PortfolioHeader 
            userEmail={user?.email}
            onCreateNew={handleCreateNew}
            isCreating={isCreating}
            isLoading={isLoading}
          />
          
          <div className="max-h-60 lg:max-h-none overflow-y-auto">
            <PortfolioSidebar
              portfolioItems={portfolioItems}
              selectedItem={selectedItem}
              onSelectItem={handleSelectItem}
              isCreating={isCreating}
            />
          </div>
        </div>

        {/* Main Content - Responsive padding and layout */}
        <div className="flex-1 overflow-auto">
          <div className="p-4 lg:p-6">
            <div className="mb-4 lg:mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div className="mb-4 sm:mb-0">
                  <h1 className="text-xl lg:text-2xl font-bold text-gray-900">
                    Portfolio Management
                  </h1>
                  <p className="text-sm lg:text-base text-gray-600">
                    Create and manage your portfolio items
                  </p>
                </div>
              </div>
            </div>

            <div className="w-full overflow-hidden">
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
    </div>
  );
};

export default AdminPortfolio;
