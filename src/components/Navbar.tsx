import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, User, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const {
    user,
    signOut
  } = useAuth();
  const navigate = useNavigate();
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  const scrollToSection = (id: string) => {
    // Only scroll if we're on the home page
    if (window.location.pathname === '/') {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({
          behavior: "smooth"
        });
      }
    } else {
      // Navigate to home page first, then scroll
      navigate('/', {
        state: {
          scrollTo: id
        }
      });
    }
    setIsMenuOpen(false);
  };
  const handleSignOut = async () => {
    await signOut();
    navigate('/');
    setIsMenuOpen(false);
  };
  const handleAuthClick = () => {
    navigate('/auth');
    setIsMenuOpen(false);
  };
  const handlePortfolioManagement = () => {
    navigate('/manage-portfolio');
    setIsMenuOpen(false);
  };
  return <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-sm z-50 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/')}>
            <img src="/lovable-uploads/f7382800-2251-4349-b6ee-b2e753232d10.png" alt="Frog with Speaker Logo" className="h-16 w-16 object-contain" />
            <span className="text-xl font-bold text-nature-forest my-0">Terra Echo Studios</span>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <button onClick={() => scrollToSection("about")} className="text-nature-bark hover:text-nature-forest transition-colors">
              About
            </button>
            <button onClick={() => scrollToSection("services")} className="text-nature-bark hover:text-nature-forest transition-colors">
              Services
            </button>
            <button onClick={() => scrollToSection("live-events")} className="text-nature-bark hover:text-nature-forest transition-colors">
              Live Events
            </button>
            <button onClick={() => scrollToSection("portfolio")} className="text-nature-bark hover:text-nature-forest transition-colors">
              Portfolio
            </button>
            <button onClick={() => scrollToSection("testimonials")} className="text-nature-bark hover:text-nature-forest transition-colors">
              Testimonials
            </button>
            
            {user ? <div className="flex items-center space-x-4">
                <Button onClick={handlePortfolioManagement} variant="outline" className="border-nature-forest text-nature-forest hover:bg-nature-forest hover:text-white">
                  <User className="mr-2 h-4 w-4" />
                  Manage Portfolio
                </Button>
                <Button onClick={handleSignOut} variant="outline" className="border-nature-forest text-nature-forest hover:bg-nature-forest hover:text-white">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </Button>
              </div> : <div className="flex items-center space-x-4">
                <Button onClick={() => scrollToSection("contact")} className="bg-nature-forest hover:bg-nature-leaf text-white">
                  Contact
                </Button>
                <Button onClick={handleAuthClick} variant="outline" className="border-nature-forest text-nature-forest hover:bg-nature-forest hover:text-white">
                  Sign In
                </Button>
              </div>}
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={toggleMenu} className="text-nature-forest focus:outline-none">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {isMenuOpen && <div className="md:hidden pt-4 pb-6 space-y-4 animate-fade-in">
            <button onClick={() => scrollToSection("about")} className="block w-full text-left py-2 text-nature-bark hover:text-nature-forest transition-colors">
              About
            </button>
            <button onClick={() => scrollToSection("services")} className="block w-full text-left py-2 text-nature-bark hover:text-nature-forest transition-colors">
              Services
            </button>
            <button onClick={() => scrollToSection("live-events")} className="block w-full text-left py-2 text-nature-bark hover:text-nature-forest transition-colors">
              Live Events
            </button>
            <button onClick={() => scrollToSection("portfolio")} className="block w-full text-left py-2 text-nature-bark hover:text-nature-forest transition-colors">
              Portfolio
            </button>
            <button onClick={() => scrollToSection("testimonials")} className="block w-full text-left py-2 text-nature-bark hover:text-nature-forest transition-colors">
              Testimonials
            </button>
            
            {user ? <div className="space-y-2">
                <Button onClick={handlePortfolioManagement} className="w-full bg-nature-forest hover:bg-nature-leaf text-white">
                  <User className="mr-2 h-4 w-4" />
                  Manage Portfolio
                </Button>
                <Button onClick={handleSignOut} variant="outline" className="w-full border-nature-forest text-nature-forest hover:bg-nature-forest hover:text-white">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </Button>
              </div> : <div className="space-y-2">
                <Button onClick={() => scrollToSection("contact")} className="w-full bg-nature-forest hover:bg-nature-leaf text-white">
                  Contact
                </Button>
                <Button onClick={handleAuthClick} variant="outline" className="w-full border-nature-forest text-nature-forest hover:bg-nature-forest hover:text-white">
                  Sign In
                </Button>
              </div>}
          </div>}
      </div>
    </nav>;
};
export default Navbar;