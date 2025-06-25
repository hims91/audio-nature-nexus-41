
import React from "react";
import TestimonialCarousel from "./interactive/TestimonialCarousel";
import { BrandHeading, BrandText } from "@/components/enhanced/BrandConsistencyManager";

const Testimonials = () => {
  return (
    <section id="testimonials" className="py-20 bg-gradient-to-br from-nature-mist to-white dark:from-nature-bark dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <BrandHeading level={2} gradient className="mb-4">
            What Our Clients Say
          </BrandHeading>
          <BrandText variant="secondary" className="text-xl max-w-3xl mx-auto">
            Don't just take our word for it. Hear from artists and professionals who have experienced the Terra Echo difference.
          </BrandText>
        </div>

        <TestimonialCarousel />
      </div>
    </section>
  );
};

export default Testimonials;
