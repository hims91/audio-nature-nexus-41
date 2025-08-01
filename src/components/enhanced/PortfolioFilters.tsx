
import React from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

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
    <div className="w-full">
      {/* Mobile: Horizontal scrollable filters */}
      <div className="block sm:hidden">
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex space-x-2 p-1 min-w-max">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => onCategoryChange(category)}
                className={`transition-all duration-300 whitespace-nowrap shrink-0 ${
                  selectedCategory === category 
                    ? "bg-nature-forest hover:bg-nature-leaf text-white" 
                    : "hover:bg-nature-mist text-nature-forest border-nature-forest"
                }`}
              >
                {category}
              </Button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Desktop: Centered flex wrap */}
      <div className="hidden sm:flex flex-wrap gap-2 justify-center">
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
    </div>
  );
};

export default PortfolioFilters;
