
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { type PortfolioItem } from "@/types/portfolio";
import PortfolioItemsList from "./PortfolioItemsList";

interface PortfolioSidebarProps {
  portfolioItems: PortfolioItem[];
  selectedItem: PortfolioItem | null;
  onSelectItem: (id: string) => void;
  isCreating: boolean;
}

const PortfolioSidebar: React.FC<PortfolioSidebarProps> = ({
  portfolioItems,
  selectedItem,
  onSelectItem,
  isCreating
}) => {
  const navigate = useNavigate();

  return (
    <div className="md:col-span-1">
      <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
        <PortfolioItemsList 
          items={portfolioItems} 
          selectedId={selectedItem?.id || null}
          onSelectItem={onSelectItem} 
        />
      </div>
      
      <div className="text-center mt-4">
        <Button
          onClick={() => navigate('/')}
          variant="outline"
          className="border-nature-forest text-nature-forest hover:bg-nature-forest hover:text-white"
        >
          Return to Homepage
        </Button>
      </div>
    </div>
  );
};

export default PortfolioSidebar;
