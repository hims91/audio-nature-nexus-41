import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from "@/hooks/use-toast";
import { portfolioItems as initialPortfolioItems, PortfolioItem } from "@/data/portfolio";

export function usePortfolioManager() {
  const { toast } = useToast();
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // Load portfolio items from localStorage on component mount
  useEffect(() => {
    const loadItems = () => {
      try {
        setIsLoading(true);
        const savedItems = localStorage.getItem('portfolioItems');
        
        if (savedItems) {
          const parsedItems = JSON.parse(savedItems);
          setItems(parsedItems);
        } else {
          setItems(initialPortfolioItems);
        }
        
        setErrorMessage(null);
      } catch (error) {
        console.error("Error loading portfolio items:", error);
        setErrorMessage("Failed to load portfolio items. Using default data.");
        setItems(initialPortfolioItems);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadItems();
  }, []);
  
  // Save items to localStorage whenever they change
  useEffect(() => {
    if (!isLoading && items.length > 0) {
      try {
        localStorage.setItem('portfolioItems', JSON.stringify(items));
      } catch (error) {
        console.error("Error saving portfolio items:", error);
        toast({
          title: "Error Saving Data",
          description: "There was a problem saving your portfolio data to browser storage.",
          variant: "destructive"
        });
      }
    }
  }, [items, isLoading, toast]);
  
  // Add a new portfolio item
  const addItem = (newItemData: Omit<PortfolioItem, "id" | "createdAt">) => {
    const newItem: PortfolioItem = {
      ...newItemData,
      id: uuidv4(),
      createdAt: new Date().toISOString()
    };
    
    setItems(prevItems => [newItem, ...prevItems]);
    
    toast({
      title: "Item Created",
      description: `"${newItem.title}" has been added to your portfolio.`
    });
    
    return newItem;
  };
  
  // Update an existing portfolio item
  const updateItem = (updatedItem: PortfolioItem) => {
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
  
  // Delete a portfolio item
  const deleteItem = (id: string) => {
    const itemToDelete = items.find(item => item.id === id);
    
    if (!itemToDelete) return;
    
    setItems(prevItems => prevItems.filter(item => item.id !== id));
    
    toast({
      title: "Item Deleted",
      description: `"${itemToDelete.title}" has been removed from your portfolio.`
    });
  };
  
  return {
    items,
    addItem,
    updateItem,
    deleteItem,
    isLoading,
    errorMessage
  };
}
