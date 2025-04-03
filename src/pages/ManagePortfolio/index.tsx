
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { usePortfolioManager } from "./hooks/usePortfolioManager";
import PortfolioItemsList from "./components/PortfolioItemsList";
import PortfolioEditor from "./components/PortfolioEditor";
import EmptyState from "./components/EmptyState";
import { PortfolioItem } from "@/data/portfolio";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle } from "lucide-react";

const ManagePortfolio: React.FC = () => {
  const navigate = useNavigate();
  const { 
    items, 
    addItem, 
    updateItem, 
    deleteItem,
    isLoading,
    errorMessage
  } = usePortfolioManager();
  
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  
  const selectedItem = selectedId 
    ? items.find(item => item.id === selectedId) || null
    : null;
    
  const handleNewItem = () => {
    setSelectedId(null);
    setIsCreating(true);
  };
  
  const handleSaveNew = (item: Omit<PortfolioItem, "id" | "createdAt">) => {
    const newItem = addItem(item);
    setSelectedId(newItem.id);
    setIsCreating(false);
  };
  
  const handleUpdate = (item: PortfolioItem) => {
    updateItem(item);
  };
  
  const handleDelete = (id: string) => {
    deleteItem(id);
    setSelectedId(null);
  };
  
  const handleCancel = () => {
    setIsCreating(false);
    setSelectedId(null);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-16 bg-nature-cream/30">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-nature-forest mb-2">Portfolio Manager</h1>
            <p className="text-nature-bark max-w-3xl">
              Upload and manage your portfolio items with audio, video, and images. 
              Add links to external platforms to showcase your work.
            </p>
          </div>
          
          {isLoading ? (
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
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    New Portfolio Item
                  </Button>
                  
                  <PortfolioItemsList 
                    items={items} 
                    selectedId={selectedId}
                    onSelectItem={(id) => {
                      setIsCreating(false);
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
                {isCreating ? (
                  <PortfolioEditor 
                    mode="create"
                    onSave={handleSaveNew}
                    onCancel={handleCancel}
                  />
                ) : selectedItem ? (
                  <PortfolioEditor 
                    mode="edit"
                    item={selectedItem}
                    onSave={handleUpdate}
                    onDelete={() => handleDelete(selectedItem.id)}
                    onCancel={handleCancel}
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
    </div>
  );
};

export default ManagePortfolio;
