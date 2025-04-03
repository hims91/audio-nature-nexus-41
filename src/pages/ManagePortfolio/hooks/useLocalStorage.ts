
import { useState } from 'react';
import { PortfolioItem, portfolioItems as initialPortfolioItems } from "@/data/portfolio";
import { useToast } from "@/hooks/use-toast";

export const useLocalStorage = () => {
  const { toast } = useToast();
  
  // Load items from localStorage or use initial data
  const [items, setItems] = useState<PortfolioItem[]>(() => {
    try {
      const savedItems = localStorage.getItem('portfolioItems');
      return savedItems ? JSON.parse(savedItems) : initialPortfolioItems;
    } catch (error) {
      console.error("Error loading portfolio items:", error);
      return initialPortfolioItems;
    }
  });
  
  const saveItems = (itemsToSave: PortfolioItem[]) => {
    try {
      // Create a storage-safe version of items
      const storageSafeItems = itemsToSave.map(item => {
        const safeItem = {
          ...item,
          imageUrl: item.imageUrl,
          imagePreviewUrl: item.imagePreviewUrl || null
        };
        return safeItem;
      });
      
      // Try to save complete data first
      const jsonData = JSON.stringify(storageSafeItems);
      const sizeInMB = (new Blob([jsonData]).size / 1024 / 1024).toFixed(2);
      
      // Increased localStorage size threshold from 4.5MB to 9MB
      if (parseFloat(sizeInMB) > 9) {
        // If too large, create a smaller version without image previews
        const minimalSafeItems = itemsToSave.map(item => ({
          ...item,
          imagePreviewUrl: null, // Remove image previews to save space
        }));
        
        const minimalJsonData = JSON.stringify(minimalSafeItems);
        const minimalSizeInMB = (new Blob([minimalJsonData]).size / 1024 / 1024).toFixed(2);
        
        if (parseFloat(minimalSizeInMB) > 9) {
          throw new Error(`Data size (${minimalSizeInMB}MB) still exceeds safe localStorage limit even after compression`);
        }
        
        localStorage.setItem('portfolioItems', minimalJsonData);
        
        toast({
          title: "Storage Optimization",
          description: "Your portfolio data was too large for browser storage. Image previews won't persist after refresh, but all other data is saved.",
        });
      } else {
        // If size is acceptable, save the complete data
        localStorage.setItem('portfolioItems', jsonData);
      }
    } catch (error) {
      console.error("Error saving portfolio items to localStorage:", error);
      
      try {
        // Last resort: Save only essential data (no previews or binary data)
        const essentialData = items.map(item => ({
          id: item.id,
          title: item.title,
          client: item.client,
          category: item.category,
          description: item.description,
          imageUrl: item.imageUrl, // Keep path reference but not preview
          audioUrl: item.audioUrl,
          videoUrl: item.videoUrl,
          spotifyUrl: item.spotifyUrl,
          otherLinks: item.otherLinks
        }));
        
        localStorage.setItem('portfolioItems', JSON.stringify(essentialData));
        
        toast({
          title: "Limited Storage Available",
          description: "Your portfolio data was saved without preview images due to browser storage limitations.",
        });
      } catch (finalError) {
        toast({
          title: "Storage Error",
          description: "Unable to save your portfolio changes to browser storage. Your changes will be visible now but won't persist after refresh.",
          variant: "destructive"
        });
      }
    }
  };
  
  return { items, setItems, saveItems };
};
