
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Play, Pause, ExternalLink, Calendar, User, Star } from "lucide-react";
import { type PortfolioItem } from "@/types/portfolio";
import AudioPlayer from "@/components/AudioPlayer";
import VideoPlayer from "@/components/VideoPlayer";
import HoverSoundPreview from "../interactive/HoverSoundPreview";

interface PortfolioCardProps {
  item: PortfolioItem;
}

const PortfolioCard: React.FC<PortfolioCardProps> = ({ item }) => {
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);

  const getCategoryColor = (category: string) => {
    const colors = {
      "Mixing & Mastering": "bg-green-100 text-green-800",
      "Sound Design": "bg-blue-100 text-blue-800",
      "Podcasting": "bg-purple-100 text-purple-800",
      "Sound for Picture": "bg-orange-100 text-orange-800",
      "Dolby Atmos": "bg-red-100 text-red-800"
    };
    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short'
    });
  };

  return (
    <Card className="group overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 border-0 bg-white transform">
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
              <div className="w-full h-full bg-gradient-to-br from-nature-sage to-nature-mist flex items-center justify-center">
                <div className="text-nature-forest text-4xl font-bold opacity-20">
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
              <div className="w-full h-full bg-gradient-to-br from-nature-sage to-nature-mist flex items-center justify-center">
                <div className="text-nature-forest text-4xl font-bold opacity-20">
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
            <h3 className="font-bold text-lg text-nature-forest group-hover:text-nature-leaf transition-colors duration-300">
              {item.title}
            </h3>
            <div className="flex items-center text-sm text-nature-bark">
              <User className="w-4 h-4 mr-1" />
              {item.client}
              <Calendar className="w-4 h-4 ml-4 mr-1" />
              {formatDate(item.createdAt)}
            </div>
          </div>

          <p className="text-nature-bark text-sm line-clamp-3">
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
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(link.url, '_blank')}
                  className="text-xs transform hover:scale-105 transition-all duration-200"
                >
                  <ExternalLink className="w-3 h-3 mr-1" />
                  {link.title || link.type}
                </Button>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PortfolioCard;
