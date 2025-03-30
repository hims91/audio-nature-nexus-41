
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Testimonial } from "@/data/testimonials";

interface TestimonialCardProps {
  testimonial: Testimonial;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ testimonial }) => {
  return (
    <Card className="bg-white border-nature-moss/30 shadow-md h-full">
      <CardContent className="p-6 h-full flex flex-col">
        <div className="mb-4">
          <svg 
            className="h-10 w-10 text-nature-moss opacity-30" 
            fill="currentColor" 
            viewBox="0 0 24 24"
          >
            <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z" />
          </svg>
        </div>
        
        <p className="text-nature-bark mb-6 flex-grow italic">
          "{testimonial.content}"
        </p>
        
        <div className="mt-auto">
          <p className="font-semibold text-nature-forest">{testimonial.author}</p>
          <p className="text-sm text-nature-stone">
            {testimonial.role}, {testimonial.company}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default TestimonialCard;
