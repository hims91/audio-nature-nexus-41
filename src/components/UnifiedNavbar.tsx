
import React, { useState, useEffect } from 'react';
import { Menu, X, Shield, Settings } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BrandLogo } from '@/components/enhanced/BrandConsistencyManager';
import UserProfileDropdown from '@/components/auth/UserProfileDropdown';
import { useEnhancedAuth } from '@/contexts/EnhancedAuthContext';

const UnifiedNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { user, isAdmin } = useEnhancedAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Portfolio', href: '/portfolio' },
    { name: 'Contact', href: '/contact' },
  ];

  const isActivePath = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm shadow-lg' 
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <BrandLogo size="md" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`text-sm font-medium transition-colors duration-200 ${
                  isActivePath(item.href)
                    ? 'text-nature-forest dark:text-nature-leaf'
                    : 'text-gray-700 dark:text-gray-300 hover:text-nature-forest dark:hover:text-nature-leaf'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Right side - Auth and Admin */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                {/* Admin Panel Button */}
                {isAdmin && (
                  <Link to="/admin/dashboard">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="flex items-center space-x-2 border-nature-forest text-nature-forest hover:bg-nature-forest hover:text-white dark:border-nature-leaf dark:text-nature-leaf dark:hover:bg-nature-leaf dark:hover:text-gray-900"
                    >
                      <Shield className="h-4 w-4" />
                      <span>Admin Panel</span>
                    </Button>
                  </Link>
                )}
                
                {/* User Profile Dropdown */}
                <UserProfileDropdown />
              </div>
            ) : (
              <Link to="/auth">
                <Button 
                  variant="outline" 
                  className="border-nature-forest text-nature-forest hover:bg-nature-forest hover:text-white dark:border-nature-leaf dark:text-nature-leaf dark:hover:bg-nature-leaf dark:hover:text-gray-900"
                >
                  Sign In
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 dark:text-gray-300"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`block px-3 py-2 text-base font-medium transition-colors duration-200 ${
                    isActivePath(item.href)
                      ? 'text-nature-forest dark:text-nature-leaf bg-nature-mist dark:bg-gray-800'
                      : 'text-gray-700 dark:text-gray-300 hover:text-nature-forest dark:hover:text-nature-leaf hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
              {/* Mobile Auth */}
              <div className="px-3 py-2 border-t border-gray-200 dark:border-gray-700 mt-3 pt-3">
                {user ? (
                  <div className="space-y-2">
                    {/* Admin Panel for Mobile */}
                    {isAdmin && (
                      <Link 
                        to="/admin/dashboard" 
                        onClick={() => setIsOpen(false)}
                        className="flex items-center space-x-2 px-3 py-2 text-base font-medium text-nature-forest dark:text-nature-leaf hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md"
                      >
                        <Shield className="h-4 w-4" />
                        <span>Admin Panel</span>
                      </Link>
                    )}
                    
                    {/* Profile Links for Mobile */}
                    <Link 
                      to="/manage-portfolio" 
                      onClick={() => setIsOpen(false)}
                      className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md"
                    >
                      Manage Portfolio
                    </Link>
                    
                    <UserProfileDropdown />
                  </div>
                ) : (
                  <Link to="/auth" onClick={() => setIsOpen(false)}>
                    <Button 
                      variant="outline" 
                      className="w-full border-nature-forest text-nature-forest hover:bg-nature-forest hover:text-white"
                    >
                      Sign In
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default UnifiedNavbar;
