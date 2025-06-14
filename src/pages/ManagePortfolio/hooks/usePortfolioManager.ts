
import { useState } from "react";
import { usePortfolioData } from "@/hooks/usePortfolioData";
import { type PortfolioItem } from "@/types/portfolio";
import { useToast } from "@/hooks/use-toast";

export const usePortfolioManager = () => {
  const { toast } = useToast();
  const {
    portfolioItems,
    featuredItems,
    isLoading,
    error,
    createPortfolioItem,
    updatePortfolioItem,
    deletePortfolioItem
  } = usePortfolioData();

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const selectedItem = portfolioItems.find(item => item.id === selectedId) || null;

  const handleCreateNew = () => {
    setIsCreating(true);
    setSelectedId(null);
  };

  const handleSelectItem = (id: string) => {
    setSelectedId(id);
    setIsCreating(false);
  };

  const handleSaveNew = async (itemData: Partial<PortfolioItem>) => {
    try {
      await createPortfolioItem.mutateAsync(itemData);
      setIsCreating(false);
      toast({
        title: "Success",
        description: "Portfolio item created successfully!",
      });
    } catch (error) {
      console.error('Failed to create portfolio item:', error);
      toast({
        title: "Error",
        description: "Failed to create portfolio item. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleUpdate = async (item: PortfolioItem) => {
    try {
      await updatePortfolioItem.mutateAsync({ id: item.id, updates: item });
      toast({
        title: "Success",
        description: "Portfolio item updated successfully!",
      });
    } catch (error) {
      console.error('Failed to update portfolio item:', error);
      toast({
        title: "Error",
        description: "Failed to update portfolio item. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deletePortfolioItem.mutateAsync(id);
      setSelectedId(null);
      setIsCreating(false);
      toast({
        title: "Success",
        description: "Portfolio item deleted successfully!",
      });
    } catch (error) {
      console.error('Failed to delete portfolio item:', error);
      toast({
        title: "Error",
        description: "Failed to delete portfolio item. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    setIsCreating(false);
    setSelectedId(null);
  };

  return {
    portfolioItems,
    featuredItems,
    selectedId,
    selectedItem,
    isCreating,
    isLoading,
    error,
    handleCreateNew,
    handleSelectItem,
    handleSaveNew,
    handleUpdate,
    handleDelete,
    handleCancel,
    createPortfolioItem,
    updatePortfolioItem,
    deletePortfolioItem
  };
};
