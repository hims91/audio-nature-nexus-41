import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { portfolioItems as initialPortfolioItems } from "@/data/portfolio";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Edit, Star, Save, CheckCircle2 } from "lucide-react";
import PortfolioGallery from "./portfolio/PortfolioGallery";
import PortfolioFilters from "./portfolio/PortfolioFilters";
const Portfolio: React.FC = () => {
  const [items, setItems] = useState(initialPortfolioItems);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [filteredItems, setFilteredItems] = useState(items);
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const {
    toast
  } = useToast();

  // Load items from localStorage on initial render
  useEffect(() => {
    try {
      const savedItems = localStorage.getItem('portfolioItems');
      if (savedItems) {
        console.log("📥 Portfolio component loading saved items");
        const parsedItems = JSON.parse(savedItems);
        setItems(parsedItems);
      }
    } catch (error) {
      console.error("❌ Error loading portfolio items in Portfolio component:", error);
      toast({
        title: "Error Loading Portfolio",
        description: "There was an issue loading your portfolio data. Using default data instead.",
        variant: "destructive"
      });
    }
  }, [toast]);

  // Filter items when category or items change
  useEffect(() => {
    if (!activeCategory || activeCategory === "All") {
      setFilteredItems(items);
    } else {
      setFilteredItems(items.filter(item => item.category === activeCategory));
    }
  }, [activeCategory, items]);

  // Verify localStorage function
  const verifyLocalStorage = () => {
    try {
      const savedItems = localStorage.getItem('portfolioItems');
      if (savedItems) {
        const parsedItems = JSON.parse(savedItems);
        console.log("✅ Verification successful: Found saved items", parsedItems);
        toast({
          title: "Storage Verification Success",
          description: `Found ${parsedItems.length} items saved in localStorage.`
        });
        setVerificationStatus('success');
      } else {
        console.warn("⚠️ No saved items found in localStorage");
        toast({
          title: "Storage Verification Warning",
          description: "No saved items found in localStorage.",
          variant: "destructive"
        });
        setVerificationStatus('error');
      }
    } catch (error) {
      console.error("❌ Storage verification failed:", error);
      toast({
        title: "Storage Verification Failed",
        description: "There was an error checking localStorage.",
        variant: "destructive"
      });
      setVerificationStatus('error');
    }

    // Reset status after 3 seconds
    setTimeout(() => {
      setVerificationStatus('idle');
    }, 3000);
  };

  // Get unique categories
  const categories = ["All", ...Array.from(new Set(items.map(item => item.category)))];
  return;
};
export default Portfolio;