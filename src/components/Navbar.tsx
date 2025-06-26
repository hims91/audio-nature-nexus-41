
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Settings } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { LazyUserProfileDropdown } from "./auth/LazyProfileComponents";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useAuth();
  
  // Check if user is admin (in production, this should check user_profiles.role)
  const isAdmin = user?.email === 'TerraEchoStudios@gmail.com';

  const handleSignOut = async () => {
    await signOut();
    setIsOpen(false);
  };

  const navItems = [
    { name: "Home", href: "#home" },
    { name: "About", href: "#about" },
    { name: "Services", href: "#services" },
    { name: "Portfolio", href: "#portfolio" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <div className="w-10 h-10 bg-nature-forest rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">TE</span>
              </div>
              <span className="ml-2 text-xl font-bold text-nature-forest">
                Terra Echo
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-gray-700 hover:text-nature-forest transition-colors duration-200 px-3 py-2 text-sm font-medium"
                >
                  {item.name}
                </a>
              ))}
            </div>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                {isAdmin && (
                  <Link
                    to="/admin/dashboard"
                    className="flex items-center px-3 py-2 rounded-lg bg-nature-forest text-white hover:bg-nature-leaf transition-colors text-sm font-medium"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Admin Panel
                  </Link>
                )}
                <LazyUserProfileDropdown user={user} onSignOut={handleSignOut} />
              </div>
            ) : (
              <Link to="/auth">
                <Button className="bg-nature-forest hover:bg-nature-leaf text-white">
                  Sign In
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg bg-gray-100 text-gray-600"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-nature-forest"
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </a>
            ))}
            
            {user ? (
              <div className="border-t border-gray-200 pt-3 mt-3">
                {isAdmin && (
                  <Link
                    to="/admin/dashboard"
                    className="flex items-center px-3 py-2 text-base font-medium text-nature-forest"
                    onClick={() => setIsOpen(false)}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Admin Panel
                  </Link>
                )}
                <button
                  onClick={handleSignOut}
                  className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:text-red-600"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="border-t border-gray-200 pt-3 mt-3">
                <Link
                  to="/auth"
                  className="block px-3 py-2 text-base font-medium text-nature-forest"
                  onClick={() => setIsOpen(false)}
                >
                  Sign In
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
