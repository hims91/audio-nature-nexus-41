
import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { portfolioItems as initialPortfolioItems, PortfolioItem } from "@/data/portfolio";
import { usePortfolioActions } from "./usePortfolioActions";
import { 
  checkStorageAvailability, 
  loadPortfolioItems, 
  savePortfolioItems, 
  verifyStorageData 
} from "./utils/storageUtils";
import { getStorageErrorType, getStorageErrorMessage, getStorageWarningMessage } from "./utils/storageErrors";

export function usePortfolioManager() {
  const { toast } = useToast();
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [storageAvailable, setStorageAvailable] = useState<boolean>(true);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  
  // Use the portfolio actions hook
  const { addItem, updateItem, deleteItem } = usePortfolioActions({ 
    items, 
    setItems, 
    toast 
  });
  
  // Check if localStorage is available
  useEffect(() => {
    const available = checkStorageAvailability();
    setStorageAvailable(available);
    
    if (available) {
      console.log("✅ localStorage is available");
    } else {
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
          console.log("⚠️ Storage unavailable, using initial data");
          setItems(initialPortfolioItems);
          return;
        }
        
        const loadedItems = loadPortfolioItems(initialPortfolioItems);
        setItems(loadedItems);
        setErrorMessage(null);
      } catch (error) {
        console.error("❌ Error loading portfolio items:", error);
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
    if (!isLoading && items.length > 0 && storageAvailable) {
      try {
        const { success, sizeInMB } = savePortfolioItems(items);
        
        if (success) {
          setLastSaved(new Date());
          
          // Check for storage warning
          const warningMessage = getStorageWarningMessage(sizeInMB);
          if (warningMessage) {
            toast(warningMessage);
          }
        }
      } catch (error) {
        const errorType = getStorageErrorType(error);
        const errorMessage = getStorageErrorMessage(errorType);
        toast(errorMessage);
      }
    }
  }, [items, isLoading, toast, storageAvailable]);
  
  // Verify localStorage function for testing
  const verifyStorage = () => {
    if (!storageAvailable) {
      console.error("❌ Cannot verify: localStorage is not available");
      return false;
    }
    
    const { success } = verifyStorageData();
    if (success) {
      console.log(`✅ Last save timestamp: ${lastSaved?.toLocaleTimeString() || 'Never'}`);
    }
    
    return success;
  };
  
  return {
    items,
    addItem,
    updateItem,
    deleteItem,
    isLoading,
    errorMessage,
    storageAvailable,
    verifyStorage,
    lastSaved
  };
}
