
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Music, FileImage, FileVideo } from "lucide-react";
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
  // Helper function to get the most relevant icon for an item
  const getItemIcon = (item: PortfolioItem) => {
    if (item.videoUrl) return <FileVideo className="mr-2 h-4 w-4" />;
    if (item.audioUrl) return <Music className="mr-2 h-4 w-4" />;
    if (item.imageUrl) return <FileImage className="mr-2 h-4 w-4" />;
    // Default icon if no media is available
    return <FileImage className="mr-2 h-4 w-4 opacity-50" />;
  };

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
              {getItemIcon(item)}
              {item.title}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PortfolioItemsList;
