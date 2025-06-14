
import React from "react";
import { useEnhancedAuth } from "@/contexts/EnhancedAuthContext";
import { usePortfolioData } from "@/hooks/usePortfolioData";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import AdminUserManagement from "@/components/admin/AdminUserManagement";
import { 
  BarChart3, 
  FolderOpen, 
  Users, 
  Activity,
  TrendingUp,
  Star
} from "lucide-react";

const AdminDashboard: React.FC = () => {
  const { user, userProfile } = useEnhancedAuth();
  const { portfolioItems, featuredItems, isLoading } = usePortfolioData();

  const stats = [
    {
      title: "Total Projects",
      value: portfolioItems.length,
      icon: FolderOpen,
      description: "Portfolio items",
      color: "text-blue-600"
    },
    {
      title: "Featured Projects",
      value: featuredItems.length,
      icon: Star,
      description: "Featured on homepage",
      color: "text-yellow-600"
    },
    {
      title: "Categories",
      value: new Set(portfolioItems.map(item => item.category)).size,
      icon: BarChart3,
      description: "Unique categories",
      color: "text-green-600"
    },
    {
      title: "Admin Status",
      value: "Active",
      icon: Users,
      description: userProfile?.role || "Legacy",
      color: "text-purple-600"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Admin Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Welcome back, {user?.user_metadata?.first_name || user?.email?.split('@')[0] || 'Admin'}
        </p>
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
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
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
              Recent Activity
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
                <p className="text-gray-500 text-sm text-center py-4">
                  No portfolio items yet. Create your first project!
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Admin Management */}
        <AdminUserManagement />
      </div>

      {/* System Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-nature-forest" />
            System Information
          </CardTitle>
          <CardDescription>
            Current system status and information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              <p className="text-sm text-purple-800 dark:text-purple-200">Real-time</p>
              <p className="text-xs text-purple-600 dark:text-purple-400">Enabled</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
