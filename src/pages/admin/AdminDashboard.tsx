import React, { useEffect } from "react";
import { useEnhancedAuth } from "@/contexts/EnhancedAuthContext";
import { usePortfolioData } from "@/hooks/usePortfolioData";
import { useAdminMonitoring } from "@/hooks/useAdminMonitoring";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import AdminUserManagement from "@/components/admin/AdminUserManagement";
import AdminContactManager from "@/components/admin/AdminContactManager";
import AdminSetupGuide from "@/components/admin/AdminSetupGuide";
import { 
  BarChart3, 
  FolderOpen, 
  Users, 
  Activity,
  TrendingUp,
  Star,
  Mail,
  Settings
} from "lucide-react";
import { Link } from "react-router-dom";

const AdminDashboard: React.FC = () => {
  const { user, userProfile, isAdmin } = useEnhancedAuth();
  const { portfolioItems, featuredItems, isLoading } = usePortfolioData();
  const { trackPageView } = useAdminMonitoring();

  useEffect(() => {
    trackPageView('dashboard');
  }, [trackPageView]);

  // Show setup guide if not admin
  if (!isAdmin) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Admin Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Admin access required to view this dashboard
            </p>
          </div>
        </div>
        
        <AdminSetupGuide />
      </div>
    );
  }

  const stats = [
    {
      title: "Total Projects",
      value: portfolioItems.length,
      icon: FolderOpen,
      description: "Portfolio items",
      color: "text-blue-600",
      action: { label: "Manage", link: "/admin/portfolio" }
    },
    {
      title: "Featured Projects",
      value: featuredItems.length,
      icon: Star,
      description: "Featured on homepage",
      color: "text-yellow-600",
      action: { label: "Edit", link: "/admin/portfolio" }
    },
    {
      title: "Categories",
      value: new Set(portfolioItems.map(item => item.category)).size,
      icon: BarChart3,
      description: "Unique categories",
      color: "text-green-600",
      action: { label: "View", link: "/admin/analytics" }
    },
    {
      title: "Admin Status",
      value: "Active",
      icon: Users,
      description: userProfile?.role || "Legacy",
      color: "text-purple-600",
      action: { label: "Settings", link: "/admin/settings" }
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Welcome back, {user?.user_metadata?.first_name || user?.email?.split('@')[0] || 'Admin'}
          </p>
        </div>
        <div className="flex gap-2">
          <Link to="/admin/portfolio">
            <Button variant="outline" size="sm">
              <FolderOpen className="h-4 w-4 mr-2" />
              Manage Portfolio
            </Button>
          </Link>
          <Link to="/admin/analytics">
            <Button variant="outline" size="sm">
              <BarChart3 className="h-4 w-4 mr-2" />
              View Analytics
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading ? (
                  <div className="animate-pulse bg-gray-200 h-8 w-16 rounded"></div>
                ) : (
                  stat.value
                )}
              </div>
              <p className="text-xs text-muted-foreground mb-2">
                {stat.description}
              </p>
              <Link to={stat.action.link}>
                <Button variant="outline" size="sm" className="text-xs">
                  {stat.action.label}
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="h-5 w-5 mr-2 text-nature-forest" />
              Recent Portfolio Activity
            </CardTitle>
            <CardDescription>
              Latest updates to your portfolio
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {portfolioItems.slice(0, 5).map((item) => (
                <div key={item.id} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{item.title}</p>
                    <p className="text-xs text-gray-500">{item.client}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {item.featured && (
                      <Badge variant="secondary" className="text-xs">
                        Featured
                      </Badge>
                    )}
                    <Badge variant="outline" className="text-xs">
                      {item.category}
                    </Badge>
                  </div>
                </div>
              ))}
              {portfolioItems.length === 0 && !isLoading && (
                <div className="text-center py-6">
                  <p className="text-gray-500 text-sm mb-4">
                    No portfolio items yet. Create your first project!
                  </p>
                  <Link to="/admin/portfolio">
                    <Button size="sm">
                      <FolderOpen className="h-4 w-4 mr-2" />
                      Create Project
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Contact Management Preview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Mail className="h-5 w-5 mr-2 text-nature-forest" />
              Contact Management
            </CardTitle>
            <CardDescription>
              Recent contact submissions (preview)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Manage and respond to client inquiries, project requests, and general contact submissions.
              </p>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  <Mail className="h-4 w-4 mr-2" />
                  View All Contacts
                </Button>
                <Button size="sm" variant="outline">
                  <Settings className="h-4 w-4 mr-2" />
                  Email Settings
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contact Manager Section */}
      <AdminContactManager />

      {/* User Management */}
      <AdminUserManagement />

      {/* System Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-nature-forest" />
            System Status
          </CardTitle>
          <CardDescription>
            Current system status and launch readiness
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">✓</div>
              <p className="text-sm text-green-800 dark:text-green-200">Database</p>
              <p className="text-xs text-green-600 dark:text-green-400">Connected</p>
            </div>
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">✓</div>
              <p className="text-sm text-blue-800 dark:text-blue-200">Authentication</p>
              <p className="text-xs text-blue-600 dark:text-blue-400">Active</p>
            </div>
            <div className="text-center p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">✓</div>
              <p className="text-sm text-purple-800 dark:text-purple-200">Storage</p>
              <p className="text-xs text-purple-600 dark:text-purple-400">Ready</p>
            </div>
            <div className="text-center p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">🚀</div>
              <p className="text-sm text-orange-800 dark:text-orange-200">Launch Status</p>
              <p className="text-xs text-orange-600 dark:text-orange-400">Ready</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
