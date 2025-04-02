
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PortfolioItem as PortfolioItemType } from "@/data/portfolio";
import AudioPlayer from "./AudioPlayer";
import VideoPlayer from "./VideoPlayer";
import { FileVideo, Music, Link as LinkIcon } from "lucide-react";
import { Youtube, Instagram, Facebook, Twitter, Linkedin } from "lucide-react";

interface PortfolioItemProps {
  item: PortfolioItemType;
}

// Helper function to get the appropriate icon component
const getIconComponent = (iconName: string) => {
  switch (iconName) {
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
  return (
    <Card className="overflow-hidden bg-white h-full shadow-md hover:shadow-xl transition-shadow duration-300">
      <div className="relative h-52 overflow-hidden">
        <img 
          src={item.imageUrl} 
          alt={item.title} 
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
        <Badge 
          className="absolute top-3 right-3 bg-nature-forest text-white hover:bg-nature-leaf"
        >
          {item.category}
        </Badge>
      </div>
      
      <CardContent className="p-5">
        <h3 className="text-xl font-semibold text-nature-forest mb-1">{item.title}</h3>
        <p className="text-sm text-nature-stone/80 mb-3">Client: {item.client}</p>
        <p className="mb-4 text-nature-bark">{item.description}</p>
        
        {/* External Links Section */}
        {(item.spotifyUrl || (item.otherLinks && item.otherLinks.length > 0)) && (
          <div className="mb-4">
            <div className="flex items-center mb-2 text-nature-forest">
              <LinkIcon className="h-4 w-4 mr-1" />
              <span className="text-sm font-medium">Links</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {item.spotifyUrl && (
                <a 
                  href={item.spotifyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#1DB954] text-white hover:bg-opacity-90 transition-colors"
                >
                  <Music className="h-3.5 w-3.5 mr-1" />
                  Spotify
                </a>
              )}
              
              {item.otherLinks && item.otherLinks.map((link, index) => (
                <a 
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-nature-stone text-white hover:bg-nature-bark transition-colors"
                >
                  {getIconComponent(link.icon)}
                  <span className="ml-1">{link.title}</span>
                </a>
              ))}
            </div>
          </div>
        )}
        
        {item.audioUrl && (
          <div className="mb-3">
            <div className="flex items-center mb-2 text-nature-forest">
              <Music className="h-4 w-4 mr-1" />
              <span className="text-sm font-medium">Audio Sample</span>
            </div>
            <AudioPlayer audioUrl={item.audioUrl} />
          </div>
        )}
        
        {item.videoUrl && (
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
