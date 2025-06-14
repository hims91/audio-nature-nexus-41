
import React, { useState } from "react";
import FadeInView from "../animations/FadeInView";
import ServiceCard from "./services/ServiceCard";
import ServicesHeader from "./services/ServicesHeader";
import ServicesCallToAction from "./services/ServicesCallToAction";
import { servicesData } from "./services/servicesData";

const ServicesEnhanced: React.FC = () => {
  const [hoveredService, setHoveredService] = useState<number | null>(null);

  return (
    <section id="services" className="py-20 bg-white dark:bg-gray-900 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <ServicesHeader />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {servicesData.map((service, index) => (
            <FadeInView key={service.id} direction="up" delay={0.1 * index}>
              <ServiceCard
                service={service}
                isHovered={hoveredService === service.id}
                onHover={() => setHoveredService(service.id)}
                onLeave={() => setHoveredService(null)}
              />
            </FadeInView>
          ))}
        </div>

        <ServicesCallToAction />
      </div>
    </section>
  );
};

export default ServicesEnhanced;
