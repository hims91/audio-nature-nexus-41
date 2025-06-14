
import React, { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  Users, 
  FolderOpen, 
  Star,
  TrendingUp,
  Mail,
  Settings
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { usePortfolioData } from '@/hooks/usePortfolioData';
import { useEnhancedAuth } from '@/contexts/EnhancedAuthContext';
import { useAdminMonitoring } from '@/hooks/useAdminMonitoring';
import AdminSetupGuide from '@/components/admin/AdminSetupGuide';
import AdminContactManager from '@/components/admin/AdminContactManager';
import AdminFeaturedManager from '@/components/admin/AdminFeaturedManager';
import FadeInView from '@/components/animations/FadeInView';

const AdminDashboard: React.FC = () => {
  const { portfolioItems, featuredItems, isLoading } = usePortfolioData();
  const { isAdmin } = useEnhancedAuth();
  const { trackPageView } = useAdminMonitoring();

  useEffect(() => {
    trackPageView('admin_dashboard');
  }, [trackPageView]);

  const stats = [
    {
      title: 'Total Portfolio Items',
      value: portfolioItems.length,
      description: 'Active portfolio projects',
      icon: FolderOpen,
      href: '/admin/portfolio'
    },
    {
      title: 'Featured Items',
      value: featuredItems.length,
      description: 'Showcased on homepage',
      icon: Star,
      href: '/admin/portfolio'
    },
    {
      title: 'Total Users',
      value: '1+', // This would come from user management
      description: 'Registered accounts',
      icon: Users,
      href: '/admin/users'
    },
    {
      title: 'Analytics',
      value: 'View',
      description: 'Site performance data',
      icon: TrendingUp,
      href: '/admin/analytics'
    }
  ];

  if (!isAdmin) {
    return (
      <div className="max-w-4xl mx-auto">
        <FadeInView direction="up" delay={0.1}>
          <AdminSetupGuide />
        </FadeInView>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <FadeInView direction="up" delay={0.1}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-nature-forest dark:text-white">
              Admin Dashboard
            </h1>
            <p className="text-nature-bark dark:text-gray-300 mt-2">
              Welcome back! Here's what's happening with your site.
            </p>
          </div>
          <Link to="/admin/settings">
            <Button variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </Link>
        </div>
      </FadeInView>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <FadeInView key={stat.title} direction="up" delay={0.2 + index * 0.1}>
            <Link to={stat.href}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  <stat.icon className="h-4 w-4 text-nature-forest" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-nature-forest dark:text-white">
                    {isLoading ? '...' : stat.value}
                  </div>
                  <p className="text-xs text-nature-bark dark:text-gray-400">
                    {stat.description}
                  </p>
                </CardContent>
              </Card>
            </Link>
          </FadeInView>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Featured Portfolio Management */}
        <FadeInView direction="left" delay={0.6}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Star className="h-5 w-5 mr-2 text-yellow-500" />
                Featured Portfolio
              </CardTitle>
              <CardDescription>
                Quick access to featured item management
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center py-4">
                  <div className="text-3xl font-bold text-nature-forest dark:text-white">
                    {featuredItems.length}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Items currently featured
                  </p>
                </div>
                <Link to="/admin/portfolio" className="w-full">
                  <Button className="w-full">
                    Manage Featured Items
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </FadeInView>

        {/* Contact Submissions */}
        <FadeInView direction="right" delay={0.7}>
          <AdminContactManager />
        </FadeInView>
      </div>

      {/* Featured Items Management Section */}
      <FadeInView direction="up" delay={0.8}>
        <AdminFeaturedManager />
      </FadeInView>
    </div>
  );
};

export default AdminDashboard;
