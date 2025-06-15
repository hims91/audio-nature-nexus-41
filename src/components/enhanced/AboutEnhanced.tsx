
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { GlassCard } from "@/components/ui/glass-card";
import FadeInView from "../animations/FadeInView";
import FloatingElement from "../animations/FloatingElement";
import Card3D from "../effects/Card3D";
import MagneticButton from "../animations/MagneticButton";
import { Badge } from "@/components/ui/badge";
import { User, Award, Clock, Target } from "lucide-react";

const AboutEnhanced: React.FC = () => {
  const [activeTab, setActiveTab] = useState("story");
  
  const tabs = [
    {
      id: "story",
      label: "My Story",
      icon: User
    },
    {
      id: "education",
      label: "Education",
      icon: Award
    },
    {
      id: "experience",
      label: "Experience",
      icon: Clock
    },
    {
      id: "approach",
      label: "Approach",
      icon: Target
    }
  ];

  const skills = [
    {
      name: "Audio Engineering",
      description: "Professional recording, mixing, and mastering with industry-standard equipment"
    },
    {
      name: "Sound Design",
      description: "Creative audio production for films, games, and multimedia projects"
    },
    {
      name: "Mixing & Mastering",
      description: "Expert level mixing and mastering for music and audio content"
    },
    {
      name: "Podcast Production",
      description: "Complete podcast production workflow from recording to final delivery"
    },
    {
      name: "Dolby Atmos",
      description: "Immersive audio production and spatial sound design capabilities"
    },
    {
      name: "Live Recording",
      description: "On-location recording and live sound engineering for events"
    }
  ];

  return (
    <section id="about" className="py-20 bg-gradient-to-br from-nature-cream/30 via-white to-nature-mist/50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
      {/* Background Elements */}
      <FloatingElement intensity="light" delay={0} className="absolute top-10 right-10">
        <div className="w-8 h-8 bg-nature-forest/20 dark:bg-white/20 rounded-full animate-pulse-slow" />
      </FloatingElement>
      <FloatingElement intensity="medium" delay={2} className="absolute bottom-20 left-10">
        <div className="w-6 h-6 bg-nature-leaf/30 dark:bg-blue-400/30 rounded-full" />
      </FloatingElement>

      <div className="container mx-auto px-4">
        <FadeInView direction="up" delay={0.2}>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-nature-forest dark:text-white mb-4 font-playfair">
              About <span className="text-gradient">Will Hall</span>
            </h2>
            <p className="text-lg text-nature-bark dark:text-gray-300 max-w-2xl mx-auto">
              Crafting sonic landscapes that resonate with authenticity and technical excellence
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-nature-forest to-nature-leaf mx-auto mt-6 rounded-full" />
          </div>
        </FadeInView>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Image Side with Enhanced 3D Design */}
          <FadeInView direction="left" delay={0.4}>
            <Card3D intensity="medium" glowEffect={true} className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-nature-forest/20 to-nature-leaf/20 rounded-2xl transform rotate-3 group-hover:rotate-6 transition-transform duration-500" />
              <div className="relative bg-white dark:bg-gray-800 p-2 rounded-2xl shadow-2xl">
                <img
                  src="/lovable-uploads/40101aee-c085-43b1-a83a-03ed8d362687.png"
                  alt="Will Hall holding a speaker in nature"
                  className="rounded-xl w-full h-auto object-cover"
                />
                <div className="absolute top-4 right-4">
                  <Badge className="bg-nature-forest text-white shadow-lg">
                    Audio Engineer
                  </Badge>
                </div>
              </div>
            </Card3D>
          </FadeInView>

          {/* Content Side */}
          <FadeInView direction="right" delay={0.6}>
            <div className="space-y-8">
              {/* Tab Navigation with 3D effects */}
              <div className="flex flex-wrap gap-2">
                {tabs.map((tab) => {
                  const IconComponent = tab.icon;
                  return (
                    <MagneticButton key={tab.id}>
                      <button
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center px-4 py-2 rounded-full transition-all duration-300 ${
                          activeTab === tab.id
                            ? 'bg-nature-forest text-white shadow-lg transform scale-105'
                            : 'bg-white/50 dark:bg-gray-800/50 text-nature-bark dark:text-gray-300 hover:bg-white/80 dark:hover:bg-gray-700/80 hover:scale-102'
                        }`}
                      >
                        <IconComponent className="w-4 h-4 mr-2" />
                        {tab.label}
                      </button>
                    </MagneticButton>
                  );
                })}
              </div>

              {/* Tab Content with 3D cards */}
              <div className="min-h-[300px]">
                {activeTab === "story" && (
                  <FadeInView direction="up" delay={0.2}>
                    <Card3D intensity="low">
                      <GlassCard className="p-6 bg-white/70 dark:bg-gray-800/70">
                        <h3 className="text-2xl font-semibold text-nature-forest dark:text-white mb-4">Hi, I'm Will</h3>
                        <p className="text-nature-bark dark:text-gray-300 leading-relaxed mb-4">
                          I'm an audio engineer and sound designer obsessed with the power of sonic storytelling. 
                          With a passion for blending natural soundscapes with modern production techniques, I 
                          specialize in crafting immersive audio experiences.
                        </p>
                        <p className="text-nature-bark dark:text-gray-300 leading-relaxed">
                          I bring a deep love for sound and a detail-driven approach to every project, ensuring 
                          that each piece resonates with both technical excellence and emotional depth.
                        </p>
                      </GlassCard>
                    </Card3D>
                  </FadeInView>
                )}

                {activeTab === "education" && (
                  <FadeInView direction="up" delay={0.2}>
                    <Card3D intensity="low">
                      <GlassCard className="p-6 bg-white/70 dark:bg-gray-800/70">
                        <h3 className="text-2xl font-semibold text-nature-forest dark:text-white mb-4">Education & Certifications</h3>
                        <div className="space-y-4">
                          <div className="border-l-4 border-nature-forest pl-4">
                            <h4 className="font-semibold text-nature-forest dark:text-white">Bachelor of Science in Audio Engineering</h4>
                            <p className="text-nature-bark dark:text-gray-300">Belmont University</p>
                            <p className="text-sm text-nature-stone dark:text-gray-400">Minor in Music Business</p>
                          </div>
                          <div className="border-l-4 border-nature-leaf pl-4">
                            <h4 className="font-semibold text-nature-forest dark:text-white">Dante Level 3 Certification</h4>
                            <p className="text-nature-bark dark:text-gray-300">Advanced Audio Networking</p>
                            <p className="text-sm text-nature-stone dark:text-gray-400">Expert in digital audio signal flow</p>
                          </div>
                        </div>
                      </GlassCard>
                    </Card3D>
                  </FadeInView>
                )}

                {activeTab === "experience" && (
                  <FadeInView direction="up" delay={0.2}>
                    <Card3D intensity="low">
                      <GlassCard className="p-6 bg-white/70 dark:bg-gray-800/70">
                        <h3 className="text-2xl font-semibold text-nature-forest dark:text-white mb-4">Professional Experience</h3>
                        <p className="text-nature-bark dark:text-gray-300 leading-relaxed mb-4">
                          With over seven years of freelance experience, I've worked on short films, commercials, 
                          150+ podcast episodes, and countless band projects—from tracking and mixing to mastering 
                          and post-production.
                        </p>
                        <p className="text-nature-bark dark:text-gray-300 leading-relaxed">
                          I've had the privilege of collaborating with talented artists like Spookie, Nashville Tour Stop, 
                          and Grace Pelle, helping shape their sonic identity through expert audio engineering.
                        </p>
                      </GlassCard>
                    </Card3D>
                  </FadeInView>
                )}

                {activeTab === "approach" && (
                  <FadeInView direction="up" delay={0.2}>
                    <Card3D intensity="low">
                      <GlassCard className="p-6 bg-white/70 dark:bg-gray-800/70">
                        <h3 className="text-2xl font-semibold text-nature-forest dark:text-white mb-4">My Philosophy on Sound</h3>
                        <p className="text-nature-bark dark:text-gray-300 leading-relaxed mb-4">
                          Sound is more than just vibration—it's emotion, movement, and memory. A single note can 
                          transport you, a well-placed sound can shift a mood, and a carefully crafted mix can make 
                          the intangible feel real.
                        </p>
                        <p className="text-nature-bark dark:text-gray-300 leading-relaxed">
                          I strive to create sonic landscapes that don't just sound good but feel alive, blending 
                          natural and live-recorded elements with the warmth of electronic production.
                        </p>
                      </GlassCard>
                    </Card3D>
                  </FadeInView>
                )}
              </div>

              {/* Skills Section with clean text design */}
              <Card3D intensity="low">
                <GlassCard className="p-6 bg-white/70 dark:bg-gray-800/70">
                  <h4 className="text-xl font-semibold text-nature-forest dark:text-white mb-4">Expertise</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {skills.map((skill) => (
                      <div key={skill.name} className="p-3 rounded-lg bg-white/50 dark:bg-gray-700/50 border border-nature-cream/50 dark:border-gray-600/50">
                        <h5 className="font-medium text-nature-forest dark:text-white mb-1">{skill.name}</h5>
                        <p className="text-sm text-nature-bark dark:text-gray-300">{skill.description}</p>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              </Card3D>
            </div>
          </FadeInView>
        </div>
      </div>
    </section>
  );
};

export default AboutEnhanced;
