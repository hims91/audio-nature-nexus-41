
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import AudioVisualizer from "../animations/AudioVisualizer";
import FadeInView from "../animations/FadeInView";
import FloatingElement from "../animations/FloatingElement";

const InteractiveHero: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isPlaying) {
        setCurrentTime(prev => prev + 1);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-nature-forest via-nature-leaf to-nature-sage opacity-90" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="7" cy="7" r="1"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] animate-pulse" />
        
        {/* Floating Elements */}
        <FloatingElement intensity="light" delay={0} className="absolute top-20 left-10">
          <div className="w-3 h-3 bg-white/30 rounded-full" />
        </FloatingElement>
        <FloatingElement intensity="medium" delay={1} className="absolute top-40 right-20">
          <div className="w-2 h-2 bg-nature-cream/40 rounded-full" />
        </FloatingElement>
        <FloatingElement intensity="strong" delay={2} className="absolute bottom-40 left-20">
          <div className="w-4 h-4 bg-white/20 rounded-full" />
        </FloatingElement>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 z-10 text-center">
        <FadeInView direction="up" delay={0.2}>
          <div className="max-w-4xl mx-auto">
            {/* Audio Visualizer */}
            <div className="mb-8">
              <AudioVisualizer 
                isPlaying={isPlaying} 
                barCount={32}
                className="h-24 mb-6"
              />
            </div>

            {/* Main Heading */}
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-6 tracking-tight">
              <span className="bg-gradient-to-r from-white via-nature-cream to-white bg-clip-text text-transparent animate-shimmer bg-300%">
                Terra Echo
              </span>
              <br />
              <span className="text-4xl md:text-5xl lg:text-6xl font-light">
                Studios
              </span>
            </h1>

            {/* Tagline */}
            <FadeInView direction="up" delay={0.4}>
              <p className="text-2xl md:text-3xl text-nature-cream mb-8 font-light tracking-wide">
                Authentic Audio, Naturally Engineered
              </p>
            </FadeInView>

            {/* Interactive Audio Control */}
            <FadeInView direction="up" delay={0.6}>
              <GlassCard className="max-w-md mx-auto mb-10 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <Button
                      onClick={() => setIsPlaying(!isPlaying)}
                      size="sm"
                      className="bg-white/20 hover:bg-white/30 border-white/30 text-white rounded-full w-12 h-12"
                    >
                      {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                    </Button>
                    <div className="text-white">
                      <p className="text-sm font-medium">Studio Preview</p>
                      <p className="text-xs text-white/70">{formatTime(currentTime)}</p>
                    </div>
                  </div>
                  <Button
                    onClick={() => setIsMuted(!isMuted)}
                    size="sm"
                    variant="ghost"
                    className="text-white hover:bg-white/20 rounded-full w-10 h-10"
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </Button>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-nature-cream to-white h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${(currentTime * 2) % 100}%` }}
                  />
                </div>
              </GlassCard>
            </FadeInView>

            {/* Action Buttons */}
            <FadeInView direction="up" delay={0.8}>
              <div className="flex flex-col sm:flex-row justify-center gap-6">
                <Button 
                  onClick={() => scrollToSection("portfolio")}
                  size="lg"
                  className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white border border-white/30 text-lg py-6 px-10 rounded-full transform hover:scale-105 transition-all duration-300 shadow-2xl"
                >
                  Explore Portfolio
                </Button>
                
                <Button 
                  onClick={() => scrollToSection("contact")}
                  size="lg"
                  variant="outline"
                  className="border-2 border-white/50 text-white hover:bg-white/20 backdrop-blur-sm text-lg py-6 px-10 rounded-full transform hover:scale-105 transition-all duration-300 shadow-2xl"
                >
                  Start Your Project
                </Button>
              </div>
            </FadeInView>
          </div>
        </FadeInView>
      </div>

      {/* Scroll Indicator */}
      <FadeInView direction="up" delay={1}>
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
          <button 
            onClick={() => scrollToSection("about")}
            className="flex flex-col items-center text-white/80 hover:text-white transition-colors duration-300 group"
          >
            <span className="mb-3 text-sm font-medium tracking-wide">Discover Our Story</span>
            <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center group-hover:border-white transition-colors">
              <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-bounce" />
            </div>
          </button>
        </div>
      </FadeInView>
    </div>
  );
};

export default InteractiveHero;
