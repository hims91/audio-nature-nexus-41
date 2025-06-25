
import React from "react";
import ContactFormEnhanced from "./enhanced/ContactFormEnhanced";
import { BrandHeading, BrandText } from "@/components/enhanced/BrandConsistencyManager";

const Contact = () => {
  return (
    <section id="contact" className="py-20 bg-gradient-to-br from-nature-mist to-white dark:from-nature-bark dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <BrandHeading level={2} gradient className="mb-4">
            Let's Create Something Amazing
          </BrandHeading>
          <BrandText variant="secondary" className="text-xl max-w-3xl mx-auto">
            Ready to bring your audio vision to life? Get in touch and let's discuss your project.
          </BrandText>
        </div>
        
        <ContactFormEnhanced />
        
        <div className="mt-16 text-center">
          <BrandText variant="secondary" className="mb-4">
            Or reach out directly at:
          </BrandText>
          <a 
            href="mailto:TerraEchoStudios@gmail.com"
            className="text-nature-forest dark:text-nature-leaf font-semibold hover:text-nature-leaf dark:hover:text-nature-forest transition-colors duration-300"
          >
            TerraEchoStudios@gmail.com
          </a>
        </div>
      </div>
    </section>
  );
};

export default Contact;
