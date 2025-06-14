
import React from "react";
import CountUp from "../animations/CountUp";
import { Music, Users, Award, Clock } from "lucide-react";

const StatsCounter: React.FC = () => {
  const stats = [
    {
      icon: Music,
      value: 500,
      suffix: "+",
      label: "Projects Completed",
      description: "Professional audio projects delivered"
    },
    {
      icon: Users,
      value: 150,
      suffix: "+",
      label: "Happy Clients",
      description: "Artists and businesses worldwide"
    },
    {
      icon: Award,
      value: 8,
      label: "Years Experience",
      description: "In professional audio engineering"
    },
    {
      icon: Clock,
      value: 10000,
      suffix: "+",
      label: "Studio Hours",
      description: "Crafting perfect sound"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-nature-forest to-nature-leaf text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 border border-white/20 rounded-full"></div>
        <div className="absolute bottom-10 right-10 w-24 h-24 border border-white/20 rounded-full"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 border border-white/20 rounded-full"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            Our Impact in Numbers
          </h2>
          <p className="text-xl text-nature-cream max-w-2xl mx-auto">
            Building lasting relationships through exceptional audio craftsmanship
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="text-center group hover:transform hover:scale-105 transition-all duration-300"
            >
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 group-hover:bg-white/20 transition-all duration-300">
                <div className="bg-white/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <stat.icon className="w-8 h-8" />
                </div>
                
                <div className="text-4xl font-bold mb-2">
                  <CountUp 
                    end={stat.value} 
                    suffix={stat.suffix || ""} 
                    duration={2500}
                    className="text-white"
                  />
                </div>
                
                <h3 className="text-lg font-semibold mb-2 text-nature-cream">
                  {stat.label}
                </h3>
                
                <p className="text-sm text-nature-mist opacity-80">
                  {stat.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsCounter;
