
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, User, LogOut, Home } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { GlassCard } from "@/components/ui/glass-card";

const ModernNavbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  const navItems = [
    { label: "About", id: "about" },
    { label: "Services", id: "services" },
    { label: "Live Events", id: "live-events" },
    { label: "Portfolio", id: "portfolio" },
    { label: "Testimonials", id: "testimonials" },
  ];

  return (
    <>
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        isScrolled ? 'py-2' : 'py-4'
      }`}>
        <div className="container mx-auto px-4">
          <GlassCard className={`transition-all duration-500 ${
            isScrolled ? 'bg-white/95 backdrop-blur-lg shadow-2xl' : 'bg-white/10 backdrop-blur-sm'
          }`}>
            <div className="flex items-center justify-between p-4">
              {/* Logo */}
              <div 
                className="flex items-center space-x-3 cursor-pointer group"
                onClick={() => navigate('/')}
              >
                <div className="relative">
                  <img
                    alt="Terra Echo Studios Logo"
                    className="h-12 w-12 object-contain rounded-lg transform group-hover:scale-110 transition-transform duration-300"
                    src="/lovable-uploads/797bd198-b3f0-4c98-b3ca-43e5fc774521.png"
                  />
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-nature-forest/20 to-nature-leaf/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <span className={`text-xl font-bold transition-colors duration-300 ${
                  isScrolled ? 'text-nature-forest' : 'text-white'
                }`}>
                  Terra Echo Studios
                </span>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden lg:flex items-center space-x-8">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`relative font-medium transition-all duration-300 hover:scale-105 group ${
                      isScrolled ? 'text-nature-bark hover:text-nature-forest' : 'text-white/90 hover:text-white'
                    }`}
                  >
                    {item.label}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-nature-forest to-nature-leaf group-hover:w-full transition-all duration-300" />
                  </button>
                ))}
              </div>

              {/* Desktop Actions */}
              <div className="hidden lg:flex items-center space-x-4">
                {user ? (
                  <div className="flex items-center space-x-3">
                    <Button
                      onClick={() => navigate('/manage-portfolio')}
                      variant="outline"
                      size="sm"
                      className={`rounded-full border-2 transition-all duration-300 hover:scale-105 ${
                        isScrolled 
                          ? 'border-nature-forest text-nature-forest hover:bg-nature-forest hover:text-white' 
                          : 'border-white/50 text-white hover:bg-white/20'
                      }`}
                    >
                      <User className="mr-2 h-4 w-4" />
                      Manage
                    </Button>
                    <Button
                      onClick={signOut}
                      variant="outline"
                      size="sm"
                      className={`rounded-full border-2 transition-all duration-300 hover:scale-105 ${
                        isScrolled 
                          ? 'border-nature-forest text-nature-forest hover:bg-nature-forest hover:text-white' 
                          : 'border-white/50 text-white hover:bg-white/20'
                      }`}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-3">
                    <Button
                      onClick={() => scrollToSection("contact")}
                      className={`rounded-full px-6 transition-all duration-300 hover:scale-105 ${
                        isScrolled 
                          ? 'bg-nature-forest hover:bg-nature-leaf text-white' 
                          : 'bg-white/20 hover:bg-white/30 text-white border border-white/30'
                      }`}
                    >
                      Get in Touch
                    </Button>
                    <Button
                      onClick={() => navigate('/auth')}
                      variant="outline"
                      className={`rounded-full border-2 transition-all duration-300 hover:scale-105 ${
                        isScrolled 
                          ? 'border-nature-forest text-nature-forest hover:bg-nature-forest hover:text-white' 
                          : 'border-white/50 text-white hover:bg-white/20'
                      }`}
                    >
                      Sign In
                    </Button>
                  </div>
                )}
              </div>

              {/* Mobile Menu Button */}
              <div className="lg:hidden">
                <Button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  size="sm"
                  variant="ghost"
                  className={`rounded-full ${
                    isScrolled ? 'text-nature-forest hover:bg-nature-forest/10' : 'text-white hover:bg-white/20'
                  }`}
                >
                  {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </Button>
              </div>
            </div>
          </GlassCard>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)} />
          <div className="absolute top-24 left-4 right-4">
            <GlassCard className="bg-white/95 backdrop-blur-lg p-6">
              <div className="space-y-4">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className="block w-full text-left py-3 px-4 rounded-lg text-nature-bark hover:bg-nature-forest/10 hover:text-nature-forest transition-all duration-300 font-medium"
                  >
                    {item.label}
                  </button>
                ))}
                
                <div className="border-t border-nature-moss/30 pt-4 space-y-3">
                  {user ? (
                    <>
                      <Button
                        onClick={() => {
                          navigate('/manage-portfolio');
                          setIsMenuOpen(false);
                        }}
                        className="w-full bg-nature-forest hover:bg-nature-leaf text-white rounded-lg"
                      >
                        <User className="mr-2 h-4 w-4" />
                        Manage Portfolio
                      </Button>
                      <Button
                        onClick={() => {
                          signOut();
                          setIsMenuOpen(false);
                        }}
                        variant="outline"
                        className="w-full border-nature-forest text-nature-forest hover:bg-nature-forest hover:text-white rounded-lg"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign Out
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        onClick={() => {
                          scrollToSection("contact");
                          setIsMenuOpen(false);
                        }}
                        className="w-full bg-nature-forest hover:bg-nature-leaf text-white rounded-lg"
                      >
                        Get in Touch
                      </Button>
                      <Button
                        onClick={() => {
                          navigate('/auth');
                          setIsMenuOpen(false);
                        }}
                        variant="outline"
                        className="w-full border-nature-forest text-nature-forest hover:bg-nature-forest hover:text-white rounded-lg"
                      >
                        Sign In
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      )}
    </>
  );
};

export default ModernNavbar;
