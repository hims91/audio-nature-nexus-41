
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Music, FileVideo, ExternalLink } from "lucide-react";
import { type PortfolioItem } from "@/types/portfolio";

interface MediaPreviewProps {
  item: PortfolioItem;
}

const MediaPreview: React.FC<MediaPreviewProps> = ({ item }) => {
  const hasValidMedia = (url?: string) => {
    return url && url.trim() !== '' && url !== 'undefined' && url !== 'null';
  };

  return (
    <div className="mt-auto flex items-center gap-2">
      {hasValidMedia(item.audioUrl) && (
        <Badge variant="outline" className="text-xs bg-blue-50 border-blue-200 text-blue-700">
          <Music className="h-3 w-3 mr-1" />
          Audio
        </Badge>
      )}
      
      {hasValidMedia(item.videoUrl) && (
        <Badge variant="outline" className="text-xs bg-purple-50 border-purple-200 text-purple-700">
          <FileVideo className="h-3 w-3 mr-1" />
          Video
        </Badge>
      )}
      
      {item.externalLinks && item.externalLinks.length > 0 && (
        <Badge variant="outline" className="text-xs bg-orange-50 border-orange-200 text-orange-700">
          <ExternalLink className="h-3 w-3 mr-1" />
          {item.externalLinks.length} Links
        </Badge>
      )}
    </div>
  );
};

export default MediaPreview;
