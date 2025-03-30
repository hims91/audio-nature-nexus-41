
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { AudioWaveform, Headphones, Music, Folder, Mic, Image, Star } from "lucide-react";
import { Service } from "@/data/services";

interface ServiceCardProps {
  service: Service;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  const getIcon = () => {
    switch (service.icon) {
      case "audio-waveform":
        return <AudioWaveform className="h-12 w-12 text-nature-forest" />;
      case "headphones":
        return <Headphones className="h-12 w-12 text-nature-forest" />;
      case "music":
        return <Music className="h-12 w-12 text-nature-forest" />;
      case "folder":
        return <Folder className="h-12 w-12 text-nature-forest" />;
      case "mic":
        return <Mic className="h-12 w-12 text-nature-forest" />;
      case "image":
        return <Image className="h-12 w-12 text-nature-forest" />;
      case "star":
        return <Star className="h-12 w-12 text-nature-forest" />;
      default:
        return <AudioWaveform className="h-12 w-12 text-nature-forest" />;
    }
  };

  return (
    <Card className="bg-white border-nature-moss/30 h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <CardContent className="p-6 flex flex-col items-center text-center h-full">
        <div className="mb-4 bg-nature-moss/10 p-4 rounded-full">
          {getIcon()}
        </div>
        <h3 className="text-xl font-semibold text-nature-forest mb-3">{service.title}</h3>
        <p className="text-nature-bark">{service.description}</p>
      </CardContent>
    </Card>
  );
};

export default ServiceCard;
