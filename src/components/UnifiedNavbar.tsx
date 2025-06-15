import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, User, LogOut } from "lucide-react";
import { useEnhancedAuth } from "@/contexts/EnhancedAuthContext";
import UserProfileDropdown from "./auth/UserProfileDropdown";
import { useSettings } from "@/hooks/useSettings";
import { Skeleton } from "@/components/ui/skeleton";

const UnifiedNavbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut, isAdmin } = useEnhancedAuth();
  const { data: settings, isLoading } = useSettings();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.scrollTo) {
      const element = document.getElementById(location.state.scrollTo);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const scrollToSection = (id: string) => {
    if (window.location.pathname === '/') {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      navigate('/', { state: { scrollTo: id } });
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

  const handleAdminDashboard = () => {
    navigate('/admin/dashboard');
    setIsMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-sm z-50 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/')}>
            <img alt="Terra Echo Studios Logo" className="h-16 w-16 object-contain" src="/lovable-uploads/d1a61084-5eaf-41e1-a5f6-704cbf8197fe.png" />
            {isLoading ? (
              <Skeleton className="h-6 w-48" />
            ) : (
              <span className="text-xl font-bold text-nature-forest my-0">{settings?.site_name}</span>
            )}
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <button onClick={() => scrollToSection("about")} className="text-nature-bark hover:text-nature-forest transition-colors">
              About
            </button>
            <button onClick={() => scrollToSection("services")} className="text-nature-bark hover:text-nature-forest transition-colors">
              Services
            </button>
            <button onClick={() => scrollToSection("portfolio")} className="text-nature-bark hover:text-nature-forest transition-colors">
              Portfolio
            </button>
            <button onClick={() => scrollToSection("testimonials")} className="text-nature-bark hover:text-nature-forest transition-colors">
              Testimonials
            </button>
            
            {user ? (
              <div className="flex items-center space-x-4">
                <UserProfileDropdown />
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Button onClick={() => scrollToSection("contact")} className="bg-nature-forest hover:bg-nature-leaf text-white">
                  Contact
                </Button>
                <Button onClick={handleAuthClick} variant="outline" className="border-nature-forest text-nature-forest hover:bg-nature-forest hover:text-white">
                  Sign In
                </Button>
              </div>
            )}
          </div>
          
          <div className="md:hidden">
            <button onClick={toggleMenu} className="text-nature-forest focus:outline-none">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
        
        {isMenuOpen && (
          <div className="md:hidden pt-4 pb-6 space-y-4 animate-fade-in">
            <button onClick={() => scrollToSection("about")} className="block w-full text-left py-2 text-nature-bark hover:text-nature-forest transition-colors">
              About
            </button>
            <button onClick={() => scrollToSection("services")} className="block w-full text-left py-2 text-nature-bark hover:text-nature-forest transition-colors">
              Services
            </button>
            <button onClick={() => scrollToSection("portfolio")} className="block w-full text-left py-2 text-nature-bark hover:text-nature-forest transition-colors">
              Portfolio
            </button>
            <button onClick={() => scrollToSection("testimonials")} className="block w-full text-left py-2 text-nature-bark hover:text-nature-forest transition-colors">
              Testimonials
            </button>
            
            {user ? (
              <div className="space-y-2 border-t pt-4 mt-4">
                {isAdmin && (
                  <Button onClick={handleAdminDashboard} className="w-full bg-nature-forest hover:bg-nature-leaf text-white">
                    <User className="mr-2 h-4 w-4" />
                    Admin Dashboard
                  </Button>
                )}
                <Button onClick={handleSignOut} variant="outline" className="w-full border-nature-forest text-nature-forest hover:bg-nature-forest hover:text-white">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="space-y-2 border-t pt-4 mt-4">
                <Button onClick={() => scrollToSection("contact")} className="w-full bg-nature-forest hover:bg-nature-leaf text-white">
                  Contact
                </Button>
                <Button onClick={handleAuthClick} variant="outline" className="w-full border-nature-forest text-nature-forest hover:bg-nature-forest hover:text-white">
                  Sign In
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default UnifiedNavbar;
