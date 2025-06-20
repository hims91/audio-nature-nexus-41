
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingBag, User, MapPin, Settings } from 'lucide-react';

const QuickActions: React.FC = () => {
  const actions = [
    {
      title: 'View Orders',
      description: 'Check your order history',
      href: '/dashboard/orders',
      icon: ShoppingBag,
      color: 'bg-blue-50 hover:bg-blue-100 text-blue-600',
    },
    {
      title: 'Edit Profile',
      description: 'Update your information',
      href: '/dashboard/profile',
      icon: User,
      color: 'bg-green-50 hover:bg-green-100 text-green-600',
    },
    {
      title: 'Manage Addresses',
      description: 'Update shipping addresses',
      href: '/dashboard/addresses',
      icon: MapPin,
      color: 'bg-orange-50 hover:bg-orange-100 text-orange-600',
    },
    {
      title: 'Settings',
      description: 'Customize preferences',
      href: '/dashboard/settings',
      icon: Settings,
      color: 'bg-purple-50 hover:bg-purple-100 text-purple-600',
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {actions.map((action, index) => (
            <Button
              key={index}
              asChild
              variant="ghost"
              className={`w-full justify-start h-auto p-3 ${action.color}`}
            >
              <Link to={action.href}>
                <action.icon className="h-5 w-5 mr-3" />
                <div className="text-left">
                  <div className="font-medium">{action.title}</div>
                  <div className="text-xs opacity-70">{action.description}</div>
                </div>
              </Link>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
