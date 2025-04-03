
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { portfolioItems as initialPortfolioItems } from "@/data/portfolio";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Edit, Star } from "lucide-react";
import PortfolioGallery from "./portfolio/PortfolioGallery";
import PortfolioFilters from "./portfolio/PortfolioFilters";

const Portfolio: React.FC = () => {
  const [items, setItems] = useState(initialPortfolioItems);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [filteredItems, setFilteredItems] = useState(items);
  const { toast } = useToast();
  
  // Load items from localStorage on initial render
  useEffect(() => {
    try {
      const savedItems = localStorage.getItem('portfolioItems');
      if (savedItems) {
        const parsedItems = JSON.parse(savedItems);
        setItems(parsedItems);
      }
    } catch (error) {
      console.error("Error loading portfolio items:", error);
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

  // Get unique categories
  const categories = ["All", ...Array.from(new Set(items.map(item => item.category)))];
  
  return (
    <section id="portfolio" className="py-20 bg-nature-cream/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-nature-forest mb-4">Portfolio</h2>
          <p className="text-lg text-nature-bark max-w-3xl mx-auto">
            Explore my work across audio disciplines including Mixing & Mastering, Sound Design, 
            Podcasting, Sound for Picture, and Dolby Atmos
          </p>
          <div className="w-20 h-1 bg-nature-forest mx-auto mt-4"></div>
          
          <Link to="/manage-portfolio" className="inline-flex items-center mt-6 text-nature-forest hover:text-nature-leaf transition-colors">
            <Edit className="mr-1 h-4 w-4" />
            Manage Portfolio
          </Link>
        </div>
        
        {/* Category Filters */}
        <PortfolioFilters 
          categories={categories}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
        />
        
        {/* Featured Items Section (only on "All" view) */}
        {(!activeCategory || activeCategory === "All") && (
          <div className="mb-12">
            <div className="flex items-center mb-6">
              <Star className="h-5 w-5 text-amber-500 mr-2" />
              <h3 className="text-xl font-semibold text-nature-forest">Featured Work</h3>
            </div>
            <PortfolioGallery 
              items={filteredItems.filter(item => item.featured)}
              featured={true}
            />
          </div>
        )}
        
        {/* Main Portfolio Gallery */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-nature-forest mb-6">
            {activeCategory && activeCategory !== "All" 
              ? activeCategory 
              : "All Projects"}
          </h3>
          
          {filteredItems.length > 0 ? (
            <PortfolioGallery 
              items={activeCategory && activeCategory !== "All" 
                ? filteredItems 
                : filteredItems.filter(item => !item.featured)}
              featured={false}
            />
          ) : (
            <div className="text-center py-16 bg-white/50 rounded-lg">
              <p className="text-lg text-nature-bark">No portfolio items found for this category.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
