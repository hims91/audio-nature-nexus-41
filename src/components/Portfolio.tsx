
import React, { useState, useEffect } from "react";
import PortfolioItem from "./PortfolioItem";
import { portfolioItems as initialPortfolioItems } from "@/data/portfolio";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const Portfolio: React.FC = () => {
  const [filter, setFilter] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Load items from localStorage or use initial data
  const [portfolioItems, setPortfolioItems] = useState(initialPortfolioItems);
  
  useEffect(() => {
    try {
      const savedItems = localStorage.getItem('portfolioItems');
      if (savedItems) {
        const parsedItems = JSON.parse(savedItems);
        
        // Process saved items to properly handle image URLs
        const processedItems = parsedItems.map((item: any) => {
          // If the item has an imagePreviewUrl, use that for display
          if (item.imagePreviewUrl) {
            return {
              ...item,
              imageUrl: item.imagePreviewUrl
            };
          }
          return item;
        });
        
        setPortfolioItems(processedItems);
      }
    } catch (error) {
      console.error("Error loading portfolio items from localStorage:", error);
      toast({
        title: "Error Loading Portfolio",
        description: "There was an issue loading your portfolio data. Using default data instead.",
        variant: "destructive"
      });
    }
  }, [toast]);
  
  const categories = ["All", ...new Set(portfolioItems.map(item => item.category))];
  
  const filteredItems = filter && filter !== "All"
    ? portfolioItems.filter(item => item.category === filter)
    : portfolioItems;
  
  return (
    <section id="portfolio" className="py-20 bg-nature-cream/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-nature-forest mb-4">Portfolio</h2>
          <p className="text-lg text-nature-bark max-w-3xl mx-auto">
            Explore selected works showcasing my expertise across various audio disciplines
          </p>
          <div className="w-20 h-1 bg-nature-forest mx-auto mt-4"></div>
        </div>
        
        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map((category) => (
            <Button
              key={category}
              variant={filter === category || (category === "All" && !filter) ? "default" : "outline"}
              className={
                filter === category || (category === "All" && !filter)
                  ? "bg-nature-forest hover:bg-nature-leaf text-white"
                  : "border-nature-forest text-nature-forest hover:bg-nature-forest hover:text-white"
              }
              onClick={() => setFilter(category === "All" ? null : category)}
            >
              {category}
            </Button>
          ))}
        </div>
        
        {/* Portfolio Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {filteredItems.map((item) => (
            <PortfolioItem key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
