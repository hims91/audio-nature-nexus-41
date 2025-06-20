
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const DashboardBreadcrumb: React.FC = () => {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);

  const breadcrumbMap: Record<string, string> = {
    dashboard: 'Dashboard',
    profile: 'Profile',
    orders: 'Orders',
    addresses: 'Addresses',
    payments: 'Payment Methods',
    notifications: 'Notifications',
    activity: 'Activity',
    settings: 'Settings',
  };

  return (
    <nav className="flex items-center space-x-2 text-sm">
      <Link
        to="/dashboard"
        className="text-gray-600 dark:text-gray-400 hover:text-nature-forest"
      >
        Dashboard
      </Link>
      {pathSegments.slice(1).map((segment, index) => (
        <React.Fragment key={segment}>
          <ChevronRight className="h-4 w-4 text-gray-400" />
          <span className={index === pathSegments.length - 2 
            ? 'text-nature-forest font-medium' 
            : 'text-gray-600 dark:text-gray-400'
          }>
            {breadcrumbMap[segment] || segment}
          </span>
        </React.Fragment>
      ))}
    </nav>
  );
};

export default DashboardBreadcrumb;
