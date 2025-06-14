
import React from "react";
import { ShuffleCards } from "@/components/ui/testimonial-cards";
import { testimonials } from "@/data/testimonials";

const Testimonials = () => {
  return (
    <section id="testimonials" className="py-20 bg-gradient-to-br from-nature-mist to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-nature-forest mb-4">
            What Our Clients Say
          </h2>
          <p className="text-xl text-nature-bark max-w-3xl mx-auto">
            Don't just take our word for it. Hear from artists and professionals who have experienced the Terra Echo difference.
          </p>
          <p className="text-sm text-nature-stone mt-4 italic">
            Drag the front card to see more testimonials
          </p>
        </div>

        <ShuffleCards testimonials={testimonials} />
      </div>
    </section>
  );
};

export default Testimonials;
