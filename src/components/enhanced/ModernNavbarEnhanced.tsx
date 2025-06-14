
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import ThemeToggle from "@/components/ui/theme-toggle";
import MagneticButton from "@/components/animations/MagneticButton";
import FeedbackSettings from "@/components/interactive/FeedbackSettings";
import { Menu, X, Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";

const ModernNavbarEnhanced: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  const navItems = [
    { name: "Home", href: "#", id: "home" },
    { name: "About", href: "#about", id: "about" },
    { name: "Services", href: "#services", id: "services" },
    { name: "Portfolio", href: "#portfolio", id: "portfolio" },
    { name: "Contact", href: "#contact", id: "contact" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    const handleSectionChange = () => {
      const sections = navItems.map(item => document.getElementById(item.id));
      const scrollPos = window.scrollY + 100;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollPos) {
          setActiveSection(navItems[i].id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("scroll", handleSectionChange);
    handleScroll();
    handleSectionChange();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("scroll", handleSectionChange);
    };
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        isScrolled ? "py-2" : "py-4"
      )}>
        <div className="container mx-auto px-4">
          <GlassCard className={cn(
            "transition-all duration-500 transform",
            isScrolled 
              ? "bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-2xl" 
              : "bg-white/60 dark:bg-gray-900/60 backdrop-blur-lg",
            "border border-white/20 dark:border-gray-700/30"
          )}>
            <div className="flex items-center justify-between px-6 py-4">
              {/* Logo */}
              <MagneticButton
                onClick={() => scrollToSection("home")}
                className="group"
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-10 h-10 bg-gradient-to-r from-nature-forest to-nature-leaf rounded-xl flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300">
                      <Volume2 className="w-5 h-5 text-white" />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-nature-forest to-nature-leaf rounded-xl opacity-0 group-hover:opacity-20 animate-pulse" />
                  </div>
                  <span className="text-xl font-bold bg-gradient-to-r from-nature-forest to-nature-leaf bg-clip-text text-transparent dark:from-white dark:to-gray-300">
                    Terra Echo
                  </span>
                </div>
              </MagneticButton>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-1">
                {navItems.map((item) => (
                  <MagneticButton
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className="group relative"
                  >
                    <div className={cn(
                      "px-4 py-2 rounded-full transition-all duration-300",
                      activeSection === item.id
                        ? "bg-nature-forest/20 dark:bg-white/20 text-nature-forest dark:text-white"
                        : "text-nature-bark dark:text-gray-300 hover:text-nature-forest dark:hover:text-white hover:bg-nature-forest/10 dark:hover:bg-white/10"
                    )}>
                      {item.name}
                      
                      {/* Active indicator */}
                      {activeSection === item.id && (
                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-nature-forest dark:bg-white rounded-full animate-pulse" />
                      )}
                    </div>
                  </MagneticButton>
                ))}
              </div>

              {/* Right section */}
              <div className="flex items-center space-x-3">
                <ThemeToggle variant="floating" />
                <FeedbackSettings />
                
                {/* CTA Button */}
                <div className="hidden md:block">
                  <MagneticButton onClick={() => scrollToSection("contact")}>
                    <Button className="bg-gradient-to-r from-nature-forest to-nature-leaf hover:from-nature-leaf hover:to-nature-forest text-white border-0 shadow-lg hover:shadow-xl transform transition-all duration-300 px-6 py-2 rounded-full">
                      Get Started
                    </Button>
                  </MagneticButton>
                </div>

                {/* Mobile menu button */}
                <div className="md:hidden">
                  <MagneticButton onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 dark:bg-gray-800/50 dark:hover:bg-gray-700/50"
                    >
                      {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </Button>
                  </MagneticButton>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="absolute top-24 left-4 right-4">
            <GlassCard className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-white/20 dark:border-gray-700/30">
              <div className="p-6 space-y-4">
                {navItems.map((item) => (
                  <MagneticButton
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className="w-full text-left"
                  >
                    <div className={cn(
                      "w-full p-3 rounded-xl transition-all duration-300 text-lg",
                      activeSection === item.id
                        ? "bg-nature-forest/20 dark:bg-white/20 text-nature-forest dark:text-white"
                        : "text-nature-bark dark:text-gray-300 hover:bg-nature-forest/10 dark:hover:bg-white/10"
                    )}>
                      {item.name}
                    </div>
                  </MagneticButton>
                ))}
                
                <div className="pt-4 border-t border-nature-moss/20 dark:border-gray-700">
                  <MagneticButton onClick={() => scrollToSection("contact")} className="w-full">
                    <Button className="w-full bg-gradient-to-r from-nature-forest to-nature-leaf text-white rounded-xl py-3">
                      Get Started
                    </Button>
                  </MagneticButton>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      )}
    </>
  );
};

export default ModernNavbarEnhanced;
