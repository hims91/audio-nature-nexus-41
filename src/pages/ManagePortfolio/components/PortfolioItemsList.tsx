
import React from "react";
import { PortfolioItem } from "@/data/portfolio";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Music, 
  FileVideo, 
  Image as ImageIcon,
  Star,
  ExternalLink
} from "lucide-react";

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
      <div className="text-center py-6 text-nature-bark">
        No portfolio items yet.
      </div>
    );
  }

  return (
    <ScrollArea className="h-[60vh]">
      <div className="space-y-2 pr-4">
        {items.map(item => (
          <Button
            key={item.id}
            variant="outline"
            className={`w-full justify-start items-start text-left h-auto py-3 ${
              selectedId === item.id ? 'bg-nature-forest/10 border-nature-forest' : ''
            }`}
            onClick={() => onSelectItem(item.id)}
          >
            <div className="flex w-full">
              {/* Thumbnail */}
              {item.coverImageUrl && (
                <div className="w-16 h-16 mr-3 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                  <img 
                    src={item.coverImagePreview || item.coverImageUrl} 
                    alt={item.title} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.svg";
                      e.currentTarget.className = "w-full h-full object-contain p-1";
                    }}
                  />
                </div>
              )}
              
              {/* Item details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-1">
                  <span className="font-medium text-nature-forest truncate pr-2">
                    {item.title}
                  </span>
                  {item.featured && (
                    <Star className="h-3.5 w-3.5 text-amber-500 flex-shrink-0" />
                  )}
                </div>
                
                <div className="text-xs text-nature-bark truncate mb-1.5">
                  {item.client}
                </div>
                
                <div className="flex flex-wrap gap-1">
                  <Badge variant="outline" className="text-[0.65rem] px-1.5 py-0 h-auto">
                    {item.category}
                  </Badge>
                  
                  {item.audioUrl && (
                    <Badge variant="outline" className="text-[0.65rem] px-1 py-0 h-auto">
                      <Music className="h-2.5 w-2.5 mr-0.5" />
                    </Badge>
                  )}
                  
                  {item.videoUrl && (
                    <Badge variant="outline" className="text-[0.65rem] px-1 py-0 h-auto">
                      <FileVideo className="h-2.5 w-2.5 mr-0.5" />
                    </Badge>
                  )}
                  
                  {item.externalLinks && item.externalLinks.length > 0 && (
                    <Badge variant="outline" className="text-[0.65rem] px-1 py-0 h-auto">
                      <ExternalLink className="h-2.5 w-2.5 mr-0.5" />
                      {item.externalLinks.length}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </Button>
        ))}
      </div>
    </ScrollArea>
  );
};

export default PortfolioItemsList;
