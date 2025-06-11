
import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useSupabasePortfolio } from "@/hooks/useSupabasePortfolio";
import PortfolioItemsList from "./components/PortfolioItemsList";
import PortfolioEditor from "./components/PortfolioEditor";
import EmptyState from "./components/EmptyState";
import { CreatePortfolioItem, UpdatePortfolioItem } from "@/types/portfolio";
import { PlusCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const ManagePortfolio: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { 
    userPortfolioItems: items,
    createItem,
    updateItem,
    deleteItem,
    isLoadingUserPortfolio: isLoading,
    portfolioError,
    userPortfolioError,
    isCreating,
    isUpdating,
    isDeleting
  } = useSupabasePortfolio();
  
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  
  // Hidden file input for direct file saving
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const selectedItem = selectedId 
    ? items.find(item => item.id === selectedId) || null
    : null;
    
  const handleNewItem = () => {
    setSelectedId(null);
    setIsCreatingNew(true);
  };
  
  const handleSaveNew = (item: CreatePortfolioItem) => {
    createItem(item);
    setIsCreatingNew(false);
  };
  
  const handleUpdate = (item: UpdatePortfolioItem) => {
    updateItem(item);
  };
  
  const handleDelete = (id: string) => {
    deleteItem(id);
    setSelectedId(null);
  };
  
  const handleCancel = () => {
    setIsCreatingNew(false);
    setSelectedId(null);
  };

  const errorMessage = portfolioError?.message || userPortfolioError?.message;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-16 bg-nature-cream/30">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-nature-forest mb-2">Portfolio Manager</h1>
                {user && (
                  <p className="text-nature-bark text-sm">
                    Signed in as: {user.email}
                  </p>
                )}
              </div>
            </div>
            <p className="text-nature-bark max-w-3xl">
              Upload and manage your portfolio items with audio, video, and images. 
              Add links to external platforms to showcase your work.
            </p>
          </div>
          
          {!user ? (
            <div className="bg-amber-50 border border-amber-200 text-amber-800 p-6 rounded-lg mb-6">
              <h3 className="font-semibold mb-2">Authentication Required</h3>
              <p className="mb-4">You need to be signed in to manage your portfolio items.</p>
              <Button
                onClick={() => navigate('/auth')}
                className="bg-nature-forest hover:bg-nature-leaf"
              >
                Sign In / Sign Up
              </Button>
            </div>
          ) : isLoading ? (
            <div className="text-center py-12">
              <div className="animate-pulse text-nature-forest">Loading portfolio items...</div>
            </div>
          ) : errorMessage ? (
            <div className="bg-red-50 text-red-500 p-4 rounded-md mb-6">
              {errorMessage}
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {/* Sidebar */}
              <div className="md:col-span-1">
                <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
                  <Button 
                    onClick={handleNewItem}
                    className="w-full bg-nature-forest hover:bg-nature-leaf mb-4"
                    disabled={isCreating}
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    {isCreating ? 'Creating...' : 'New Portfolio Item'}
                  </Button>
                  
                  <PortfolioItemsList 
                    items={items} 
                    selectedId={selectedId}
                    onSelectItem={(id) => {
                      setIsCreatingNew(false);
                      setSelectedId(id);
                    }} 
                  />
                </div>
                
                <div className="text-center mt-4">
                  <Button
                    onClick={() => navigate('/')}
                    variant="outline"
                    className="border-nature-forest text-nature-forest hover:bg-nature-forest hover:text-white"
                  >
                    Return to Homepage
                  </Button>
                </div>
              </div>
              
              {/* Main Content */}
              <div className="md:col-span-2">
                {isCreatingNew ? (
                  <PortfolioEditor 
                    mode="create"
                    onSave={handleSaveNew}
                    onCancel={handleCancel}
                    isLoading={isCreating}
                  />
                ) : selectedItem ? (
                  <PortfolioEditor 
                    mode="edit"
                    item={selectedItem}
                    onSave={handleUpdate}
                    onDelete={() => handleDelete(selectedItem.id)}
                    onCancel={handleCancel}
                    isLoading={isUpdating}
                    isDeleting={isDeleting}
                  />
                ) : (
                  <EmptyState onCreateNew={handleNewItem} />
                )}
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
      
      {/* Hidden file input for direct file saving */}
      <input 
        type="file" 
        ref={fileInputRef}
        style={{ display: 'none' }}
      />
    </div>
  );
};

export default ManagePortfolio;
