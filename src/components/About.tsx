
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

const About: React.FC = () => {
  return (
    <section id="about" className="py-20 bg-nature-cream/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-nature-forest mb-4">About Me</h2>
          <div className="w-20 h-1 bg-nature-forest mx-auto"></div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* Image Side */}
          <div className="relative">
            <div className="bg-nature-forest/10 absolute inset-0 rounded-lg transform rotate-3"></div>
            <img 
              src="https://images.unsplash.com/photo-1521106581313-72a2b5a7a8a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8c3R1ZGlvLGF1ZGlvLGVuZ2luZWVyfHx8fHx8MTcyMTkzODQzNg&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080" 
              alt="Audio Engineer in Studio" 
              className="rounded-lg shadow-xl relative z-10 object-cover h-full"
            />
          </div>
          
          {/* Content Side */}
          <div className="space-y-6">
            <h3 className="text-2xl md:text-3xl font-semibold text-nature-forest">
              Audio Engineering & Sound Design with a Natural Touch
            </h3>
            
            <p className="text-lg text-nature-bark">
              With over 10 years of experience in audio engineering and sound design, I bring a unique perspective inspired by the natural world to every project. My approach blends technical precision with organic creativity.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
              <Card className="bg-white/70 border-nature-moss/30">
                <CardContent className="p-6">
                  <h4 className="text-xl font-semibold text-nature-forest mb-2">Education</h4>
                  <p className="text-nature-bark">Master's in Audio Engineering from Berklee College of Music</p>
                </CardContent>
              </Card>
              
              <Card className="bg-white/70 border-nature-moss/30">
                <CardContent className="p-6">
                  <h4 className="text-xl font-semibold text-nature-forest mb-2">Experience</h4>
                  <p className="text-nature-bark">Worked with Grammy-winning artists and major film productions</p>
                </CardContent>
              </Card>
              
              <Card className="bg-white/70 border-nature-moss/30">
                <CardContent className="p-6">
                  <h4 className="text-xl font-semibold text-nature-forest mb-2">Specialties</h4>
                  <p className="text-nature-bark">Nature-inspired sound design and organic audio processing</p>
                </CardContent>
              </Card>
              
              <Card className="bg-white/70 border-nature-moss/30">
                <CardContent className="p-6">
                  <h4 className="text-xl font-semibold text-nature-forest mb-2">Approach</h4>
                  <p className="text-nature-bark">Blending traditional techniques with modern innovation</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
