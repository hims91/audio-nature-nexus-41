
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Music } from "lucide-react";
import { PortfolioItem } from "@/data/portfolio";

interface PortfolioItemsListProps {
  items: PortfolioItem[];
  currentItemId?: number;
  onSelectItem: (item: PortfolioItem) => void;
}

const PortfolioItemsList: React.FC<PortfolioItemsListProps> = ({ 
  items, 
  currentItemId, 
  onSelectItem 
}) => {
  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-4 text-nature-forest">Portfolio Items</h2>
        <div className="space-y-2">
          {items.map(item => (
            <Button
              key={item.id}
              variant="outline"
              className={`w-full justify-start ${
                currentItemId === item.id ? 'bg-nature-forest text-white' : ''
              }`}
              onClick={() => onSelectItem(item)}
            >
              <Music className="mr-2 h-4 w-4" />
              {item.title}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PortfolioItemsList;
