
import LZString from 'lz-string';

// Storage key for compressed portfolio data
export const STORAGE_KEY = 'compressedPortfolioItems';
// Previous storage key - for migration
export const LEGACY_STORAGE_KEY = 'portfolioItems';

// Helper function to compress data before saving
export const compressData = (data: any): string => {
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
export const decompressData = (compressedData: string): any => {
  try {
    const decompressed = LZString.decompressFromUTF16(compressedData);
    if (!decompressed) throw new Error("Decompression resulted in null/empty data");
    return JSON.parse(decompressed);
  } catch (error) {
    console.error("❌ Decompression error:", error);
    throw new Error("Failed to decompress data");
  }
};

// Check if localStorage is available
export const checkStorageAvailability = (): boolean => {
  try {
    const testKey = '__test_storage__';
    localStorage.setItem(testKey, testKey);
    localStorage.removeItem(testKey);
    console.log("✅ localStorage is available");
    return true;
  } catch (e) {
    console.error("❌ localStorage is not available:", e);
    return false;
  }
};

// Estimate storage size
export const calculateStorageSize = (): string => {
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
  console.log(`📊 Current storage usage: ${sizeMB}MB`);
  return sizeMB;
};

// Migration from old storage format
export const migrateFromLegacyStorage = (): any[] | null => {
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
