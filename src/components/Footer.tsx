
import React from "react";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };
  
  return (
    <footer className="bg-nature-bark text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Logo and About */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <img 
                src="/lovable-uploads/f7382800-2251-4349-b6ee-b2e753232d10.png" 
                alt="Frog with Speaker Logo" 
                className="h-16 w-16 object-contain bg-white/90 rounded-md p-1"
              />
              <span className="text-xl font-bold">Will Hall Sound Studios</span>
            </div>
            
            <p className="text-sm text-nature-cream/80">
              Authentic Audio, Naturally Engineered.
            </p>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {["About", "Services", "Portfolio", "Testimonials", "Contact"].map((item) => (
                <li key={item}>
                  <button
                    onClick={() => {
                      const element = document.getElementById(item.toLowerCase());
                      if (element) element.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="text-nature-cream/80 hover:text-white transition-colors"
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Services</h4>
            <ul className="space-y-2">
              {["Mixing", "Mastering", "Sound Design", "Music Editing", "Podcasting"].map((service) => (
                <li key={service} className="text-nature-cream/80">
                  {service}
                </li>
              ))}
            </ul>
          </div>
          
          {/* Hours */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Studio Hours</h4>
            <ul className="space-y-2 text-nature-cream/80">
              <li>Monday - Sunday: 9:00 AM - 6:00 PM</li>
            </ul>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-nature-cream/70 mb-4 md:mb-0">
            &copy; {currentYear} Will Hall Sound Studios. All rights reserved.
          </p>
          
          <div className="flex space-x-4">
            <button onClick={scrollToTop} className="text-sm text-nature-cream/70 hover:text-white transition-colors">
              Back to Top
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
