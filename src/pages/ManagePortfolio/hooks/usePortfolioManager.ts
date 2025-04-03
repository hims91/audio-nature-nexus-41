
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from "@/hooks/use-toast";
import { portfolioItems as initialPortfolioItems, PortfolioItem } from "@/data/portfolio";
import LZString from 'lz-string';

// Storage key for compressed portfolio data
const STORAGE_KEY = 'compressedPortfolioItems';
// Previous storage key - for migration
const LEGACY_STORAGE_KEY = 'portfolioItems';

export function usePortfolioManager() {
  const { toast } = useToast();
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [storageAvailable, setStorageAvailable] = useState<boolean>(true);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [storageUsage, setStorageUsage] = useState<string>('0');
  
  // Check if localStorage is available
  useEffect(() => {
    try {
      const testKey = '__test_storage__';
      localStorage.setItem(testKey, testKey);
      localStorage.removeItem(testKey);
      setStorageAvailable(true);
      console.log("✅ localStorage is available");
    } catch (e) {
      console.error("❌ localStorage is not available:", e);
      setStorageAvailable(false);
      toast({
        title: "Storage Warning",
        description: "Local storage is not available. Your changes won't persist after closing the browser.",
        variant: "destructive"
      });
    }
  }, [toast]);
  
  // Helper function to compress data before saving
  const compressData = (data: any): string => {
    try {
      const jsonString = JSON.stringify(data);
      const compressed = LZString.compressToUTF16(jsonString);
      console.log(`🗜️ Compressed data: ${(jsonString.length / 1024).toFixed(2)}KB → ${(compressed.length / 1024).toFixed(2)}KB`);
      return compressed;
    } catch (error) {
      console.error("❌ Compression error:", error);
      throw new Error("Failed to compress data");
    }
  };
  
  // Helper function to decompress saved data
  const decompressData = (compressedData: string): any => {
    try {
      const decompressed = LZString.decompressFromUTF16(compressedData);
      if (!decompressed) throw new Error("Decompression resulted in null/empty data");
      return JSON.parse(decompressed);
    } catch (error) {
      console.error("❌ Decompression error:", error);
      throw new Error("Failed to decompress data");
    }
  };
  
  // Clean item before storage by removing large preview data
  const cleanItemForStorage = (item: PortfolioItem): PortfolioItem => {
    const { coverImagePreview, ...cleanedItem } = item;
    return cleanedItem as PortfolioItem;
  };
  
  // Clean all items for storage
  const prepareItemsForStorage = (items: PortfolioItem[]): PortfolioItem[] => {
    return items.map(cleanItemForStorage);
  };
  
  // Estimate storage size
  const calculateStorageSize = (): void => {
    let total = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        const value = localStorage.getItem(key) || '';
        total += key.length + value.length;
      }
    }
    // Size in MB
    const sizeMB = (total * 2 / 1024 / 1024).toFixed(2);
    setStorageUsage(sizeMB);
    console.log(`📊 Current storage usage: ${sizeMB}MB`);
  };
  
  // Migration from old storage format
  const migrateFromLegacyStorage = (): PortfolioItem[] | null => {
    try {
      const legacyData = localStorage.getItem(LEGACY_STORAGE_KEY);
      if (legacyData) {
        console.log("🔄 Migrating from legacy storage format");
        const parsedItems = JSON.parse(legacyData);
        if (Array.isArray(parsedItems)) {
          // Remove legacy storage to free up space
          localStorage.removeItem(LEGACY_STORAGE_KEY);
          return parsedItems;
        }
      }
      return null;
    } catch (error) {
      console.error("❌ Error migrating from legacy storage:", error);
      return null;
    }
  };
  
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
        
        // First try to get compressed data
        const compressedData = localStorage.getItem(STORAGE_KEY);
        
        let portfolioData: PortfolioItem[] | null = null;
        
        if (compressedData) {
          try {
            // Try to load compressed data
            portfolioData = decompressData(compressedData);
            console.log("🔍 Found compressed portfolio data");
          } catch (decompressError) {
            console.error("❌ Error decompressing data:", decompressError);
          }
        } else {
          // Check for legacy data for migration
          portfolioData = migrateFromLegacyStorage();
        }
        
        if (portfolioData) {
          // Basic validation of required fields
          if (Array.isArray(portfolioData)) {
            const validItems = portfolioData.filter(item => 
              item && 
              typeof item === 'object' && 
              item.id && 
              item.title && 
              item.category
            );
            
            if (validItems.length !== portfolioData.length) {
              console.warn("⚠️ Some portfolio items were invalid and filtered out");
              toast({
                title: "Data Warning",
                description: "Some saved portfolio items were corrupted and have been removed."
              });
            }
            
            console.log(`📥 Loaded ${validItems.length} portfolio items from storage`);
            setItems(validItems);
          } else {
            throw new Error("Saved data is not in the expected format");
          }
        } else {
          console.log("ℹ️ No saved portfolio items found, using initial data");
          setItems(initialPortfolioItems);
        }
        
        setErrorMessage(null);
        calculateStorageSize();
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
    const saveToStorage = () => {
      if (!isLoading && items.length > 0 && storageAvailable) {
        try {
          // Clean items before storage to reduce size
          const cleanedItems = prepareItemsForStorage(items);
          
          // Compress the data
          const compressed = compressData(cleanedItems);
          
          // Save compressed data
          localStorage.setItem(STORAGE_KEY, compressed);
          
          // Update timestamp and calculate storage
          const now = new Date();
          setLastSaved(now);
          calculateStorageSize();
          
          console.log(`💾 Portfolio data saved successfully at ${now.toLocaleTimeString()}`);
          console.log(`📊 Saved ${items.length} items with IDs: ${items.slice(0, 3).map(i => i.id).join(', ')}${items.length > 3 ? '...' : ''}`);
        } catch (error) {
          console.error("❌ Error saving portfolio items:", error);
          
          if (error instanceof DOMException && 
             (error.name === 'QuotaExceededError' || 
              error.name === 'NS_ERROR_DOM_QUOTA_REACHED')) {
            
            toast({
              title: "Storage Limit Reached",
              description: "Your browser's storage limit has been reached. Try removing some items or export your data.",
              variant: "destructive"
            });
            
            // Try aggressive cleanup to save at least the item metadata
            try {
              const minimalItems = items.map(item => ({
                id: item.id,
                title: item.title,
                category: item.category,
                client: item.client,
                description: item.description?.substring(0, 100), // Truncate description
                featured: item.featured,
                createdAt: item.createdAt,
                externalLinks: item.externalLinks,
                coverImageUrl: item.coverImageUrl,
                // Remove all other large data
              }));
              
              const compressed = compressData(minimalItems);
              localStorage.setItem(STORAGE_KEY, compressed);
              console.log("⚠️ Saved minimal portfolio data (emergency mode)");
            } catch (fallbackError) {
              console.error("❌ Failed to save even minimal data:", fallbackError);
            }
          } else {
            toast({
              title: "Error Saving Data",
              description: "There was a problem saving your portfolio data to browser storage.",
              variant: "destructive"
            });
          }
        }
      }
    };
    
    saveToStorage();
  }, [items, isLoading, toast, storageAvailable]);
  
  // Export portfolio data to JSON file
  const exportData = () => {
    try {
      const dataStr = JSON.stringify(items, null, 2);
      const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
      
      const exportFileDefaultName = `portfolio-export-${new Date().toISOString().slice(0, 10)}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      
      toast({
        title: "Export Successful",
        description: "Your portfolio data has been exported."
      });
      
      return true;
    } catch (error) {
      console.error("❌ Export error:", error);
      toast({
        title: "Export Failed",
        description: "There was an error exporting your portfolio data.",
        variant: "destructive"
      });
      return false;
    }
  };
  
  // Import portfolio data from JSON file
  const importData = (jsonData: string) => {
    try {
      const importedItems = JSON.parse(jsonData);
      
      if (!Array.isArray(importedItems)) {
        throw new Error("Imported data is not a valid portfolio array");
      }
      
      // Basic validation
      const validItems = importedItems.filter(item => 
        item && 
        typeof item === 'object' && 
        item.id && 
        item.title && 
        item.category
      );
      
      if (validItems.length === 0) {
        throw new Error("No valid portfolio items found in import data");
      }
      
      // Set the imported items
      setItems(validItems);
      
      toast({
        title: "Import Successful",
        description: `Imported ${validItems.length} portfolio items.`
      });
      
      return true;
    } catch (error) {
      console.error("❌ Import error:", error);
      toast({
        title: "Import Failed",
        description: "The selected file doesn't contain valid portfolio data.",
        variant: "destructive"
      });
      return false;
    }
  };
  
  // Clear all storage (for troubleshooting)
  const clearStorage = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(LEGACY_STORAGE_KEY);
      calculateStorageSize();
      console.log("🧹 Storage cleared");
      
      toast({
        title: "Storage Cleared",
        description: "All portfolio data has been removed from browser storage."
      });
      
      return true;
    } catch (error) {
      console.error("❌ Error clearing storage:", error);
      return false;
    }
  };
  
  // Add a new portfolio item
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
  
  // Update an existing portfolio item
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
  
  // Delete a portfolio item
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
  
  // Verify localStorage function for testing
  const verifyStorage = () => {
    if (!storageAvailable) {
      console.error("❌ Cannot verify: localStorage is not available");
      return false;
    }
    
    try {
      const compressedData = localStorage.getItem(STORAGE_KEY);
      if (!compressedData) {
        console.warn("⚠️ No compressed items found in localStorage");
        
        // Check legacy storage
        const legacyData = localStorage.getItem(LEGACY_STORAGE_KEY);
        if (legacyData) {
          console.log("ℹ️ Legacy data exists but not compressed data");
          return false;
        }
        
        return false;
      }
      
      // Try to decompress and validate
      const decompressed = decompressData(compressedData);
      console.log(`✅ Storage verification: ${decompressed.length} items found in compressed storage`);
      console.log(`✅ Last save timestamp: ${lastSaved?.toLocaleTimeString() || 'Never'}`);
      console.log(`✅ Current storage usage: ${storageUsage}MB`);
      return true;
    } catch (error) {
      console.error("❌ Storage verification failed:", error);
      return false;
    }
  };
  
  return {
    items,
    addItem,
    updateItem,
    deleteItem,
    isLoading,
    errorMessage,
    storageAvailable,
    storageUsage,
    verifyStorage,
    lastSaved,
    exportData,
    importData,
    clearStorage
  };
}
