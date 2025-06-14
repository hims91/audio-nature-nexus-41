
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import FadeInView from "../animations/FadeInView";
import Card3D from "../effects/Card3D";
import MagneticButton from "../animations/MagneticButton";
import { AudioWaveform, Headphones, Music, Folder, Mic, Image, Star, Volume2, Wand2, ArrowRight, Play } from "lucide-react";

const ServicesEnhanced: React.FC = () => {
  const [hoveredService, setHoveredService] = useState<number | null>(null);

  const services = [
    {
      id: 1,
      title: "Mixing & Mastering",
      description: "Professional mixing and mastering services that bring clarity, depth, and commercial polish to your tracks.",
      icon: "audio-waveform",
      features: ["Analog-style processing", "Streaming optimization", "Multiple format delivery"],
      price: "From $150",
      category: "Production"
    },
    {
      id: 2,
      title: "Sound Design",
      description: "Custom sound creation for films, games, and multimedia projects with cinematic depth and emotional impact.",
      icon: "wand-2",
      features: ["Foley recording", "Ambient soundscapes", "Interactive audio"],
      price: "From $200",
      category: "Creative"
    },
    {
      id: 3,
      title: "Podcast Production",
      description: "Complete podcast production from recording to final delivery, ensuring broadcast-quality audio.",
      icon: "mic",
      features: ["Multi-track editing", "Noise reduction", "Format optimization"],
      price: "From $100",
      category: "Content"
    },
    {
      id: 4,
      title: "Dolby Atmos",
      description: "Immersive 3D audio mixing for the ultimate listening experience across all playback systems.",
      icon: "volume-2",
      features: ["Object-based mixing", "Binaural rendering", "Platform optimization"],
      price: "From $300",
      category: "Premium"
    },
    {
      id: 5,
      title: "Live Recording",
      description: "Multi-track live recording services for concerts, events, and performances.",
      icon: "music",
      features: ["Up to 64 channels", "Redundant systems", "Post-production available"],
      price: "Custom Quote",
      category: "Live"
    },
    {
      id: 6,
      title: "Audio Restoration",
      description: "Breathe new life into old recordings with advanced restoration and enhancement techniques.",
      icon: "star",
      features: ["Noise removal", "Quality enhancement", "Format conversion"],
      price: "From $75",
      category: "Restoration"
    }
  ];

  const getIcon = (iconName: string) => {
    const iconMap = {
      "audio-waveform": AudioWaveform,
      "headphones": Headphones,
      "music": Music,
      "folder": Folder,
      "mic": Mic,
      "image": Image,
      "volume-2": Volume2,
      "wand-2": Wand2,
      "star": Star,
    };
    const IconComponent = iconMap[iconName as keyof typeof iconMap] || AudioWaveform;
    return <IconComponent className="h-8 w-8" />;
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      "Production": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      "Creative": "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
      "Content": "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      "Premium": "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
      "Live": "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      "Restoration": "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
    };
    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
  };

  return (
    <section id="services" className="py-20 bg-white dark:bg-gray-900 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <FadeInView direction="up" delay={0.2}>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-nature-forest dark:text-white mb-4 font-playfair">
              Professional <span className="text-gradient">Services</span>
            </h2>
            <p className="text-lg text-nature-bark dark:text-gray-300 max-w-3xl mx-auto">
              Comprehensive audio engineering services that blend technical excellence with natural inspiration 
              to bring your sonic vision to life.
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-nature-forest to-nature-leaf mx-auto mt-6 rounded-full" />
          </div>
        </FadeInView>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <FadeInView key={service.id} direction="up" delay={0.1 * index}>
              <Card3D
                intensity={hoveredService === service.id ? "high" : "medium"}
                glowEffect={true}
                className="group h-full"
              >
                <div
                  onMouseEnter={() => setHoveredService(service.id)}
                  onMouseLeave={() => setHoveredService(null)}
                >
                  <GlassCard 
                    className={`h-full p-6 transition-all duration-500 cursor-pointer ${
                      hoveredService === service.id 
                        ? 'bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg shadow-2xl' 
                        : 'bg-white/70 dark:bg-gray-800/70 hover:bg-white/80 dark:hover:bg-gray-800/80'
                    }`}
                  >
                    <CardContent className="p-0 flex flex-col h-full">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <MagneticButton className={`p-3 rounded-xl transition-all duration-300 ${
                          hoveredService === service.id 
                            ? 'bg-nature-forest text-white transform scale-110' 
                            : 'bg-nature-moss/20 dark:bg-gray-700 text-nature-forest dark:text-white'
                        }`}>
                          {getIcon(service.icon)}
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

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-4 border-t border-nature-moss/20 dark:border-gray-700">
                        <div className="text-lg font-semibold text-nature-forest dark:text-white">
                          {service.price}
                        </div>
                        <MagneticButton>
                          <Button
                            size="sm"
                            className={`rounded-full transition-all duration-300 ${
                              hoveredService === service.id
                                ? 'bg-nature-forest hover:bg-nature-leaf text-white transform scale-105'
                                : 'bg-nature-moss/20 hover:bg-nature-moss/30 dark:bg-gray-700 dark:hover:bg-gray-600 text-nature-forest dark:text-white'
                            }`}
                          >
                            Learn More
                            <ArrowRight className="w-4 h-4 ml-1" />
                          </Button>
                        </MagneticButton>
                      </div>

                      {/* Audio Preview Button */}
                      {hoveredService === service.id && (
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
            </FadeInView>
          ))}
        </div>

        {/* Call to Action */}
        <FadeInView direction="up" delay={0.8}>
          <div className="text-center mt-16">
            <Card3D intensity="medium">
              <GlassCard className="max-w-2xl mx-auto p-8 bg-gradient-to-r from-nature-forest/10 to-nature-leaf/10 dark:from-blue-900/20 dark:to-purple-900/20">
                <h3 className="text-2xl font-semibold text-nature-forest dark:text-white mb-4">
                  Ready to elevate your audio?
                </h3>
                <p className="text-nature-bark dark:text-gray-300 mb-6">
                  Let's discuss your project and create something extraordinary together.
                </p>
                <MagneticButton>
                  <Button 
                    size="lg"
                    className="bg-nature-forest hover:bg-nature-leaf text-white px-8 py-3 rounded-full transform hover:scale-105 transition-all duration-300"
                    onClick={() => {
                      const element = document.getElementById("contact");
                      if (element) element.scrollIntoView({ behavior: "smooth" });
                    }}
                  >
                    Start Your Project
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </MagneticButton>
              </GlassCard>
            </Card3D>
          </div>
        </FadeInView>
      </div>
    </section>
  );
};

export default ServicesEnhanced;
