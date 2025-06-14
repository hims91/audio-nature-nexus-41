
import React from "react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import FadeInView from "../../animations/FadeInView";
import Card3D from "../../effects/Card3D";
import MagneticButton from "../../animations/MagneticButton";
import { ArrowRight } from "lucide-react";

const ServicesCallToAction: React.FC = () => {
  return (
    <FadeInView direction="up" delay={0.8}>
      <div className="text-center mt-16">
        <Card3D intensity="medium">
          <GlassCard className="max-w-2xl mx-auto p-8 bg-gradient-to-r from-nature-forest/10 to-nature-leaf/10 dark:from-blue-900/20 dark:to-purple-900/20">
            <h3 className="text-2xl font-semibold text-nature-forest dark:text-white mb-4">
              Ready to elevate your audio?
            </h3>
            <p className="text-nature-bark dark:text-gray-300 mb-6">
              Let's discuss your project and create something extraordinary together.
            </p>
            <MagneticButton>
              <Button 
                size="lg"
                className="bg-nature-forest hover:bg-nature-leaf text-white px-8 py-3 rounded-full transform hover:scale-105 transition-all duration-300"
                onClick={() => {
                  const element = document.getElementById("contact");
                  if (element) element.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Start Your Project
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </MagneticButton>
          </GlassCard>
        </Card3D>
      </div>
    </FadeInView>
  );
};

export default ServicesCallToAction;
