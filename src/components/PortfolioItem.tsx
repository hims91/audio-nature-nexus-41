
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PortfolioItem as PortfolioItemType } from "@/data/portfolio";
import AudioPlayer from "./AudioPlayer";
import VideoPlayer from "./VideoPlayer";

interface PortfolioItemProps {
  item: PortfolioItemType;
}

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
        
        <AudioPlayer audioUrl={item.audioUrl} />
        <VideoPlayer videoUrl={item.videoUrl} />
      </CardContent>
    </Card>
  );
};

export default PortfolioItem;
