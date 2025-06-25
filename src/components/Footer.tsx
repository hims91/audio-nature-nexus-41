
import React from "react";
import { useSettings } from "@/hooks/useSettings";
import { Facebook, Instagram, Twitter, Linkedin, Youtube } from 'lucide-react';
import { useEnhancedAuth } from "@/contexts/EnhancedAuthContext";
import { Link } from "react-router-dom";
import { BrandLogo, BrandText } from "@/components/enhanced/BrandConsistencyManager";

const iconMap: { [key: string]: React.ElementType } = {
  facebook: Facebook,
  instagram: Instagram,
  twitter: Twitter,
  linkedin: Linkedin,
  youtube: Youtube,
};

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const { data: settings } = useSettings();
  const { user } = useEnhancedAuth();
  const socialLinks = (settings?.social_links as { platform: string; url: string }[]) || [];

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  return (
    <footer className="bg-nature-bark dark:bg-gray-900 text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Logo and About */}
          <div className="space-y-4">
            <BrandLogo 
              size="lg" 
              background="dark"
              className="mb-4"
            />
            <BrandText className="text-sm text-nature-cream/80 dark:text-gray-300">
              Authentic Audio, Naturally Engineered.
            </BrandText>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-nature-cream">Quick Links</h4>
            <ul className="space-y-2">
              {["About", "Services", "Portfolio", "Testimonials", "Contact"].map(item => (
                <li key={item}>
                  <button 
                    onClick={() => {
                      const element = document.getElementById(item.toLowerCase());
                      if (element) {
                        element.scrollIntoView({ behavior: "smooth" });
                      }
                    }} 
                    className="text-nature-cream/80 hover:text-nature-leaf dark:hover:text-nature-leaf transition-colors duration-300"
                  >
                    {item}
                  </button>
                </li>
              ))}
              {user && (
                <li>
                  <Link 
                    to="/profile" 
                    className="text-nature-cream/80 hover:text-nature-leaf dark:hover:text-nature-leaf transition-colors duration-300"
                  >
                    Profile
                  </Link>
                </li>
              )}
            </ul>
          </div>
          
          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-nature-cream">Services</h4>
            <ul className="space-y-2">
              {["Mixing", "Mastering", "Sound Design", "Music Editing", "Podcasting"].map(service => (
                <li key={service} className="text-nature-cream/80 dark:text-gray-300">
                  {service}
                </li>
              ))}
            </ul>
          </div>
          
          {/* Contact Us */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-nature-cream">Contact Us</h4>
            <ul className="space-y-2 text-nature-cream/80 dark:text-gray-300">
              <li>
                <a 
                  href="mailto:terraechostudios@gmail.com"
                  className="hover:text-nature-leaf dark:hover:text-nature-leaf transition-colors duration-300 underline"
                >
                  terraechostudios@gmail.com
                </a>
              </li>
              <li className="text-xs text-nature-cream/60 dark:text-gray-400 mt-2 pt-2 border-t border-white/10">
                Studio Hours: Monday - Sunday: 9:00 AM - 6:00 PM
              </li>
            </ul>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-nature-cream/70 dark:text-gray-400 mb-4 md:mb-0">
            © {currentYear} Terra Echo Studios. All rights reserved.
          </p>
          
          <div className="flex items-center space-x-6">
            {socialLinks.length > 0 && (
              <div className="flex space-x-4">
                {socialLinks.map((link) => {
                  const IconComponent = iconMap[link.platform.toLowerCase()];
                  return IconComponent ? (
                    <a
                      key={link.platform}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-nature-cream/70 hover:text-nature-leaf dark:hover:text-nature-leaf transition-colors duration-300"
                      aria-label={link.platform}
                    >
                      <IconComponent className="h-5 w-5" />
                    </a>
                  ) : null;
                })}
              </div>
            )}
            <button 
              onClick={scrollToTop} 
              className="text-sm text-nature-cream/70 hover:text-nature-leaf dark:hover:text-nature-leaf transition-colors duration-300"
            >
              Back to Top
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
