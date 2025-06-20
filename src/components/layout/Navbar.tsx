import React, { useState } from 'react';
import { Link, NavLink as RouterLink } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Home,
  Menu,
  Settings,
  ShoppingBag,
  User,
  LogOut
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/hooks/useCart';

const Navbar: React.FC = () => {
  const { user, signOut } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const { cartItemCount } = useCart();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const NavLink = React.forwardRef<
    HTMLAnchorElement,
    React.PropsWithChildren<{ href: string; className?: string }>
  >(({ children, href, className, ...props }, ref) => {
    return (
      <RouterLink
        to={href}
        className={({ isActive }) =>
          `inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 ${
            isActive ? 'text-nature-forest dark:text-nature-sage' : 'hover:text-gray-600 dark:hover:text-gray-400'
          } ${className}`}
        {...props}
        ref={ref}
      >
        {children}
      </RouterLink>
    )
  })
  NavLink.displayName = "NavLink"

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <Link to="/" className="flex items-center font-bold text-xl text-nature-forest dark:text-nature-sage">
            Terra Echo Studios
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <NavLink href="/">
              Home
            </NavLink>
            <NavLink href="/shop">
              Shop
            </NavLink>
            <NavLink href="/about">
              About
            </NavLink>
            <NavLink href="/contact">
              Contact
            </NavLink>
            
            <NavLink href="/shop/cart" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {cartItemCount > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs bg-nature-forest">
                  {cartItemCount > 9 ? '9+' : cartItemCount}
                </Badge>
              )}
            </NavLink>
          </div>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="sm:w-64 p-0">
              <SheetHeader className="pl-4 pt-4">
                <SheetTitle>Navigation</SheetTitle>
                <SheetDescription>
                  Explore our site
                </SheetDescription>
              </SheetHeader>
              <div className="py-4">
                <div className="grid gap-4">
                  <NavLink href="/" className="flex items-center gap-2 space-y-0 py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-800">
                    <Home className="h-4 w-4" />
                    <span>Home</span>
                  </NavLink>
                  <NavLink href="/shop" className="flex items-center gap-2 space-y-0 py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-800">
                    <ShoppingBag className="h-4 w-4" />
                    <span>Shop</span>
                  </NavLink>
                  <NavLink href="/about" className="flex items-center gap-2 space-y-0 py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-800">
                    <User className="h-4 w-4" />
                    <span>About</span>
                  </NavLink>
                  <NavLink href="/contact" className="flex items-center gap-2 space-y-0 py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-800">
                    <Settings className="h-4 w-4" />
                    <span>Contact</span>
                  </NavLink>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          {/* Authentication Section */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.user_metadata?.avatar_url} alt={user.email} />
                    <AvatarFallback>{user.email?.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/orders">Orders</Link>
                </DropdownMenuItem>
                {user.user_metadata?.role === 'admin' && (
                  <DropdownMenuItem asChild>
                    <Link to="/admin">Admin Panel</Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()} className="cursor-pointer">
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden md:flex items-center space-x-4">
              <Link to="/login" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100">
                Login
              </Link>
              <Link to="/register">
                <Button size="sm" className="bg-nature-forest hover:bg-nature-leaf">
                  Register
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
