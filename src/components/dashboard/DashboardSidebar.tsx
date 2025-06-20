
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  User, 
  ShoppingBag, 
  MapPin, 
  Settings, 
  Activity,
  CreditCard,
  Bell,
  X
} from 'lucide-react';
import { BrandLogo } from '@/components/enhanced/BrandConsistencyManager';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface DashboardSidebarProps {
  onClose?: () => void;
}

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ onClose }) => {
  const location = useLocation();

  const navigation = [
    { name: 'Overview', href: '/dashboard', icon: Home },
    { name: 'Profile', href: '/dashboard/profile', icon: User },
    { name: 'Orders', href: '/dashboard/orders', icon: ShoppingBag },
    { name: 'Addresses', href: '/dashboard/addresses', icon: MapPin },
    { name: 'Payment Methods', href: '/dashboard/payments', icon: CreditCard },
    { name: 'Notifications', href: '/dashboard/notifications', icon: Bell },
    { name: 'Activity', href: '/dashboard/activity', icon: Activity },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  ];

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800 shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <BrandLogo size="sm" />
        {onClose && (
          <Button variant="ghost" size="sm" onClick={onClose} className="lg:hidden">
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              onClick={onClose}
              className={cn(
                'flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                isActive
                  ? 'bg-nature-forest text-white'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              )}
            >
              <item.icon className="h-5 w-5 mr-3" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <Link
          to="/"
          className="flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-nature-forest"
        >
          ← Back to Website
        </Link>
      </div>
    </div>
  );
};

export default DashboardSidebar;
