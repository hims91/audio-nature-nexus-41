
import React from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { PortfolioItem } from "@/types/portfolio";
import { Music, Image, FileVideo } from "lucide-react";

interface PortfolioItemsListProps {
  items: PortfolioItem[];
  selectedId: string | null;
  onSelectItem: (id: string) => void;
}

const PortfolioItemsList: React.FC<PortfolioItemsListProps> = ({
  items,
  selectedId,
  onSelectItem
}) => {
  if (items.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p className="text-sm">No portfolio items yet.</p>
        <p className="text-xs mt-1">Create your first portfolio item to get started.</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-96">
      <div className="space-y-2">
        {items.map((item) => (
          <Button
            key={item.id}
            variant={selectedId === item.id ? "default" : "ghost"}
            className={`w-full justify-start text-left h-auto p-3 ${
              selectedId === item.id 
                ? "bg-nature-forest text-white" 
                : "hover:bg-gray-100"
            }`}
            onClick={() => onSelectItem(item.id)}
          >
            <div className="flex-1">
              <div className="font-medium text-sm truncate mb-1">
                {item.title}
              </div>
              <div className="text-xs opacity-75 truncate mb-2">
                {item.client}
              </div>
              <div className="flex items-center gap-1">
                <Badge 
                  variant="secondary" 
                  className="text-xs px-1.5 py-0.5"
                >
                  {item.category}
                </Badge>
              </div>
              <div className="flex items-center gap-2 mt-2">
                {item.cover_image_url && (
                  <Image className="h-3 w-3 opacity-60" />
                )}
                {item.audio_url && (
                  <Music className="h-3 w-3 opacity-60" />
                )}
                {item.video_url && (
                  <FileVideo className="h-3 w-3 opacity-60" />
                )}
              </div>
            </div>
          </Button>
        ))}
      </div>
    </ScrollArea>
  );
};

export default PortfolioItemsList;
