
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BrandLogo } from '@/components/enhanced/BrandConsistencyManager';
import { useAuth } from '@/contexts/AuthContext';
import UserProfileDropdown from '@/components/auth/UserProfileDropdown';
import CartIcon from '@/components/shop/CartIcon';
import ThemeToggle from '@/components/ui/theme-toggle';
import { cn } from '@/lib/utils';

const UnifiedNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/#about' },
    { name: 'Services', href: '/#services' },
    { name: 'Portfolio', href: '/portfolio' },
    { name: 'Shop', href: '/shop' },
    { name: 'Contact', href: '/contact' },
  ];

  const scrollToSection = (href: string) => {
    if (href.startsWith('/#')) {
      // If we're not on the home page, navigate there first
      if (location.pathname !== '/') {
        window.location.href = href;
        return;
      }
      const elementId = href.substring(2);
      const element = document.getElementById(elementId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setIsOpen(false);
  };

  // Always show navbar with background when not on home page or when scrolled
  const shouldShowBackground = location.pathname !== '/' || isScrolled;
  const isHomePage = location.pathname === '/';

  return (
    <nav className={cn(
      "fixed w-full z-50 transition-all duration-500",
      shouldShowBackground
        ? 'bg-white/95 dark:bg-nature-bark/95 backdrop-blur-xl shadow-lg border-b border-nature-mist/20 dark:border-nature-forest/30' 
        : 'bg-gradient-to-r from-black/20 to-black/10 backdrop-blur-sm'
    )}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <BrandLogo 
              size="md" 
              adaptive
              background={shouldShowBackground ? "transparent" : "light"}
              className="transition-all duration-300 hover:scale-105"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => item.href.startsWith('/#') && scrollToSection(item.href)}
                className={cn(
                  "transition-all duration-300 font-medium relative group",
                  shouldShowBackground
                    ? 'text-nature-bark dark:text-nature-cream hover:text-nature-forest dark:hover:text-nature-leaf'
                    : 'text-white/90 hover:text-white'
                )}
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-nature-forest to-nature-leaf group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            <ThemeToggle 
              variant="default" 
              className={cn(
                shouldShowBackground 
                  ? "hover:bg-nature-mist/50 dark:hover:bg-nature-forest/20" 
                  : "hover:bg-white/20 backdrop-blur-sm"
              )}
            />
            <CartIcon />
            {user ? (
              <UserProfileDropdown />
            ) : (
              <Button 
                asChild 
                variant="outline" 
                className={cn(
                  "transition-all duration-300 hover:scale-105 rounded-full",
                  shouldShowBackground
                    ? 'border-nature-forest text-nature-forest hover:bg-nature-forest hover:text-white dark:border-nature-leaf dark:text-nature-leaf dark:hover:bg-nature-leaf dark:hover:text-nature-bark'
                    : 'border-white/70 text-white hover:bg-white/20 backdrop-blur-sm'
                )}
              >
                <Link to="/auth">Sign In</Link>
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center space-x-2">
            <ThemeToggle 
              variant="ghost" 
              className={cn(
                "w-8 h-8",
                shouldShowBackground 
                  ? "text-nature-bark dark:text-nature-cream hover:bg-nature-mist/50 dark:hover:bg-nature-forest/20" 
                  : "text-white hover:bg-white/20 backdrop-blur-sm"
              )}
            />
            <CartIcon />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
              className={cn(
                "rounded-full transition-all duration-300",
                shouldShowBackground 
                  ? 'text-nature-bark dark:text-nature-cream hover:bg-nature-mist/50 dark:hover:bg-nature-forest/20' 
                  : 'text-white hover:bg-white/20 backdrop-blur-sm'
              )}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 mt-2 mx-4">
            <div className="bg-white/95 dark:bg-nature-bark/95 backdrop-blur-xl rounded-lg shadow-2xl border border-nature-mist/30 dark:border-nature-forest/30 overflow-hidden">
              <div className="px-2 pt-2 pb-3 space-y-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => item.href.startsWith('/#') ? scrollToSection(item.href) : setIsOpen(false)}
                    className="block px-4 py-3 text-nature-bark dark:text-nature-cream hover:text-nature-forest dark:hover:text-nature-leaf hover:bg-nature-mist/50 dark:hover:bg-nature-forest/20 transition-all duration-300 font-medium rounded-lg mx-2"
                  >
                    {item.name}
                  </Link>
                ))}
                <div className="pt-3 mt-3 border-t border-nature-mist/30 dark:border-nature-forest/30">
                  {user ? (
                    <div className="px-4 py-2">
                      <UserProfileDropdown />
                    </div>
                  ) : (
                    <Link
                      to="/auth"
                      onClick={() => setIsOpen(false)}
                      className="block mx-2 px-4 py-3 text-center bg-nature-forest text-white hover:bg-nature-leaf transition-all duration-300 font-medium rounded-lg"
                    >
                      Sign In
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default UnifiedNavbar;
