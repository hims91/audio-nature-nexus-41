import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";
import { useSettings } from "@/hooks/useSettings";
import { Skeleton } from "@/components/ui/skeleton";

const Hero: React.FC = () => {
  const { data: settings, isLoading } = useSettings();

  const scrollToAbout = () => {
    const element = document.getElementById("about");
    if (element) {
      element.scrollIntoView({
        behavior: "smooth"
      });
    }
  };
  return <div className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0" style={{
      backgroundImage: `url(https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8Mnx8dHJlZSUyMHNwZWFrZXJzfHwwfHx8fDE2MjE5Mzg0MzZ8MA&ixlib=rb-4.0.3&q=80&w=1080)`,
      filter: 'brightness(0.7)'
    }}>
        <div className="absolute inset-0 bg-nature-overlay bg-opacity-60"></div>
      </div>
      
      {/* Content */}
      <div className="container mx-auto px-4 z-10 text-center">
        <div className="max-w-3xl mx-auto">
          {/* Audio Waveform Animation */}
          <div className="flex justify-center items-end h-24 mb-6 space-x-[1px]">
            {[...Array(20)].map((_, i) => <div key={i} className="audio-bar" style={{
            height: `${Math.random() * 60 + 20}px`,
            animationDelay: `${i * 0.05}s`
          }}></div>)}
          </div>
          
          {isLoading ? (
            <Skeleton className="h-16 w-3/4 mx-auto mb-4 bg-white/20" />
          ) : (
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-3 drop-shadow-md">
              {settings?.site_name}
            </h1>
          )}
          
          {/* --- SLOGAN UNDER SITE NAME --- */}
          {isLoading ? (
            <Skeleton className="h-6 w-2/3 mx-auto mb-5 bg-white/20" />
          ) : (
            <div className="italic text-nature-cream/90 text-xl md:text-2xl md:mb-2 mb-5 drop-shadow-md font-medium">
              Authentic Audio, Naturally Engineered
            </div>
          )}
          
          {isLoading ? (
            <Skeleton className="h-8 w-1/2 mx-auto mb-10 bg-white/20" />
          ) : (
            <p className="text-xl md:text-2xl text-nature-cream mb-10 drop-shadow-md">
              {settings?.site_description}
            </p>
          )}
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button onClick={() => {
            const element = document.getElementById("portfolio");
            if (element) element.scrollIntoView({
              behavior: "smooth"
            });
          }} className="bg-nature-forest hover:bg-nature-leaf text-white text-lg py-6 px-8">
              Explore Portfolio
            </Button>
            
            <Button onClick={() => {
            const element = document.getElementById("contact");
            if (element) element.scrollIntoView({
              behavior: "smooth"
            });
          }} className="bg-transparent border-2 border-white text-white hover:bg-white/20 text-lg py-6 px-8">
              Get in Touch
            </Button>
          </div>
        </div>
      </div>
      
      {/* Scroll Down Indicator */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-white animate-bounce">
        <button onClick={scrollToAbout} className="flex flex-col items-center hover:text-nature-cream transition-colors duration-300 px-0 mx-0 text-center">
          <span className="mb-2 text-sm font-medium">Discover More</span>
          <ArrowDown size={24} />
        </button>
      </div>
    </div>;
};
export default Hero;
