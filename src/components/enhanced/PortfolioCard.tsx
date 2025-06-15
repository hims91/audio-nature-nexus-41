
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Play, Pause, ExternalLink, Calendar, User, Star } from "lucide-react";
import { type PortfolioItem } from "@/types/portfolio";
import AudioPlayer from "@/components/AudioPlayer";
import VideoPlayer from "@/components/VideoPlayer";
import HoverSoundPreview from "../interactive/HoverSoundPreview";
import Card3D from "../effects/Card3D";
import MagneticButton from "../animations/MagneticButton";

interface PortfolioCardProps {
  item: PortfolioItem;
}

const PortfolioCard: React.FC<PortfolioCardProps> = ({ item }) => {
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);

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

  return (
    <Card3D intensity="medium" glowEffect={true} className="group">
      <Card className="overflow-hidden transition-all duration-500 border-0 bg-white dark:bg-gray-800 transform h-full">
        {/* Cover Image with Hover Sound Preview */}
        <div className="relative h-48 overflow-hidden">
          {item.audioUrl ? (
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
        </div>

        <CardContent className="p-6">
          <div className="space-y-3">
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

            {/* Media Players */}
            {playingAudio === item.id && item.audioUrl && (
              <div className="mt-4 animate-fade-in">
                <AudioPlayer audioUrl={item.audioUrl} />
              </div>
            )}

            {item.videoUrl && (
              <div className="mt-4 animate-fade-in">
                <VideoPlayer videoUrl={item.videoUrl} />
              </div>
            )}

            {/* External Links */}
            {item.externalLinks && item.externalLinks.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {item.externalLinks.map((link, index) => (
                  <MagneticButton key={index}>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(link.url, '_blank')}
                      className="text-xs transform hover:scale-105 transition-all duration-200 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                      <ExternalLink className="w-3 h-3 mr-1" />
                      {link.title || link.type}
                    </Button>
                  </MagneticButton>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Card3D>
  );
};

export default PortfolioCard;
