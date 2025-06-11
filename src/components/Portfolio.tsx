import React, { useState, useEffect } from "react";
import { portfolioItems as initialPortfolioItems } from "@/data/portfolio";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Save, CheckCircle2 } from "lucide-react";
import PortfolioGallery from "./portfolio/PortfolioGallery";
import PortfolioFilters from "./portfolio/PortfolioFilters";

const Portfolio: React.FC = () => {
  const [items, setItems] = useState(initialPortfolioItems);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [filteredItems, setFilteredItems] = useState(items);
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const { toast } = useToast();

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

  return (
    <section id="portfolio" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-nature-forest mb-4">Portfolio</h2>
          <p className="text-lg text-nature-bark max-w-3xl mx-auto">
            Explore my work in audio engineering and sound design across various mediums and industries
          </p>
        </div>

        <div className="mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Category Filters */}
          <PortfolioFilters 
            categories={categories} 
            activeCategory={activeCategory} 
            onSelectCategory={setActiveCategory}
          />
          
          {/* Admin Actions (only visible to admin) */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className={`flex items-center gap-2 ${
                verificationStatus === 'success' 
                  ? 'border-green-500 text-green-500' 
                  : verificationStatus === 'error'
                    ? 'border-red-500 text-red-500' 
                    : 'border-nature-bark text-nature-bark'
              }`}
              onClick={verifyLocalStorage}
            >
              {verificationStatus === 'success' ? (
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Verify Storage
            </Button>
          </div>
        </div>

        {/* Portfolio Items */}
        <div className="pb-8">
          {filteredItems.length > 0 ? (
            <PortfolioGallery items={filteredItems} featured={false} />
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-nature-bark">No portfolio items found in this category.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
