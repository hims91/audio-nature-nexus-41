
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingBag, DollarSign, Clock, TrendingUp, AlertCircle } from 'lucide-react';
import { formatPrice } from '@/utils/currency';
import LoadingSpinner from '@/components/animations/LoadingSpinner';
import { useEnhancedDashboardStats } from '@/hooks/useEnhancedDashboardStats';
import { formatDistanceToNow } from 'date-fns';

const QuickStatsCards: React.FC = () => {
  const { stats, isLoading, error } = useEnhancedDashboardStats();

  if (error) {
    return (
      <Card className="col-span-full">
        <CardContent className="p-6 text-center">
          <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
          <p className="text-red-600">Failed to load dashboard statistics</p>
        </CardContent>
      </Card>
    );
  }

  const statsCards = [
    {
      title: 'Total Orders',
      value: stats?.total_orders || 0,
      icon: ShoppingBag,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Total Spent',
      value: formatPrice(stats?.total_spent_cents || 0),
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Pending Orders',
      value: stats?.pending_orders || 0,
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      subtitle: 'Awaiting processing',
    },
    {
      title: 'Recent Activity',
      value: stats?.recent_orders || 0,
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      subtitle: 'Last 30 days',
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="flex items-center justify-center">
                <LoadingSpinner size="sm" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statsCards.map((stat, index) => (
        <Card key={index} className="transition-all hover:shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {stat.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <div>
                <div className="text-2xl font-bold">{stat.value}</div>
                {stat.subtitle && (
                  <div className="text-xs text-gray-500">{stat.subtitle}</div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      
      {stats?.last_order_date && (
        <Card className="md:col-span-2 lg:col-span-4">
          <CardContent className="p-4">
            <div className="text-center text-sm text-gray-600">
              Last order: {formatDistanceToNow(new Date(stats.last_order_date), { addSuffix: true })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default QuickStatsCards;
