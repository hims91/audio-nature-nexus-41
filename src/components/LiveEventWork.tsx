
import React from "react";
import { Button } from "@/components/ui/button";
import { Volume2, Music } from "lucide-react";

const LiveEventWork: React.FC = () => {
  return (
    <section id="live-events" className="py-20 bg-gradient-to-br from-nature-forest/10 to-nature-moss/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-nature-forest mb-4">Live Event Work</h2>
          <p className="text-lg text-nature-bark max-w-3xl mx-auto">
            Professional sound engineering for concerts, festivals, and live performances
          </p>
          <div className="w-20 h-1 bg-nature-forest mx-auto mt-4"></div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* FOH Mixing */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="relative h-64">
              <img 
                src="https://images.unsplash.com/photo-1605810230434-7631ac76ec81" 
                alt="Front of House Mixing" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-nature-forest/40 flex items-center justify-center">
                <Volume2 className="w-16 h-16 text-white" />
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-2xl font-semibold text-nature-forest mb-3">Front of House Mixing</h3>
              <p className="text-nature-bark mb-4">
                Expert live sound mixing to deliver exceptional audio clarity and balance for audiences of any size. From intimate venues to large festivals, I ensure your sound reaches every corner with impact and precision.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start">
                  <span className="text-nature-forest mr-2">•</span>
                  <span>Sound system setup and optimization</span>
                </li>
                <li className="flex items-start">
                  <span className="text-nature-forest mr-2">•</span>
                  <span>Acoustic analysis and room treatment</span>
                </li>
                <li className="flex items-start">
                  <span className="text-nature-forest mr-2">•</span>
                  <span>Real-time EQ, dynamics, and effects processing</span>
                </li>
              </ul>
            </div>
          </div>
          
          {/* Live Recording */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="relative h-64">
              <img 
                src="https://images.unsplash.com/photo-1511379938547-c1f69419868d" 
                alt="Live Recording" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-nature-forest/40 flex items-center justify-center">
                <Music className="w-16 h-16 text-white" />
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-2xl font-semibold text-nature-forest mb-3">Live Recording</h3>
              <p className="text-nature-bark mb-4">
                Capture the energy and essence of your live performances with multi-track recording services. Perfect for creating live albums, video content, or archival purposes.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start">
                  <span className="text-nature-forest mr-2">•</span>
                  <span>Multi-track recording up to 64 channels</span>
                </li>
                <li className="flex items-start">
                  <span className="text-nature-forest mr-2">•</span>
                  <span>Redundant recording systems for backup</span>
                </li>
                <li className="flex items-start">
                  <span className="text-nature-forest mr-2">•</span>
                  <span>Post-production mixing and mastering available</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="text-center mt-12">
          <Button 
            onClick={() => {
              const element = document.getElementById("contact");
              if (element) element.scrollIntoView({ behavior: "smooth" });
            }}
            className="bg-nature-forest hover:bg-nature-leaf text-white"
          >
            Book Your Live Event
          </Button>
        </div>
      </div>
    </section>
  );
};

export default LiveEventWork;
