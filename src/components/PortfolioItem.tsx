
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PortfolioItem as PortfolioItemType } from "@/data/portfolio";
import AudioPlayer from "./AudioPlayer";
import VideoPlayer from "./VideoPlayer";
import LazyImage from "./performance/LazyImage";
import { FileVideo, Music, Link as LinkIcon } from "lucide-react";
import { Youtube, Instagram, Facebook, Twitter, Linkedin } from "lucide-react";
import { trackPortfolioView } from "@/utils/analytics";

interface PortfolioItemProps {
  item: PortfolioItemType;
}

// Helper function to get the appropriate icon component
const getIconComponent = (iconName: string) => {
  switch (iconName.toLowerCase()) {
    case "youtube":
      return <Youtube className="h-4 w-4" />;
    case "instagram":
      return <Instagram className="h-4 w-4" />;
    case "facebook":
      return <Facebook className="h-4 w-4" />;
    case "twitter":
      return <Twitter className="h-4 w-4" />;
    case "linkedin":
      return <Linkedin className="h-4 w-4" />;
    case "spotify":
      return <Music className="h-4 w-4" />; // Using Music icon for Spotify as a fallback
    case "link":
    default:
      return <LinkIcon className="h-4 w-4" />;
  }
};

const PortfolioItem: React.FC<PortfolioItemProps> = ({ item }) => {
  // Function to check if a URL actually exists and is not an empty string
  const hasValidUrl = (url?: string) => {
    return url && url.trim() !== '';
  };

  // Determine if we should show audio preview
  // For "Sound for Picture" category OR the "Louie, Louie" item, don't show audio
  const shouldShowAudioPreview = 
    item.category !== "Sound for Picture" && 
    hasValidUrl(item.audioUrl) && 
    item.title !== "Louie, Louie";

  // Track portfolio view
  React.useEffect(() => {
    trackPortfolioView(item.title, item.category);
  }, [item.title, item.category]);

  return (
    <Card className="overflow-hidden bg-white h-full shadow-md hover:shadow-xl transition-shadow duration-300">
      {hasValidUrl(item.coverImageUrl) && (
        <div className="relative h-52 overflow-hidden">
          <LazyImage
            src={item.coverImageUrl}
            alt={item.title}
            className="w-full h-full transition-transform duration-500 hover:scale-105"
          />
          <Badge 
            className="absolute top-3 right-3 bg-nature-forest text-white hover:bg-nature-leaf"
          >
            {item.category}
          </Badge>
        </div>
      )}
      
      {!hasValidUrl(item.coverImageUrl) && (
        <div className="relative h-16 bg-nature-cream flex items-center justify-center">
          <Badge 
            className="absolute top-3 right-3 bg-nature-forest text-white hover:bg-nature-leaf"
          >
            {item.category}
          </Badge>
        </div>
      )}
      
      <CardContent className="p-5">
        <h3 className="text-xl font-semibold text-nature-forest mb-1">{item.title}</h3>
        <p className="text-sm text-nature-stone/80 mb-3">Client: {item.client}</p>
        <p className="mb-4 text-nature-bark">{item.description}</p>
        
        {/* External Links Section - Only show if links exist */}
        {item.externalLinks && item.externalLinks.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center mb-2 text-nature-forest">
              <LinkIcon className="h-4 w-4 mr-1" />
              <span className="text-sm font-medium">Links</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {item.externalLinks.filter(link => link.type === "spotify").map((link, index) => (
                <a 
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#1DB954] text-white hover:bg-opacity-90 transition-colors"
                >
                  <Music className="h-3.5 w-3.5 mr-1" />
                  Spotify
                </a>
              ))}
              
              {item.externalLinks.filter(link => link.type === "other").map((link, index) => (
                <a 
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-nature-stone text-white hover:bg-nature-bark transition-colors"
                >
                  {getIconComponent(link.title || "link")}
                  <span className="ml-1">{link.title || "Link"}</span>
                </a>
              ))}
            </div>
          </div>
        )}
        
        {/* Audio Preview - Only show if audio exists and is valid, and not for "Louie, Louie" */}
        {shouldShowAudioPreview && (
          <div className="mb-3">
            <div className="flex items-center mb-2 text-nature-forest">
              <Music className="h-4 w-4 mr-1" />
              <span className="text-sm font-medium">Preview</span>
            </div>
            <AudioPlayer audioUrl={item.audioUrl} />
          </div>
        )}
        
        {/* Video Preview - Only show if video exists and is valid */}
        {hasValidUrl(item.videoUrl) && (
          <div className="mt-4">
            <div className="flex items-center mb-2 text-nature-forest">
              <FileVideo className="h-4 w-4 mr-1" />
              <span className="text-sm font-medium">Video Preview</span>
            </div>
            <VideoPlayer videoUrl={item.videoUrl} />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PortfolioItem;
