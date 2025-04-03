
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from "@/hooks/use-toast";
import { portfolioItems as initialPortfolioItems, PortfolioItem } from "@/data/portfolio";

export function usePortfolioManager() {
  const { toast } = useToast();
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [storageAvailable, setStorageAvailable] = useState<boolean>(true);
  
  // Check if localStorage is available
  useEffect(() => {
    try {
      const testKey = '__test_storage__';
      localStorage.setItem(testKey, testKey);
      localStorage.removeItem(testKey);
      setStorageAvailable(true);
    } catch (e) {
      console.error("localStorage is not available:", e);
      setStorageAvailable(false);
      toast({
        title: "Storage Warning",
        description: "Local storage is not available. Your changes won't persist after closing the browser.",
        variant: "destructive"
      });
    }
  }, [toast]);
  
  // Load portfolio items from localStorage on component mount
  useEffect(() => {
    const loadItems = () => {
      try {
        setIsLoading(true);
        
        if (!storageAvailable) {
          setItems(initialPortfolioItems);
          return;
        }
        
        const savedItems = localStorage.getItem('portfolioItems');
        
        if (savedItems) {
          try {
            const parsedItems = JSON.parse(savedItems);
            
            // Validate that the parsed data is an array
            if (Array.isArray(parsedItems)) {
              // Basic validation of required fields
              const validItems = parsedItems.filter(item => 
                item && 
                typeof item === 'object' && 
                item.id && 
                item.title && 
                item.category
              );
              
              if (validItems.length !== parsedItems.length) {
                console.warn("Some portfolio items were invalid and filtered out");
                toast({
                  title: "Data Warning",
                  description: "Some saved portfolio items were corrupted and have been removed."
                });
              }
              
              setItems(validItems);
            } else {
              throw new Error("Saved data is not in the expected format");
            }
          } catch (parseError) {
            console.error("Error parsing saved portfolio items:", parseError);
            throw new Error("Could not parse saved data");
          }
        } else {
          console.log("No saved portfolio items found, using initial data");
          setItems(initialPortfolioItems);
        }
        
        setErrorMessage(null);
      } catch (error) {
        console.error("Error loading portfolio items:", error);
        setErrorMessage("Failed to load portfolio items. Using default data.");
        setItems(initialPortfolioItems);
        
        toast({
          title: "Error Loading Data",
          description: "There was a problem loading your saved portfolio. Default items were loaded instead.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadItems();
  }, [storageAvailable, toast]);
  
  // Save items to localStorage whenever they change
  useEffect(() => {
    const saveToStorage = () => {
      if (!isLoading && items.length > 0 && storageAvailable) {
        try {
          // First, check if we're exceeding localStorage size limits
          const itemsJson = JSON.stringify(items);
          const sizeInMB = (new Blob([itemsJson]).size / 1024 / 1024).toFixed(2);
          
          if (parseFloat(sizeInMB) > 4.5) {
            // Getting close to the localStorage 5MB limit, warn the user
            console.warn(`Portfolio data is ${sizeInMB}MB, approaching localStorage limits`);
            toast({
              title: "Storage Warning",
              description: "Your portfolio data is getting large. Consider removing unused items."
            });
          }
          
          localStorage.setItem('portfolioItems', itemsJson);
          console.log(`Portfolio data (${sizeInMB}MB) saved successfully`);
        } catch (error) {
          console.error("Error saving portfolio items:", error);
          
          if (error instanceof DOMException && 
             (error.name === 'QuotaExceededError' || 
              error.name === 'NS_ERROR_DOM_QUOTA_REACHED')) {
            
            toast({
              title: "Storage Limit Reached",
              description: "Your browser's storage limit has been reached. Try removing some items or images.",
              variant: "destructive"
            });
          } else {
            toast({
              title: "Error Saving Data",
              description: "There was a problem saving your portfolio data to browser storage.",
              variant: "destructive"
            });
          }
          
          // Attempt to save minimal data without image data
          try {
            const minimalItems = items.map(item => ({
              ...item,
              coverImagePreview: undefined // Remove large preview data
            }));
            
            localStorage.setItem('portfolioItems', JSON.stringify(minimalItems));
            console.log("Saved minimal portfolio data without image previews");
          } catch (fallbackError) {
            console.error("Failed to save even minimal data:", fallbackError);
          }
        }
      }
    };
    
    saveToStorage();
  }, [items, isLoading, toast, storageAvailable]);
  
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
    errorMessage,
    storageAvailable
  };
}
