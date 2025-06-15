
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, Users, Clock, Star } from "lucide-react";
import FadeInView from "../animations/FadeInView";
import CountUp from "../animations/CountUp";
import ParallaxSection from "../animations/ParallaxSection";

const AboutEnhanced = () => {
  const skills = [
    "Audio Mixing & Mastering",
    "Sound Design for Film & TV",
    "Dolby Atmos Production",
    "Podcast Production & Editing",
    "Music Production",
    "Live Sound Engineering",
    "Studio Recording",
    "Audio Restoration"
  ];

  const stats = [
    { icon: Users, value: 500, label: "Projects Completed", suffix: "+" },
    { icon: Award, value: 15, label: "Years Experience", suffix: "" },
    { icon: Clock, value: 10000, label: "Studio Hours", suffix: "+" },
    { icon: Star, value: 50, label: "Happy Clients", suffix: "+" }
  ];

  return (
    <section id="about" className="py-20 bg-gradient-to-br from-nature-sage to-nature-mist">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <FadeInView direction="up" delay={0.2}>
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-nature-forest mb-4">
              About Terra Echo Studios
            </h2>
            <p className="text-xl text-nature-bark max-w-3xl mx-auto">
              Bringing your audio vision to life with professional expertise and natural creativity.
            </p>
          </div>
        </FadeInView>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <FadeInView key={index} direction="up" delay={0.1 * index}>
              <Card className="text-center bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-6">
                  <stat.icon className="h-8 w-8 text-nature-forest mx-auto mb-2" />
                  <div className="text-3xl font-bold text-nature-forest mb-1">
                    <CountUp end={stat.value} duration={2000} />
                    {stat.suffix}
                  </div>
                  <p className="text-sm text-nature-bark">{stat.label}</p>
                </CardContent>
              </Card>
            </FadeInView>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <FadeInView direction="left" delay={0.3}>
            <div className="space-y-6">
              <h3 className="text-3xl font-bold text-nature-forest">
                Professional Audio Engineering
              </h3>
              
              <div className="space-y-4 text-nature-bark">
                <p>
                  With over 15 years of experience in professional audio engineering, 
                  Terra Echo Studios combines technical expertise with artistic vision 
                  to deliver exceptional results for every project.
                </p>
                
                <p>
                  From intimate acoustic recordings to cinematic soundscapes, we specialize 
                  in capturing the authentic essence of your audio while applying the latest 
                  in digital audio technology.
                </p>
                
                <p>
                  Our state-of-the-art studio environment and meticulous attention to detail 
                  ensure that every project meets the highest industry standards while 
                  maintaining the natural character that makes your audio unique.
                </p>
              </div>

              {/* Skills without percentage bars */}
              <div>
                <h4 className="text-xl font-semibold text-nature-forest mb-4">
                  Areas of Expertise
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {skills.map((skill, index) => (
                    <div key={index} className="flex items-center">
                      <Badge 
                        variant="outline" 
                        className="bg-white/60 border-nature-forest text-nature-forest hover:bg-nature-forest hover:text-white transition-colors"
                      >
                        {skill}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </FadeInView>

          {/* Image */}
          <FadeInView direction="right" delay={0.4}>
            <ParallaxSection offset={30}>
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8M3x8YXVkaW8lMjBlbmdpbmVlcmluZ3x8MHx8fHwxNjIxOTM4NDM2fDA&ixlib=rb-4.0.3&q=80&w=1080"
                  alt="Professional Audio Engineering Setup"
                  className="rounded-lg shadow-2xl w-full h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-nature-forest/20 to-transparent rounded-lg"></div>
              </div>
            </ParallaxSection>
          </FadeInView>
        </div>

        {/* Testimonials Section Placeholder */}
        <FadeInView direction="up" delay={0.5}>
          <div className="mt-20 text-center">
            <h3 className="text-3xl font-bold text-nature-forest mb-8">
              What Our Clients Say
            </h3>
            <div className="bg-white/60 backdrop-blur-sm rounded-lg p-8 border border-nature-forest/20">
              <p className="text-nature-bark text-lg italic mb-4">
                "Client testimonials will be featured here. This space is ready for new testimonials to be added."
              </p>
              <p className="text-sm text-nature-bark/70">
                More testimonials coming soon...
              </p>
            </div>
          </div>
        </FadeInView>
      </div>
    </section>
  );
};

export default AboutEnhanced;
