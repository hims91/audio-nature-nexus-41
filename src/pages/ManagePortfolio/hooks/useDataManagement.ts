
import { useToast } from "@/hooks/use-toast";
import { PortfolioItem } from "@/data/portfolio";
import { validatePortfolioItems } from "../utils/itemUtils";
import { STORAGE_KEY, LEGACY_STORAGE_KEY, calculateStorageSize } from "../utils/storageUtils";

export const useDataManagement = (
  items: PortfolioItem[],
  setItems: React.Dispatch<React.SetStateAction<PortfolioItem[]>>,
) => {
  const { toast } = useToast();

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
      
      // Basic validation
      const validItems = validatePortfolioItems(importedItems);
      
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

  // Verify localStorage function for testing
  const verifyStorage = () => {
    try {
      console.log(`✅ Storage verification: ${items.length} items in state`);
      console.log(`✅ Current storage usage: ${calculateStorageSize()}MB`);
      return true;
    } catch (error) {
      console.error("❌ Storage verification failed:", error);
      return false;
    }
  };

  return {
    exportData,
    importData,
    clearStorage,
    verifyStorage
  };
};
