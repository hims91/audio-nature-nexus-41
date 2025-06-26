
import React, { Suspense, lazy } from "react";
import { useLocation, Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import LoadingSpinner from "@/components/animations/LoadingSpinner";
import AdminErrorBoundary from "./AdminErrorBoundary";
import { 
  LayoutDashboard, 
  FolderOpen, 
  Users, 
  Settings, 
  BarChart3,
  Menu,
  X,
  ShoppingBag,
  Package,
  TrendingDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { BrandLogo, BrandContainer } from "@/components/enhanced/BrandConsistencyManager";
import UserProfileDropdown from "@/components/auth/UserProfileDropdown";
import { useState } from "react";

// Lazy load the AdminRoutes component
const AdminRoutes = lazy(() => import('./AdminRoutes'));

const AdminLayout: React.FC = () => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    {
      name: "Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
    },
    {
      name: "Portfolio",
      href: "/admin/portfolio",
      icon: FolderOpen,
    },
    {
      name: "Products",
      href: "/admin/products",
      icon: Package,
    },
    {
      name: "Orders",
      href: "/admin/orders",
      icon: ShoppingBag,
    },
    {
      name: "Inventory",
      href: "/admin/inventory",
      icon: TrendingDown,
    },
    {
      name: "Analytics",
      href: "/admin/analytics",
      icon: BarChart3,
    },
    {
      name: "Users",
      href: "/admin/users",
      icon: Users,
    },
    {
      name: "Settings",
      href: "/admin/settings",
      icon: Settings,
    },
  ];

  const isActive = (href: string) => {
    if (href === "/admin") {
      return location.pathname === "/admin" || location.pathname === "/admin/";
    }
    return location.pathname.startsWith(href);
  };

  return (
    <AdminErrorBoundary>
      <div className="min-h-screen bg-white">
        {/* Mobile sidebar backdrop */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <BrandContainer 
          variant="glass"
          className={cn(
            "fixed inset-y-0 left-0 z-50 w-64 shadow-lg transform transition-transform duration-200 ease-in-out lg:translate-x-0 border-r border-gray-200",
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
            <div className="flex items-center">
              <BrandLogo size="sm" showText={false} />
              <span className="ml-2 text-lg font-semibold text-nature-forest">
                Admin Panel
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden text-nature-forest hover:bg-nature-mist"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <nav className="mt-8 px-4">
            <ul className="space-y-2">
              {navigation.map((item) => {
                const itemIsActive = isActive(item.href);
                return (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      className={cn(
                        "flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                        itemIsActive
                          ? "bg-nature-forest text-white shadow-sm"
                          : "text-nature-forest hover:bg-nature-sage/20"
                      )}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <item.icon className={cn(
                        "h-5 w-5 mr-3",
                        itemIsActive ? "text-white" : "text-nature-leaf"
                      )} />
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="absolute bottom-4 left-4 right-4">
            <Link
              to="/"
              className="flex items-center px-4 py-2 text-sm text-nature-bark hover:text-nature-forest transition-colors"
            >
              ← Back to Website
            </Link>
          </div>
        </BrandContainer>

        {/* Main content */}
        <div className="lg:pl-64">
          {/* Top bar */}
          <BrandContainer 
            variant="glass" 
            className="h-16 border-b border-gray-200 flex items-center justify-between px-4 lg:px-6"
          >
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden text-nature-forest hover:bg-nature-mist"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            
            <div className="flex items-center justify-between w-full">
              <span className="text-sm text-nature-bark">
                Terra Echo Studios Admin
              </span>
              
              {/* User Profile Dropdown in top bar */}
              <UserProfileDropdown />
            </div>
          </BrandContainer>

          {/* Page content */}
          <main className="p-4 lg:p-6">
            <Suspense fallback={
              <div className="flex items-center justify-center py-12">
                <LoadingSpinner size="lg" />
              </div>
            }>
              <AdminRoutes />
            </Suspense>
          </main>
        </div>
      </div>
    </AdminErrorBoundary>
  );
};

export default AdminLayout;
