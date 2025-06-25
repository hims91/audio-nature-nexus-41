
import React from "react";
import { Testimonial } from "@/data/testimonials";
import BrandCard, { BrandCardContent } from "@/components/enhanced/BrandCard";
import { BrandText } from "@/components/enhanced/BrandConsistencyManager";

interface TestimonialCardProps {
  testimonial: Testimonial;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ testimonial }) => {
  return (
    <BrandCard variant="elevated" className="h-full">
      <BrandCardContent className="p-6 h-full flex flex-col">
        <div className="mb-4">
          <svg 
            className="h-10 w-10 text-nature-moss dark:text-nature-sage opacity-30" 
            fill="currentColor" 
            viewBox="0 0 24 24"
          >
            <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z" />
          </svg>
        </div>
        
        <BrandText variant="secondary" className="mb-6 flex-grow italic">
          "{testimonial.content}"
        </BrandText>
        
        <div className="mt-auto">
          <BrandText variant="primary" className="font-semibold">{testimonial.name}</BrandText>
          <BrandText variant="muted" className="text-sm">{testimonial.role}</BrandText>
        </div>
      </BrandCardContent>
    </BrandCard>
  );
};

export default TestimonialCard;
