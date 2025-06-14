
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { usePortfolioData } from "@/hooks/usePortfolioData";
import PortfolioItemsList from "./components/PortfolioItemsList";
import PortfolioEditor from "./components/PortfolioEditor";
import EmptyState from "./components/EmptyState";
import { PlusCircle, AlertCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

const ManagePortfolio: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { 
    portfolioItems, 
    isLoading,
    error,
    createPortfolioItem,
    updatePortfolioItem,
    deletePortfolioItem
  } = usePortfolioData();
  
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  
  const selectedItem = selectedId 
    ? portfolioItems.find(item => item.id === selectedId) || null
    : null;
    
  const handleNewItem = () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to create portfolio items.",
        variant: "destructive"
      });
      return;
    }
    setSelectedId(null);
    setIsCreating(true);
  };
  
  const handleSaveNew = async (itemData: any) => {
    try {
      const result = await createPortfolioItem.mutateAsync(itemData);
      setSelectedId(result.id);
      setIsCreating(false);
      toast({
        title: "Success",
        description: `"${result.title}" has been created successfully.`
      });
    } catch (error) {
      console.error('Failed to create portfolio item:', error);
      toast({
        title: "Error",
        description: "Failed to create portfolio item. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const handleUpdate = async (item: any) => {
    try {
      await updatePortfolioItem.mutateAsync({ 
        id: item.id, 
        updates: {
          title: item.title,
          client: item.client,
          category: item.category,
          description: item.description,
          cover_image_url: item.cover_image_url,
          audio_url: item.audio_url,
          video_url: item.video_url,
          external_links: item.external_links,
          featured: item.featured
        }
      });
      toast({
        title: "Success",
        description: `"${item.title}" has been updated successfully.`
      });
    } catch (error) {
      console.error('Failed to update portfolio item:', error);
      toast({
        title: "Error",
        description: "Failed to update portfolio item. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const handleDelete = async (id: string) => {
    try {
      await deletePortfolioItem.mutateAsync(id);
      setSelectedId(null);
      toast({
        title: "Success",
        description: "Portfolio item has been deleted successfully."
      });
    } catch (error) {
      console.error('Failed to delete portfolio item:', error);
      toast({
        title: "Error",
        description: "Failed to delete portfolio item. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const handleCancel = () => {
    setIsCreating(false);
    setSelectedId(null);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow py-16 bg-nature-cream/30">
          <div className="container mx-auto px-4">
            <Alert className="max-w-2xl mx-auto">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Please sign in to manage your portfolio items. You need to be authenticated to create, edit, or delete portfolio items.
              </AlertDescription>
            </Alert>
            <div className="text-center mt-8">
              <Button onClick={() => navigate('/auth')} className="bg-nature-forest hover:bg-nature-leaf">
                Sign In
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-16 bg-nature-cream/30">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-nature-forest mb-2">Portfolio Manager</h1>
                <p className="text-nature-bark text-sm">
                  Signed in as: {user.email}
                </p>
              </div>
            </div>
            <p className="text-nature-bark max-w-3xl">
              Create and manage your portfolio items with audio, video, and images. 
              All data is securely stored in your Supabase database.
            </p>
          </div>

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
              {/* Sidebar */}
              <div className="md:col-span-1">
                <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
                  <Button 
                    onClick={handleNewItem}
                    className="w-full bg-nature-forest hover:bg-nature-leaf mb-4"
                    disabled={createPortfolioItem.isPending}
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    {createPortfolioItem.isPending ? 'Creating...' : 'New Portfolio Item'}
                  </Button>
                  
                  <PortfolioItemsList 
                    items={portfolioItems} 
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
                    isLoading={createPortfolioItem.isPending}
                  />
                ) : selectedItem ? (
                  <PortfolioEditor 
                    mode="edit"
                    item={selectedItem}
                    onSave={handleUpdate}
                    onDelete={() => handleDelete(selectedItem.id)}
                    onCancel={handleCancel}
                    isLoading={updatePortfolioItem.isPending || deletePortfolioItem.isPending}
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
