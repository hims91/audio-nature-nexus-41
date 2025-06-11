
import { PortfolioItem } from "@/data/portfolio";

export const checkStorageAvailability = (): boolean => {
  try {
    const testKey = '__test_storage__';
    localStorage.setItem(testKey, testKey);
    localStorage.removeItem(testKey);
    return true;
  } catch (e) {
    console.error("❌ localStorage is not available:", e);
    return false;
  }
};

export const loadPortfolioItems = (initialItems: PortfolioItem[]): PortfolioItem[] => {
  try {
    const savedItems = localStorage.getItem('portfolioItems');
    
    if (!savedItems) {
      console.log("ℹ️ No saved portfolio items found, using initial data");
      return initialItems;
    }

    const parsedItems = JSON.parse(savedItems);
    
    if (!Array.isArray(parsedItems)) {
      throw new Error("Saved data is not in the expected format");
    }

    const validItems = parsedItems.filter(item => 
      item && 
      typeof item === 'object' && 
      item.id && 
      item.title && 
      item.category
    );
    
    if (validItems.length !== parsedItems.length) {
      console.warn("⚠️ Some portfolio items were invalid and filtered out");
    }
    
    console.log(`📥 Loaded ${validItems.length} portfolio items from localStorage`);
    return validItems;
  } catch (parseError) {
    console.error("❌ Error parsing saved portfolio items:", parseError);
    throw new Error("Could not parse saved data");
  }
};

export const savePortfolioItems = (items: PortfolioItem[]): { success: boolean; sizeInMB: string } => {
  try {
    const itemsJson = JSON.stringify(items);
    const sizeInMB = (new Blob([itemsJson]).size / 1024 / 1024).toFixed(2);
    
    if (parseFloat(sizeInMB) > 4.5) {
      console.warn(`⚠️ Portfolio data is ${sizeInMB}MB, approaching localStorage limits`);
    }
    
    localStorage.setItem('portfolioItems', itemsJson);
    const now = new Date();
    console.log(`💾 Portfolio data (${sizeInMB}MB) saved successfully at ${now.toLocaleTimeString()}`);
    console.log(`📊 Saved ${items.length} items with IDs: ${items.map(i => i.id).join(', ')}`);
    
    return { success: true, sizeInMB };
  } catch (error) {
    console.error("❌ Error saving portfolio items:", error);
    
    // Attempt to save minimal data without image data
    try {
      const minimalItems = items.map(item => ({
        ...item,
        coverImagePreview: undefined
      }));
      
      localStorage.setItem('portfolioItems', JSON.stringify(minimalItems));
      console.log("⚠️ Saved minimal portfolio data without image previews");
      return { success: false, sizeInMB: "0" };
    } catch (fallbackError) {
      console.error("❌ Failed to save even minimal data:", fallbackError);
      throw error;
    }
  }
};

export const verifyStorageData = (): { success: boolean; itemCount?: number } => {
  try {
    const savedItems = localStorage.getItem('portfolioItems');
    if (!savedItems) {
      console.warn("⚠️ No items found in localStorage");
      return { success: false };
    }
    
    const parsedItems = JSON.parse(savedItems);
    console.log(`✅ Storage verification: ${parsedItems.length} items found in localStorage`);
    return { success: true, itemCount: parsedItems.length };
  } catch (error) {
    console.error("❌ Storage verification failed:", error);
    return { success: false };
  }
};
