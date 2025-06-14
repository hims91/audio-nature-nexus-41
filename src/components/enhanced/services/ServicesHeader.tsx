
import React from "react";
import FadeInView from "../../animations/FadeInView";

const ServicesHeader: React.FC = () => {
  return (
    <FadeInView direction="up" delay={0.2}>
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold text-nature-forest dark:text-white mb-4 font-playfair">
          Professional <span className="text-gradient">Services</span>
        </h2>
        <p className="text-lg text-nature-bark dark:text-gray-300 max-w-3xl mx-auto">
          Comprehensive audio engineering services that blend technical excellence with natural inspiration 
          to bring your sonic vision to life.
        </p>
        <div className="w-24 h-1 bg-gradient-to-r from-nature-forest to-nature-leaf mx-auto mt-6 rounded-full" />
      </div>
    </FadeInView>
  );
};

export default ServicesHeader;
