
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
              Hi, I'm Will Hall
            </h3>
            
            <p className="text-lg text-nature-bark">
              I'm an audio engineer and sound designer obsessed with the power of sonic storytelling. 
              With a passion for blending natural soundscapes with modern production techniques, I 
              specialize in crafting immersive audio experiences. I bring a deep love for sound and 
              a detail-driven approach to every project.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
              <Card className="bg-white/70 border-nature-moss/30">
                <CardContent className="p-6">
                  <h4 className="text-xl font-semibold text-nature-forest mb-2">Education</h4>
                  <p className="text-nature-bark">I earned my Bachelor of Science in Audio Engineering from Belmont University, with a minor in Music Business. Alongside my formal education, I am Dante Level 3 certified, equipping me with advanced expertise in audio networking and signal flow.</p>
                </CardContent>
              </Card>
              
              <Card className="bg-white/70 border-nature-moss/30">
                <CardContent className="p-6">
                  <h4 className="text-xl font-semibold text-nature-forest mb-2">Experience</h4>
                  <p className="text-nature-bark">With over seven years of freelance experience, I've worked on short films, commercials, 150+ podcast episodes, and countless band projects—from tracking and mixing to mastering and post-production. I've had the privilege of collaborating with talented artists/Creators like Spookie, Nashville Tour Stop, and Grace Pelle, helping shape their sonic identity.</p>
                </CardContent>
              </Card>
              
              <Card className="bg-white/70 border-nature-moss/30">
                <CardContent className="p-6">
                  <h4 className="text-xl font-semibold text-nature-forest mb-2">Specialties</h4>
                  <p className="text-nature-bark">My expertise spans music editing, mixing, mastering, sound design, podcast editing, sound for picture, and audio restoration. Whether fine-tuning a track for release or bringing a film's soundscape to life, I focus on clarity, depth, and emotional impact.</p>
                </CardContent>
              </Card>
              
              <Card className="bg-white/70 border-nature-moss/30">
                <CardContent className="p-6">
                  <h4 className="text-xl font-semibold text-nature-forest mb-2">Approach</h4>
                  <p className="text-nature-bark">I believe that sound should feel organic, immersive, and emotionally resonant. My approach blends natural and live-recorded elements with the warmth of electronic production, creating textures that feel both timeless and modern. By carefully sculpting sonic landscapes, I ensure every project has depth, clarity, and a unique signature.</p>
                </CardContent>
              </Card>
            </div>
            
            {/* Philosophy Section */}
            <div className="mt-8 bg-white/70 border-nature-moss/30 rounded-lg p-6 shadow-sm">
              <h4 className="text-xl font-semibold text-nature-forest mb-3">My Philosophy on Sound</h4>
              <p className="text-nature-bark">
                Sound is more than just vibration—it's emotion, movement, and memory. A single note can 
                transport you, a well-placed sound can shift a mood, and a carefully crafted mix can make 
                the intangible feel real. I strive to create sonic landscapes that don't just sound good 
                but feel alive.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
