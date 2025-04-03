
import React from "react";
import { PortfolioItem, ExternalLink } from "@/data/portfolio";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X } from "lucide-react";
import AudioPlayer from "@/components/AudioPlayer";
import VideoPlayer from "@/components/VideoPlayer";
import { 
  Music, 
  FileVideo, 
  Calendar,
  ExternalLink as ExternalLinkIcon,
  Youtube,
  Music2
} from "lucide-react";

interface PortfolioItemDetailProps {
  item: PortfolioItem;
  onClose: () => void;
}

const PortfolioItemDetail: React.FC<PortfolioItemDetailProps> = ({ item, onClose }) => {
  // Helper function to get link icon based on type
  const getLinkIcon = (type: ExternalLink['type']) => {
    switch (type) {
      case 'spotify':
        return <Music2 className="h-4 w-4" />;
      case 'youtube':
        return <Youtube className="h-4 w-4" />;
      case 'vimeo':
        return <FileVideo className="h-4 w-4" />;
      case 'appleMusic':
        return <Music className="h-4 w-4" />;
      default:
        return <ExternalLinkIcon className="h-4 w-4" />;
    }
  };
  
  // Helper function to get link label based on type
  const getLinkLabel = (link: ExternalLink) => {
    switch (link.type) {
      case 'spotify':
        return 'Spotify';
      case 'youtube':
        return 'YouTube';
      case 'vimeo':
        return 'Vimeo';
      case 'appleMusic':
        return 'Apple Music';
      case 'other':
        return link.title || 'Website';
      default:
        return 'Link';
    }
  };

  // Function to check if a URL actually exists and is not an empty string
  const hasMedia = (url?: string) => {
    return url && url.trim() !== '';
  };

  return (
    <div className="flex flex-col md:flex-row h-[80vh]">
      {/* Left side - Image */}
      <div className="w-full md:w-1/2 h-64 md:h-full relative bg-gray-100">
        {hasMedia(item.coverImageUrl) && (
          <img 
            src={item.coverImagePreview || item.coverImageUrl} 
            alt={item.title} 
            className="w-full h-full object-cover"
            onError={(e) => {
              console.error("Error loading image:", item.coverImageUrl);
              e.currentTarget.src = "/placeholder.svg";
              e.currentTarget.className = "w-full h-full object-contain p-4";
            }}
          />
        )}
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute top-2 right-2 bg-white/80 hover:bg-white text-nature-bark rounded-full"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Right side - Content */}
      <div className="w-full md:w-1/2 bg-white p-6 overflow-hidden flex flex-col">
        <ScrollArea className="flex-grow pr-4">
          <div className="space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <Badge className="bg-nature-forest text-white">
                  {item.category}
                </Badge>
                <div className="flex items-center text-xs text-nature-bark">
                  <Calendar className="h-3 w-3 mr-1" />
                  {new Date(item.createdAt).toLocaleDateString()}
                </div>
              </div>
              <h2 className="text-2xl font-bold text-nature-forest">{item.title}</h2>
              <p className="text-sm text-nature-stone">Client: {item.client}</p>
            </div>
            
            {/* Description */}
            <div>
              <h3 className="text-sm font-medium text-nature-forest mb-2">Description</h3>
              <p className="text-nature-bark">{item.description}</p>
            </div>
            
            {/* External Links */}
            {item.externalLinks.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-nature-forest mb-2">Listen & Watch</h3>
                <div className="flex flex-wrap gap-2">
                  {item.externalLinks.map((link, index) => (
                    <a 
                      key={index}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-gray-100 text-nature-forest hover:bg-gray-200 transition-colors"
                    >
                      {getLinkIcon(link.type)}
                      <span className="ml-1.5">{getLinkLabel(link)}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}
            
            {/* Audio Preview */}
            {hasMedia(item.audioUrl) && (
              <div>
                <h3 className="text-sm font-medium text-nature-forest mb-2">Audio Preview</h3>
                <AudioPlayer audioUrl={item.audioUrl} />
              </div>
            )}
            
            {/* Video Preview */}
            {hasMedia(item.videoUrl) && (
              <div>
                <h3 className="text-sm font-medium text-nature-forest mb-2">Video Preview</h3>
                <VideoPlayer videoUrl={item.videoUrl} />
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default PortfolioItemDetail;
