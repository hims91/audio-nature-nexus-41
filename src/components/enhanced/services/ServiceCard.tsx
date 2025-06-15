import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import Card3D from "../../effects/Card3D";
import MagneticButton from "../../animations/MagneticButton";
import { ArrowRight, Play } from "lucide-react";
import { getServiceIcon, getCategoryColor } from "./serviceUtils";

interface ServiceCardProps {
  service: {
    id: number;
    title: string;
    description: string;
    icon: string;
    features: string[];
    category: string;
  };
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ 
  service, 
  isHovered, 
  onHover, 
  onLeave 
}) => {
  return (
    <Card3D
      intensity={isHovered ? "high" : "medium"}
      glowEffect={true}
      className="group h-full"
    >
      <div onMouseEnter={onHover} onMouseLeave={onLeave}>
        <GlassCard 
          className={`h-full p-6 transition-all duration-500 cursor-pointer ${
            isHovered 
              ? 'bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg shadow-2xl' 
              : 'bg-white/70 dark:bg-gray-800/70 hover:bg-white/80 dark:hover:bg-gray-800/80'
          }`}
        >
          <CardContent className="p-0 flex flex-col h-full">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <MagneticButton className={`p-3 rounded-xl transition-all duration-300 ${
                isHovered 
                  ? 'bg-nature-forest text-white transform scale-110' 
                  : 'bg-nature-moss/20 dark:bg-gray-700 text-nature-forest dark:text-white'
              }`}>
                {getServiceIcon(service.icon)}
              </MagneticButton>
              <div className="text-right">
                <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(service.category)}`}>
                  {service.category}
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="flex-grow">
              <h3 className="text-xl font-semibold text-nature-forest dark:text-white mb-3 group-hover:text-nature-leaf dark:group-hover:text-blue-400 transition-colors">
                {service.title}
              </h3>
              <p className="text-nature-bark dark:text-gray-300 mb-4 leading-relaxed">
                {service.description}
              </p>

              {/* Features */}
              <div className="space-y-2 mb-6">
                {service.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center text-sm text-nature-stone dark:text-gray-400">
                    <div className="w-1.5 h-1.5 bg-nature-leaf rounded-full mr-2" />
                    {feature}
                  </div>
                ))}
              </div>
            </div>

            {/* Audio Preview Button */}
            {isHovered && (
              <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <MagneticButton>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-700 text-nature-forest dark:text-white rounded-full w-8 h-8 p-0"
                  >
                    <Play className="w-3 h-3" />
                  </Button>
                </MagneticButton>
              </div>
            )}
          </CardContent>
        </GlassCard>
      </div>
    </Card3D>
  );
};

export default ServiceCard;
