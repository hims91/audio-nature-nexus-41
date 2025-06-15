import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Play, Pause, ExternalLink, Calendar, User, Star, Headphones, Video, AudioWaveform } from "lucide-react";
import { type PortfolioItem } from "@/types/portfolio";
import AudioPlayer from "@/components/AudioPlayer";
import VideoPlayer from "@/components/VideoPlayer";
import HoverSoundPreview from "../interactive/HoverSoundPreview";
import Card3D from "../effects/Card3D";
import MagneticButton from "../animations/MagneticButton";
import { useIsMobile } from "@/hooks/use-mobile";

interface PortfolioCardProps {
  item: PortfolioItem;
}

const PortfolioCard: React.FC<PortfolioCardProps> = ({ item }) => {
  const [showAudioPlayer, setShowAudioPlayer] = useState<boolean>(false);
  const isMobile = useIsMobile();

  const getCategoryColor = (category: string) => {
    const colors = {
      "Mixing & Mastering": "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      "Sound Design": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      "Podcasting": "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
      "Sound for Picture": "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
      "Dolby Atmos": "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
    };
    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short'
    });
  };

  const hasValidMedia = (url?: string) => {
    const isValid = url && url.trim() !== '' && url !== 'undefined' && url !== 'null';
    console.log(`🔍 Media validation for "${url}":`, isValid);
    return isValid;
  };

  const getMediaTypeBadges = () => {
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
    
    return badges;
  };

  const handleListenNow = () => {
    console.log('🎵 Listen Now clicked for audio:', item.audioUrl);
    setShowAudioPlayer(!showAudioPlayer);
  };

  const handleExternalLinkClick = (url: string, title: string) => {
    console.log('🔗 Opening external link:', url);
    try {
      // Ensure the URL is properly formatted
      const validUrl = url.startsWith('http') ? url : `https://${url}`;
      window.open(validUrl, '_blank', 'noopener,noreferrer');
    } catch (error) {
      console.error('❌ Error opening external link:', error);
    }
  };

  // Debug logging for audio availability
  React.useEffect(() => {
    console.log(`🎵 Portfolio item "${item.title}" audio URL:`, item.audioUrl);
    console.log(`🎵 Has valid audio:`, hasValidMedia(item.audioUrl));
  }, [item.audioUrl, item.title]);

  return (
    <Card3D intensity="medium" glowEffect={true} className="group">
      <Card className="overflow-hidden transition-all duration-500 border-0 bg-white dark:bg-gray-800 transform h-full">
        {/* Cover Image with Hover Sound Preview */}
        <div className="relative h-48 overflow-hidden">
          {item.audioUrl && !isMobile ? (
            <HoverSoundPreview
              audioUrl={item.audioUrl}
              title={item.title}
              className="h-full w-full"
            >
              {item.coverImageUrl ? (
                <img
                  src={item.coverImageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-nature-sage to-nature-mist dark:from-gray-700 dark:to-gray-600 flex items-center justify-center">
                  <div className="text-nature-forest dark:text-white text-4xl font-bold opacity-20">
                    {item.title.charAt(0)}
                  </div>
                </div>
              )}
            </HoverSoundPreview>
          ) : (
            <>
              {item.coverImageUrl ? (
                <img
                  src={item.coverImageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-nature-sage to-nature-mist dark:from-gray-700 dark:to-gray-600 flex items-center justify-center">
                  <div className="text-nature-forest dark:text-white text-4xl font-bold opacity-20">
                    {item.title.charAt(0)}
                  </div>
                </div>
              )}
            </>
          )}
          
          {/* Featured Badge */}
          {item.featured && (
            <div className="absolute top-3 right-3 animate-pulse">
              <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0 shadow-lg">
                <Star className="w-3 h-3 mr-1" />
                Featured
              </Badge>
            </div>
          )}

          {/* Category Badge */}
          <div className="absolute top-3 left-3 transform transition-transform duration-300 group-hover:scale-110">
            <Badge className={getCategoryColor(item.category)}>
              {item.category}
            </Badge>
          </div>

          {/* Media Type Indicators */}
          <div className="absolute bottom-3 left-3 flex flex-wrap gap-1">
            {getMediaTypeBadges()}
          </div>
        </div>

        <CardContent className="p-6">
          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-lg text-nature-forest dark:text-white group-hover:text-nature-leaf dark:group-hover:text-blue-400 transition-colors duration-300">
                {item.title}
              </h3>
              <div className="flex items-center text-sm text-nature-bark dark:text-gray-400">
                <User className="w-4 h-4 mr-1" />
                {item.client}
                <Calendar className="w-4 h-4 ml-4 mr-1" />
                {formatDate(item.createdAt)}
              </div>
            </div>

            <p className="text-nature-bark dark:text-gray-300 text-sm line-clamp-3">
              {item.description}
            </p>

            {/* Listen Now Button - Always visible when audio exists */}
            {hasValidMedia(item.audioUrl) && (
              <div className="flex justify-center">
                <MagneticButton>
                  <Button
                    onClick={handleListenNow}
                    className={`${
                      showAudioPlayer 
                        ? 'bg-nature-leaf hover:bg-nature-forest' 
                        : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'
                    } text-white px-6 py-2 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg`}
                  >
                    {showAudioPlayer ? (
                      <>
                        <Pause className="w-4 h-4 mr-2" />
                        Hide Player
                      </>
                    ) : (
                      <>
                        <AudioWaveform className="w-4 h-4 mr-2" />
                        Listen Now
                      </>
                    )}
                  </Button>
                </MagneticButton>
              </div>
            )}

            {/* Audio Player - Prominently displayed when toggled */}
            {showAudioPlayer && hasValidMedia(item.audioUrl) && (
              <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 rounded-lg border-2 border-blue-200 dark:border-gray-500 animate-fade-in">
                <div className="flex items-center mb-2">
                  <AudioWaveform className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm font-medium text-blue-800 dark:text-blue-200">Audio Preview</span>
                </div>
                <AudioPlayer audioUrl={item.audioUrl} />
              </div>
            )}

            {/* Video Player - Always visible when video exists */}
            {hasValidMedia(item.videoUrl) && (
              <div className="mt-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-gray-700 dark:to-gray-600 rounded-lg border-2 border-purple-200 dark:border-gray-500">
                <div className="flex items-center mb-2">
                  <Video className="w-5 h-5 mr-2 text-purple-600 dark:text-purple-400" />
                  <span className="text-sm font-medium text-purple-800 dark:text-purple-200">Video Preview</span>
                </div>
                <VideoPlayer videoUrl={item.videoUrl} />
              </div>
            )}

            {/* External Links - Enhanced clickability */}
            {item.externalLinks && item.externalLinks.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {item.externalLinks.map((link, index) => (
                  <MagneticButton key={index}>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleExternalLinkClick(link.url, link.title || link.type)}
                      className={`text-xs transform hover:scale-105 transition-all duration-200 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 cursor-pointer border-2 hover:border-blue-400 hover:bg-blue-50 dark:hover:border-blue-500 ${
                        isMobile ? 'px-4 py-3 text-sm' : ''
                      }`}
                    >
                      <ExternalLink className="w-3 h-3 mr-1" />
                      {link.title || link.type}
                    </Button>
                  </MagneticButton>
                ))}
              </div>
            )}

            {/* Debug info for development */}
            {process.env.NODE_ENV === 'development' && (
              <div className="mt-2 p-2 bg-gray-100 rounded text-xs">
                <p>Audio URL: {item.audioUrl || 'None'}</p>
                <p>Video URL: {item.videoUrl || 'None'}</p>
                <p>Cover Image: {item.coverImageUrl || 'None'}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Card3D>
  );
};

export default PortfolioCard;
