
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-sm z-50 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <img 
              src="/lovable-uploads/5bf7a89b-4112-422f-a28c-92df6c7ea6cf.png" 
              alt="Frog with Speaker Logo" 
              className="h-10 w-10 object-contain"
            />
            <span className="text-xl font-bold text-nature-forest">Will Hall Sound Studios</span>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => scrollToSection("about")}
              className="text-nature-bark hover:text-nature-forest transition-colors"
            >
              About
            </button>
            <button 
              onClick={() => scrollToSection("services")}
              className="text-nature-bark hover:text-nature-forest transition-colors"
            >
              Services
            </button>
            <button 
              onClick={() => scrollToSection("live-events")}
              className="text-nature-bark hover:text-nature-forest transition-colors"
            >
              Live Events
            </button>
            <button 
              onClick={() => scrollToSection("portfolio")}
              className="text-nature-bark hover:text-nature-forest transition-colors"
            >
              Portfolio
            </button>
            <button 
              onClick={() => scrollToSection("testimonials")}
              className="text-nature-bark hover:text-nature-forest transition-colors"
            >
              Testimonials
            </button>
            <Button 
              onClick={() => scrollToSection("contact")}
              className="bg-nature-forest hover:bg-nature-leaf text-white"
            >
              Contact
            </Button>
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button 
              onClick={toggleMenu}
              className="text-nature-forest focus:outline-none"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pt-4 pb-6 space-y-4 animate-fade-in">
            <button 
              onClick={() => scrollToSection("about")}
              className="block w-full text-left py-2 text-nature-bark hover:text-nature-forest transition-colors"
            >
              About
            </button>
            <button 
              onClick={() => scrollToSection("services")}
              className="block w-full text-left py-2 text-nature-bark hover:text-nature-forest transition-colors"
            >
              Services
            </button>
            <button 
              onClick={() => scrollToSection("live-events")}
              className="block w-full text-left py-2 text-nature-bark hover:text-nature-forest transition-colors"
            >
              Live Events
            </button>
            <button 
              onClick={() => scrollToSection("portfolio")}
              className="block w-full text-left py-2 text-nature-bark hover:text-nature-forest transition-colors"
            >
              Portfolio
            </button>
            <button 
              onClick={() => scrollToSection("testimonials")}
              className="block w-full text-left py-2 text-nature-bark hover:text-nature-forest transition-colors"
            >
              Testimonials
            </button>
            <Button 
              onClick={() => scrollToSection("contact")}
              className="w-full bg-nature-forest hover:bg-nature-leaf text-white"
            >
              Contact
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
