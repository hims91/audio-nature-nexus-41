import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, Star } from "lucide-react";
import { type PortfolioItem } from "@/types/portfolio";
import HoverSoundPreview from "../interactive/HoverSoundPreview";
import Card3D from "../effects/Card3D";
import { useIsMobile } from "@/hooks/use-mobile";
import MediaTypeBadges from "./MediaTypeBadges";
import AudioPlayerSection from "./AudioPlayerSection";
import VideoPlayerSection from "./VideoPlayerSection";
import ExternalLinksSection from "./ExternalLinksSection";

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

  const handleListenNow = () => {
    console.log('🎵 Listen Now clicked for audio:', item.audioUrl);
    setShowAudioPlayer(!showAudioPlayer);
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
          <MediaTypeBadges item={item} />
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

            {/* Audio Player Section */}
            {hasValidMedia(item.audioUrl) && (
              <AudioPlayerSection
                audioUrl={item.audioUrl}
                showAudioPlayer={showAudioPlayer}
                onTogglePlayer={handleListenNow}
              />
            )}

            {/* Video Player Section */}
            {hasValidMedia(item.videoUrl) && (
              <VideoPlayerSection videoUrl={item.videoUrl} />
            )}

            {/* External Links Section */}
            <ExternalLinksSection
              links={item.externalLinks}
            />
          </div>
        </CardContent>
      </Card>
    </Card3D>
  );
};

export default PortfolioCard;
