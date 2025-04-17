
import React from "react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface PortfolioFiltersProps {
  categories: string[];
  activeCategory: string | null;
  onSelectCategory: (category: string) => void;
}

const PortfolioFilters: React.FC<PortfolioFiltersProps> = ({ 
  categories, 
  activeCategory, 
  onSelectCategory 
}) => {
  return (
    <div className="w-full md:w-auto">
      <ScrollArea className="w-full whitespace-nowrap pb-3">
        <div className="flex gap-2">
          {categories.map((category) => (
            <Badge 
              key={category} 
              variant="outline"
              className={`cursor-pointer py-1.5 px-3 text-sm transition-all ${
                activeCategory === category
                  ? 'bg-nature-forest text-white hover:bg-nature-forest/90'
                  : 'bg-white hover:bg-gray-100'
              }`}
              onClick={() => onSelectCategory(category)}
            >
              {category}
            </Badge>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default PortfolioFilters;
