
import React from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { usePortfolioManager } from "./hooks/usePortfolioManager";
import PortfolioLayout from "./components/PortfolioLayout";
import PortfolioHeader from "./components/PortfolioHeader";
import PortfolioSidebar from "./components/PortfolioSidebar";
import PortfolioMainContent from "./components/PortfolioMainContent";
import AuthGuard from "./components/AuthGuard";

const ManagePortfolio: React.FC = () => {
  const {
    user,
    portfolioItems,
    isLoading,
    error,
    selectedId,
    selectedItem,
    isCreating,
    handleNewItem,
    handleSaveNew,
    handleUpdate,
    handleDelete,
    handleCancel,
    handleSelectItem,
    createPortfolioItem,
    updatePortfolioItem,
    deletePortfolioItem
  } = usePortfolioManager();

  if (!user) {
    return <AuthGuard />;
  }

  return (
    <PortfolioLayout>
      <PortfolioHeader 
        userEmail={user.email}
        onCreateNew={handleNewItem}
        isCreating={createPortfolioItem.isPending}
      />

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load portfolio items: {error.message}
          </AlertDescription>
        </Alert>
      )}
      
      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-pulse text-nature-forest">Loading portfolio items...</div>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-8">
          <PortfolioSidebar 
            portfolioItems={portfolioItems}
            selectedId={selectedId}
            onSelectItem={handleSelectItem}
          />
          
          <div className="md:col-span-2">
            <PortfolioMainContent 
              isCreating={isCreating}
              selectedItem={selectedItem}
              onSaveNew={handleSaveNew}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
              onCancel={handleCancel}
              onCreateNew={handleNewItem}
              isLoading={createPortfolioItem.isPending || updatePortfolioItem.isPending || deletePortfolioItem.isPending}
            />
          </div>
        </div>
      )}
    </PortfolioLayout>
  );
};

export default ManagePortfolio;
