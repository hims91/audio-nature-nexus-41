
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Moon, Sun, Menu, X, Settings, Shield } from 'lucide-react';
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { LazyUserProfileDropdown } from "./auth/LazyProfileComponents";
import { cn } from "@/lib/utils";

const UnifiedNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const { user, signOut } = useAuth();
  const location = useLocation();
  
  // Check if user is admin using the email check (later we'll use proper role-based check)
  const isAdmin = user?.email === 'TerraEchoStudios@gmail.com';

  const handleSignOut = async () => {
    await signOut();
    setIsOpen(false);
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const navItems = [
    { name: "Home", href: "#home", id: "home" },
    { name: "About", href: "#about", id: "about" },
    { name: "Services", href: "#services", id: "services" },
    { name: "Portfolio", href: "#portfolio", id: "portfolio" },
    { name: "Contact", href: "#contact", id: "contact" },
  ];

  const isCurrentPage = (href: string) => {
    if (location.pathname === "/" && href.startsWith("#")) {
      return false; // Will be handled by scroll spy in the future
    }
    return location.pathname === href.replace("#", "/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-b border-gray-200/20 dark:border-gray-700/30 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center group">
              <div className="w-10 h-10 bg-gradient-to-br from-nature-forest to-nature-leaf rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <span className="text-white font-bold text-lg">TE</span>
              </div>
              <div className="ml-3 hidden sm:block">
                <span className="text-xl font-bold bg-gradient-to-r from-nature-forest to-nature-leaf bg-clip-text text-transparent">
                  Terra Echo
                </span>
                <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  Studios
                </div>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-1">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800",
                    isCurrentPage(item.href)
                      ? "text-nature-forest dark:text-nature-leaf bg-gray-100 dark:bg-gray-800"
                      : "text-gray-700 dark:text-gray-300 hover:text-nature-forest dark:hover:text-nature-leaf"
                  )}
                >
                  {item.name}
                </a>
              ))}
            </div>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-3">
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:text-nature-forest dark:hover:text-nature-leaf transition-all duration-200 hover:scale-105"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            {user ? (
              <div className="flex items-center space-x-3">
                {isAdmin && (
                  <Link
                    to="/admin/dashboard"
                    className="flex items-center px-3 py-2 rounded-lg bg-gradient-to-r from-nature-forest to-nature-leaf text-white hover:from-nature-leaf hover:to-nature-forest transition-all duration-200 text-sm font-medium shadow-md hover:shadow-lg transform hover:scale-105"
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    Admin
                  </Link>
                )}
                <LazyUserProfileDropdown user={user} onSignOut={handleSignOut} />
              </div>
            ) : (
              <Link to="/auth">
                <Button className="bg-gradient-to-r from-nature-forest to-nature-leaf hover:from-nature-leaf hover:to-nature-forest text-white shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200">
                  Sign In
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-t border-gray-200/20 dark:border-gray-700/30">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={cn(
                  "block px-3 py-2 rounded-lg text-base font-medium transition-colors",
                  isCurrentPage(item.href)
                    ? "text-nature-forest dark:text-nature-leaf bg-gray-100 dark:bg-gray-800"
                    : "text-gray-700 dark:text-gray-300 hover:text-nature-forest dark:hover:text-nature-leaf hover:bg-gray-100 dark:hover:bg-gray-800"
                )}
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </a>
            ))}
            
            {user ? (
              <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mt-3">
                {isAdmin && (
                  <Link
                    to="/admin/dashboard"
                    className="flex items-center px-3 py-2 text-base font-medium text-nature-forest dark:text-nature-leaf hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                    onClick={() => setIsOpen(false)}
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    Admin Panel
                  </Link>
                )}
                <button
                  onClick={handleSignOut}
                  className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-red-600 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mt-3">
                <Link
                  to="/auth"
                  className="block px-3 py-2 text-base font-medium text-nature-forest dark:text-nature-leaf hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
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

export default UnifiedNavbar;
