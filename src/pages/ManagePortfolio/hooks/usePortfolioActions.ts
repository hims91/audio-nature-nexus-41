
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { PortfolioItem } from "@/data/portfolio";

interface UsePortfolioActionsProps {
  items: PortfolioItem[];
  setItems: React.Dispatch<React.SetStateAction<PortfolioItem[]>>;
  toast: any;
}

export function usePortfolioActions({ items, setItems, toast }: UsePortfolioActionsProps) {
  
  const addItem = (newItemData: Omit<PortfolioItem, "id" | "createdAt">) => {
    const newItem: PortfolioItem = {
      ...newItemData,
      id: uuidv4(),
      createdAt: new Date().toISOString()
    };
    
    console.log("➕ Adding new portfolio item:", newItem.title);
    setItems(prevItems => [newItem, ...prevItems]);
    
    toast({
      title: "Item Created",
      description: `"${newItem.title}" has been added to your portfolio.`
    });
    
    return newItem;
  };
  
  const updateItem = (updatedItem: PortfolioItem) => {
    console.log("🔄 Updating portfolio item:", updatedItem.title);
    setItems(prevItems => 
      prevItems.map(item => 
        item.id === updatedItem.id ? updatedItem : item
      )
    );
    
    toast({
      title: "Item Updated",
      description: `"${updatedItem.title}" has been updated.`
    });
  };
  
  const deleteItem = (id: string) => {
    const itemToDelete = items.find(item => item.id === id);
    
    if (!itemToDelete) return;
    
    console.log("🗑️ Deleting portfolio item:", itemToDelete.title);
    setItems(prevItems => prevItems.filter(item => item.id !== id));
    
    toast({
      title: "Item Deleted",
      description: `"${itemToDelete.title}" has been removed from your portfolio.`
    });
  };

  return {
    addItem,
    updateItem,
    deleteItem
  };
}
