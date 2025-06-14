
import { useState } from "react";
import { usePortfolioData } from "@/hooks/usePortfolioData";
import { type PortfolioItem } from "@/types/portfolio";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

export const usePortfolioManager = () => {
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
  
  const handleSaveNew = async (itemData: Partial<PortfolioItem>) => {
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
  
  const handleUpdate = async (item: PortfolioItem) => {
    try {
      await updatePortfolioItem.mutateAsync({ 
        id: item.id, 
        updates: item
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

  const handleSelectItem = (id: string) => {
    setIsCreating(false);
    setSelectedId(id);
  };

  return {
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
  };
};
