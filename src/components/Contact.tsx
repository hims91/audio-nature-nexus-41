
import React from "react";
import ContactFormEnhanced from "./enhanced/ContactFormEnhanced";

const Contact = () => {
  return (
    <section id="contact" className="py-20 bg-gradient-to-br from-nature-mist to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-nature-forest mb-4">
            Let's Create Something Amazing
          </h2>
          <p className="text-xl text-nature-bark max-w-3xl mx-auto">
            Ready to bring your audio vision to life? Get in touch and let's discuss your project.
          </p>
        </div>
        
        <ContactFormEnhanced />
        
        <div className="mt-16 text-center">
          <p className="text-nature-bark mb-4">
            Or reach out directly at:
          </p>
          <a 
            href="mailto:TerraEchoStudios@gmail.com"
            className="text-nature-forest font-semibold hover:text-nature-leaf transition-colors"
          >
            TerraEchoStudios@gmail.com
          </a>
        </div>
      </div>
    </section>
  );
};

export default Contact;
