
import React from "react";
import { Button } from "@/components/ui/button";

interface PortfolioFiltersProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const PortfolioFilters: React.FC<PortfolioFiltersProps> = ({
  categories,
  selectedCategory,
  onCategoryChange
}) => {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {categories.map((category) => (
        <Button
          key={category}
          variant={selectedCategory === category ? "default" : "outline"}
          size="sm"
          onClick={() => onCategoryChange(category)}
          className={`transition-all duration-300 transform hover:scale-105 ${
            selectedCategory === category 
              ? "bg-nature-forest hover:bg-nature-leaf" 
              : "hover:bg-nature-mist"
          }`}
        >
          {category}
        </Button>
      ))}
    </div>
  );
};

export default PortfolioFilters;
