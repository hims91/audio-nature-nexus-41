
import React, { useState } from "react";
import { type PortfolioItem } from "@/types/portfolio";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import AudioPlayer from "@/components/AudioPlayer";
import VideoPlayer from "@/components/VideoPlayer";
import PortfolioItemDetail from "./PortfolioItemDetail";
import { Music, FileVideo, ExternalLink, Star, Play, AudioWaveform } from "lucide-react";

interface PortfolioCardProps {
  item: PortfolioItem;
}

const PortfolioCard: React.FC<PortfolioCardProps> = ({ item }) => {
  const [detailOpen, setDetailOpen] = useState(false);
  const [showAudioPlayer, setShowAudioPlayer] = useState(false);
  
  // Function to check if a URL actually exists and is not an empty string
  const hasMedia = (url?: string) => {
    const isValid = url && url.trim() !== '' && url !== 'undefined' && url !== 'null';
    console.log(`🔍 Media validation for "${url}":`, isValid);
    return isValid;
  };

  // Properly encode the URL to handle spaces and special characters
  const getEncodedUrl = (url?: string) => {
    if (!url) return "";
    return url.startsWith("http") ? url : encodeURI(url);
  };

  const handleExternalLinkClick = (url: string, e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('🔗 Opening external link:', url);
    try {
      const validUrl = url.startsWith('http') ? url : `https://${url}`;
      window.open(validUrl, '_blank', 'noopener,noreferrer');
    } catch (error) {
      console.error('❌ Error opening external link:', error);
    }
  };

  // Debug logging for audio availability
  React.useEffect(() => {
    console.log(`🎵 Portfolio item "${item.title}" audio URL:`, item.audioUrl);
    console.log(`🎵 Has valid audio:`, hasMedia(item.audioUrl));
  }, [item.audioUrl, item.title]);

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
          {hasMedia(item.coverImageUrl) && (
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

          {/* Enhanced Audio Preview with better visibility */}
          {hasMedia(item.audioUrl) && (
            <div className="mb-3">
              <Button
                onClick={() => setShowAudioPlayer(!showAudioPlayer)}
                className={`w-full mb-2 ${
                  showAudioPlayer 
                    ? 'bg-nature-leaf hover:bg-nature-forest' 
                    : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'
                } text-white transition-all duration-300`}
                size="sm"
              >
                {showAudioPlayer ? (
                  <>
                    <Play className="h-3 w-3 mr-1" />
                    Hide Audio Player
                  </>
                ) : (
                  <>
                    <AudioWaveform className="h-3 w-3 mr-1" />
                    Listen Now
                  </>
                )}
              </Button>
              {showAudioPlayer && (
                <div className="bg-blue-50 dark:bg-gray-700 p-3 rounded-lg border-2 border-blue-200">
                  <div className="flex items-center mb-2">
                    <Music className="h-4 w-4 mr-1 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800 dark:text-blue-200">Audio Preview</span>
                  </div>
                  <AudioPlayer audioUrl={item.audioUrl} />
                </div>
              )}
            </div>
          )}

          {/* Enhanced Video Preview */}
          {hasMedia(item.videoUrl) && (
            <div className="mb-3">
              <div className="bg-purple-50 dark:bg-gray-700 p-3 rounded-lg border-2 border-purple-200">
                <div className="flex items-center mb-2">
                  <FileVideo className="h-4 w-4 mr-1 text-purple-600" />
                  <span className="text-sm font-medium text-purple-800 dark:text-purple-200">Video Preview</span>
                </div>
                <VideoPlayer videoUrl={item.videoUrl} />
              </div>
            </div>
          )}

          {/* Enhanced External Links - More prominent and clickable */}
          {item.externalLinks && item.externalLinks.length > 0 && (
            <div className="mb-3">
              <div className="flex flex-wrap gap-1">
                {item.externalLinks.map((link, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={(e) => handleExternalLinkClick(link.url, e)}
                    className="text-xs cursor-pointer border-2 hover:border-blue-400 hover:bg-blue-50 dark:hover:border-blue-500 transition-all duration-200 transform hover:scale-105"
                  >
                    <ExternalLink className="h-3 w-3 mr-1" />
                    {link.title || link.type}
                  </Button>
                ))}
              </div>
            </div>
          )}
          
          {/* Media Type Indicators */}
          <div className="mt-auto flex items-center gap-2">
            {hasMedia(item.audioUrl) && (
              <Badge variant="outline" className="text-xs bg-blue-50 border-blue-200 text-blue-700">
                <Music className="h-3 w-3 mr-1" />
                Audio
              </Badge>
            )}
            
            {hasMedia(item.videoUrl) && (
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

          {/* Debug info for development */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-2 p-2 bg-gray-100 rounded text-xs">
              <p>Audio URL: {item.audioUrl || 'None'}</p>
              <p>Video URL: {item.videoUrl || 'None'}</p>
              <p>Cover Image: {item.coverImageUrl || 'None'}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default PortfolioCard;
