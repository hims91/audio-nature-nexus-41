
import React from "react";
import { Button } from "@/components/ui/button";

interface PortfolioFiltersProps {
  categories: string[];
  activeCategory: string | null;
  setActiveCategory: (category: string | null) => void;
}

const PortfolioFilters: React.FC<PortfolioFiltersProps> = ({ 
  categories, 
  activeCategory, 
  setActiveCategory 
}) => {
  return (
    <div className="flex flex-wrap justify-center gap-2 mb-10">
      {categories.map((category) => (
        <Button
          key={category}
          variant={activeCategory === category || (category === "All" && !activeCategory) 
            ? "default" 
            : "outline"}
          className={
            activeCategory === category || (category === "All" && !activeCategory)
              ? "bg-nature-forest hover:bg-nature-leaf text-white"
              : "border-nature-forest text-nature-forest hover:bg-nature-forest/10"
          }
          onClick={() => setActiveCategory(category === "All" ? null : category)}
        >
          {category}
        </Button>
      ))}
    </div>
  );
};

export default PortfolioFilters;
