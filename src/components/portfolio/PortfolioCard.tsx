
import React, { useState } from "react";
import { type PortfolioItem } from "@/types/portfolio";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import PortfolioItemDetail from "./PortfolioItemDetail";
import AudioPreview from "./AudioPreview";
import VideoPreview from "./VideoPreview";
import ExternalLinks from "./ExternalLinks";
import MediaPreview from "./MediaPreview";
import { Star } from "lucide-react";

interface PortfolioCardProps {
  item: PortfolioItem;
}

const PortfolioCard: React.FC<PortfolioCardProps> = ({ item }) => {
  const [detailOpen, setDetailOpen] = useState(false);
  
  const hasValidMedia = (url?: string) => {
    const isValid = url && url.trim() !== '' && url !== 'undefined' && url !== 'null';
    console.log(`🔍 Media validation for "${url}":`, isValid);
    return isValid;
  };

  const getEncodedUrl = (url?: string) => {
    if (!url) return "";
    return url.startsWith("http") ? url : encodeURI(url);
  };

  return (
    <>
      <Card className="overflow-hidden group hover:shadow-lg transition-all duration-300 h-full flex flex-col">
        <div className="relative h-48 overflow-hidden bg-gray-100">
          {/* Featured Badge */}
          {item.featured && (
            <div className="absolute top-2 left-2 z-10">
              <Badge className="bg-amber-500 hover:bg-amber-600">
                <Star className="h-3 w-3 mr-1" /> Featured
              </Badge>
            </div>
          )}
          
          {/* Category Badge */}
          <Badge 
            className="absolute top-2 right-2 z-10 bg-nature-forest text-white hover:bg-nature-leaf"
          >
            {item.category}
          </Badge>
          
          {/* Cover Image */}
          {hasValidMedia(item.coverImageUrl) && (
            <img 
              src={item.coverImagePreview || getEncodedUrl(item.coverImageUrl)} 
              alt={item.title} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              onError={(e) => {
                console.error("Error loading image:", item.coverImageUrl);
                e.currentTarget.src = "/placeholder.svg";
                e.currentTarget.className = "w-full h-full object-contain p-4";
              }}
            />
          )}
          
          {/* Preview Button */}
          <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
            <DialogTrigger asChild>
              <Button 
                className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/90 text-nature-forest hover:bg-white transition-opacity opacity-0 group-hover:opacity-100"
                size="sm"
              >
                View Details
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl p-0 overflow-hidden">
              <PortfolioItemDetail item={item} onClose={() => setDetailOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
        
        <CardContent className="p-4 flex-grow flex flex-col">
          <h3 className="text-lg font-semibold text-nature-forest mb-1">{item.title}</h3>
          <p className="text-sm text-nature-stone/80 mb-2">Client: {item.client}</p>
          
          <p className="text-sm text-nature-bark line-clamp-2 mb-3">
            {item.description}
          </p>

          {/* Audio Preview */}
          {hasValidMedia(item.audioUrl) && (
            <AudioPreview audioUrl={item.audioUrl} title={item.title} />
          )}

          {/* Video Preview */}
          {hasValidMedia(item.videoUrl) && (
            <VideoPreview videoUrl={item.videoUrl} />
          )}

          {/* External Links */}
          <ExternalLinks links={item.externalLinks} />
          
          {/* Media Type Indicators */}
          <MediaPreview item={item} />
        </CardContent>
      </Card>
    </>
  );
};

export default PortfolioCard;
