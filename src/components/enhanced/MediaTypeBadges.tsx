
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Headphones, Video, ExternalLink } from "lucide-react";
import { type PortfolioItem } from "@/types/portfolio";

interface MediaTypeBadgesProps {
  item: PortfolioItem;
}

const MediaTypeBadges: React.FC<MediaTypeBadgesProps> = ({ item }) => {
  const hasValidMedia = (url?: string) => {
    return url && url.trim() !== '' && url !== 'undefined' && url !== 'null';
  };

  const badges = [];
  
  if (hasValidMedia(item.audioUrl)) {
    badges.push(
      <Badge key="audio" className="bg-blue-500 text-white hover:bg-blue-600 text-xs">
        <Headphones className="w-3 h-3 mr-1" />
        Audio
      </Badge>
    );
  }
  
  if (hasValidMedia(item.videoUrl)) {
    badges.push(
      <Badge key="video" className="bg-purple-500 text-white hover:bg-purple-600 text-xs">
        <Video className="w-3 h-3 mr-1" />
        Video
      </Badge>
    );
  }
  
  if (item.externalLinks && item.externalLinks.length > 0) {
    badges.push(
      <Badge key="links" className="bg-orange-500 text-white hover:bg-orange-600 text-xs">
        <ExternalLink className="w-3 h-3 mr-1" />
        {item.externalLinks.length} Link{item.externalLinks.length > 1 ? 's' : ''}
      </Badge>
    );
  }
  
  return (
    <div className="absolute bottom-3 left-3 flex flex-wrap gap-1">
      {badges}
    </div>
  );
};

export default MediaTypeBadges;
