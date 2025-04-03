
import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { portfolioItems as initialPortfolioItems, PortfolioItem } from "@/data/portfolio";
import { usePortfolioCrud } from './usePortfolioCrud';
import { useDataManagement } from './useDataManagement';
import { 
  STORAGE_KEY, 
  checkStorageAvailability, 
  compressData, 
  decompressData,
  calculateStorageSize,
  migrateFromLegacyStorage
} from '../utils/storageUtils';
import { prepareItemsForStorage, validatePortfolioItems } from '../utils/itemUtils';

export function usePortfolioManager() {
  const { toast } = useToast();
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [storageAvailable, setStorageAvailable] = useState<boolean>(true);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [storageUsage, setStorageUsage] = useState<string>('0');
  
  // Initialize CRUD operations
  const { addItem, updateItem, deleteItem } = usePortfolioCrud(items, setItems);
  
  // Initialize data management operations
  const { exportData, importData, clearStorage, verifyStorage } = useDataManagement(items, setItems);
  
  // Check if localStorage is available
  useEffect(() => {
    const isAvailable = checkStorageAvailability();
    setStorageAvailable(isAvailable);
    
    if (!isAvailable) {
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
          try {
            const validItems = validatePortfolioItems(portfolioData);
            
            if (validItems.length !== portfolioData.length) {
              console.warn("⚠️ Some portfolio items were invalid and filtered out");
              toast({
                title: "Data Warning",
                description: "Some saved portfolio items were corrupted and have been removed."
              });
            }
            
            console.log(`📥 Loaded ${validItems.length} portfolio items from storage`);
            setItems(validItems);
          } catch (validationError) {
            throw new Error("Saved data is not in the expected format");
          }
        } else {
          console.log("ℹ️ No saved portfolio items found, using initial data");
          setItems(initialPortfolioItems);
        }
        
        setErrorMessage(null);
        const currentStorageUsage = calculateStorageSize();
        setStorageUsage(currentStorageUsage);
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
          const currentStorageUsage = calculateStorageSize();
          setStorageUsage(currentStorageUsage);
          
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
