
import React from "react";
import ServiceCard from "./ServiceCard";
import { services } from "@/data/services";

const Services: React.FC = () => {
  return (
    <section id="services" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-nature-forest mb-4">Services</h2>
          <p className="text-lg text-nature-bark max-w-3xl mx-auto">
            Professional audio services blending technical excellence with natural inspiration to bring your sonic vision to life.
          </p>
          <div className="w-20 h-1 bg-nature-forest mx-auto mt-4"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
