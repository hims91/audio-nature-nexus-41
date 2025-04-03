
import { PortfolioItem } from "@/data/portfolio";

// Clean item before storage by removing large preview data
export const cleanItemForStorage = (item: PortfolioItem): PortfolioItem => {
  const { coverImagePreview, ...cleanedItem } = item;
  return cleanedItem as PortfolioItem;
};

// Clean all items for storage
export const prepareItemsForStorage = (items: PortfolioItem[]): PortfolioItem[] => {
  return items.map(cleanItemForStorage);
};

// Basic validation of portfolio items
export const validatePortfolioItems = (items: any[]): PortfolioItem[] => {
  if (!Array.isArray(items)) {
    throw new Error("Imported data is not a valid portfolio array");
  }
  
  const validItems = items.filter(item => 
    item && 
    typeof item === 'object' && 
    item.id && 
    item.title && 
    item.category
  );
  
  if (validItems.length === 0) {
    throw new Error("No valid portfolio items found in import data");
  }
  
  return validItems as PortfolioItem[];
};
