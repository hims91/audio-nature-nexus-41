
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Calendar, User, MapPin, Phone, Mail } from "lucide-react";
import FadeInView from "../animations/FadeInView";
import MagneticButton from "../animations/MagneticButton";

const LaunchReadyHeader: React.FC = () => {
  return (
    <section className="relative min-h-screen bg-gradient-to-br from-nature-sage via-nature-mist to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwMDAiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] bg-repeat"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto text-center">
          <FadeInView direction="up">
            <Badge className="mb-6 bg-nature-forest text-white px-6 py-2 text-sm font-medium">
              🎵 Professional Audio Engineering Services
            </Badge>
          </FadeInView>

          <FadeInView direction="up" delay={0.1}>
            <h1 className="text-5xl md:text-7xl font-bold text-nature-forest dark:text-white mb-6 leading-tight">
              Terra Echo
              <br />
              <span className="bg-gradient-to-r from-nature-leaf to-nature-forest bg-clip-text text-transparent">
                Studios
              </span>
            </h1>
          </FadeInView>

          <FadeInView direction="up" delay={0.2}>
            <p className="text-xl md:text-2xl text-nature-bark dark:text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed">
              Transform your sound with our world-class audio engineering, mixing, mastering, 
              and sound design services. From podcasts to commercial productions, we bring your vision to life.
            </p>
          </FadeInView>

          <FadeInView direction="up" delay={0.3}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <MagneticButton>
                <Button 
                  size="lg"
                  className="bg-nature-forest hover:bg-nature-leaf text-white px-8 py-4 rounded-full text-lg font-medium transition-all duration-200 transform hover:scale-105 shadow-lg"
                  onClick={() => document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  <Play className="mr-2 h-5 w-5" />
                  Explore Our Work
                </Button>
              </MagneticButton>
              
              <MagneticButton>
                <Button 
                  variant="outline"
                  size="lg"
                  className="border-nature-forest text-nature-forest hover:bg-nature-forest hover:text-white px-8 py-4 rounded-full text-lg font-medium transition-all duration-200 transform hover:scale-105"
                  onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Get Quote
                </Button>
              </MagneticButton>
            </div>
          </FadeInView>

          <FadeInView direction="up" delay={0.4}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="bg-white/10 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="text-3xl font-bold text-nature-forest dark:text-white mb-2">500+</div>
                <div className="text-nature-bark dark:text-gray-300">Projects Completed</div>
              </div>
              <div className="bg-white/10 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="text-3xl font-bold text-nature-forest dark:text-white mb-2">10+</div>
                <div className="text-nature-bark dark:text-gray-300">Years Experience</div>
              </div>
              <div className="bg-white/10 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="text-3xl font-bold text-nature-forest dark:text-white mb-2">24/7</div>
                <div className="text-nature-bark dark:text-gray-300">Support Available</div>
              </div>
            </div>
          </FadeInView>

          {/* Contact Info Bar */}
          <FadeInView direction="up" delay={0.5}>
            <div className="mt-12 flex flex-wrap justify-center items-center gap-6 text-sm text-nature-bark dark:text-gray-400">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>Los Angeles, CA</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>hello@terraechostudios.com</span>
              </div>
            </div>
          </FadeInView>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-nature-forest rounded-full flex justify-center">
          <div className="w-1 h-3 bg-nature-forest rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default LaunchReadyHeader;
