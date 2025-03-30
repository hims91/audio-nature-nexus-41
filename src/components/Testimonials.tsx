
import React from "react";
import TestimonialCard from "./TestimonialCard";
import { testimonials } from "@/data/testimonials";

const Testimonials: React.FC = () => {
  return (
    <section id="testimonials" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-nature-forest mb-4">Client Testimonials</h2>
          <p className="text-lg text-nature-bark max-w-3xl mx-auto">
            What clients say about working together on their audio projects
          </p>
          <div className="w-20 h-1 bg-nature-forest mx-auto mt-4"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
