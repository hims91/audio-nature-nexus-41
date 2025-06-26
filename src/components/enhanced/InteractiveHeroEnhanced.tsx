
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import AudioVisualizer from "../animations/AudioVisualizer";
import FadeInView from "../animations/FadeInView";
import FloatingElement from "../animations/FloatingElement";
import ParticleField from "../effects/ParticleField";
import MagneticButton from "../animations/MagneticButton";
import Card3D from "../effects/Card3D";

const InteractiveHeroEnhanced: React.FC = () => {
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
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-nature-forest via-nature-leaf to-nature-sage">
      {/* Particle Field Background */}
      <ParticleField className="opacity-60" particleCount={80} />
      
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 transition-all duration-1000 bg-gradient-to-br from-nature-forest/90 via-nature-leaf/80 to-nature-sage/90" />
        
        <div className="absolute inset-0 opacity-20">
          <div className="w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
        </div>
        
        {/* Enhanced Floating Elements */}
        <FloatingElement intensity="light" delay={0} className="absolute top-20 left-10">
          <div className="w-3 h-3 rounded-full animate-glow bg-white/30" />
        </FloatingElement>
        <FloatingElement intensity="medium" delay={1} className="absolute top-40 right-20">
          <div className="w-2 h-2 rounded-full bg-nature-cream/40" />
        </FloatingElement>
        <FloatingElement intensity="strong" delay={2} className="absolute bottom-40 left-20">
          <div className="w-4 h-4 rounded-full bg-white/20" />
        </FloatingElement>
        <FloatingElement intensity="light" delay={3} className="absolute top-60 right-40">
          <div className="w-2 h-2 rounded-full bg-nature-leaf/30" />
        </FloatingElement>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 z-10 text-center">
        <FadeInView direction="up" delay={0.2}>
          <div className="max-w-4xl mx-auto">
            {/* Audio Visualizer */}
            <div className="mb-8">
              <Card3D intensity="low" className="inline-block">
                <AudioVisualizer 
                  isPlaying={isPlaying} 
                  barCount={32}
                  className="h-24 mb-6"
                />
              </Card3D>
            </div>

            {/* Main Heading */}
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-tight text-white">
              <span className="bg-gradient-to-r bg-clip-text text-transparent animate-shimmer bg-300% from-white via-nature-cream to-white">
                Terra Echo
              </span>
              <br />
              <span className="text-4xl md:text-5xl lg:text-6xl font-light">
                Studios
              </span>
            </h1>

            {/* Tagline */}
            <FadeInView direction="up" delay={0.4}>
              <p className="text-2xl md:text-3xl mb-8 font-light tracking-wide text-nature-cream">
                Authentic Audio, Naturally Engineered
              </p>
            </FadeInView>

            {/* Interactive Audio Control */}
            <FadeInView direction="up" delay={0.6}>
              <Card3D intensity="medium" className="max-w-md mx-auto mb-10">
                <GlassCard className="p-6 bg-white/10 border-white/20">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <MagneticButton onClick={() => setIsPlaying(!isPlaying)}>
                        <Button
                          size="sm"
                          className="rounded-full w-12 h-12 bg-white/20 hover:bg-white/30 border-white/30 text-white"
                        >
                          {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                        </Button>
                      </MagneticButton>
                      <div className="text-white">
                        <p className="text-sm font-medium">Studio Preview</p>
                        <p className="text-xs text-white/70">
                          {formatTime(currentTime)}
                        </p>
                      </div>
                    </div>
                    <MagneticButton onClick={() => setIsMuted(!isMuted)}>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="rounded-full w-10 h-10 text-white hover:bg-white/20"
                      >
                        {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                      </Button>
                    </MagneticButton>
                  </div>
                  <div className="w-full rounded-full h-2 bg-white/20">
                    <div 
                      className="h-2 rounded-full transition-all duration-1000 bg-gradient-to-r from-nature-cream to-white"
                      style={{ width: `${(currentTime * 2) % 100}%` }}
                    />
                  </div>
                </GlassCard>
              </Card3D>
            </FadeInView>

            {/* Action Buttons */}
            <FadeInView direction="up" delay={0.8}>
              <div className="flex flex-col sm:flex-row justify-center gap-6">
                <Card3D intensity="low">
                  <MagneticButton onClick={() => scrollToSection("portfolio")}>
                    <Button 
                      size="lg"
                      className="text-lg py-6 px-10 rounded-full transform hover:scale-105 transition-all duration-300 shadow-2xl bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white border border-white/30"
                    >
                      Explore Portfolio
                    </Button>
                  </MagneticButton>
                </Card3D>
                
                <Card3D intensity="low">
                  <MagneticButton onClick={() => scrollToSection("contact")}>
                    <Button 
                      size="lg"
                      variant="outline"
                      className="text-lg py-6 px-10 rounded-full transform hover:scale-105 transition-all duration-300 shadow-2xl border-2 border-white/50 text-white hover:bg-white/20 backdrop-blur-sm"
                    >
                      Start Your Project
                    </Button>
                  </MagneticButton>
                </Card3D>
              </div>
            </FadeInView>
          </div>
        </FadeInView>
      </div>

      {/* Enhanced Scroll Indicator */}
      <FadeInView direction="up" delay={1}>
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
          <MagneticButton onClick={() => scrollToSection("about")}>
            <div className="flex flex-col items-center group transition-colors duration-300 text-white/80 hover:text-white">
              <span className="mb-3 text-sm font-medium tracking-wide">Discover Our Story</span>
              <div className="w-6 h-10 border-2 rounded-full flex justify-center group-hover:border-white transition-colors border-white/50">
                <div className="w-1 h-3 rounded-full mt-2 animate-bounce bg-white/70" />
              </div>
            </div>
          </MagneticButton>
        </div>
      </FadeInView>
    </div>
  );
};

export default InteractiveHeroEnhanced;
