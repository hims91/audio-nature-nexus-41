
import React from "react";
import { usePortfolioData } from "@/hooks/usePortfolioData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  FolderOpen, 
  Star, 
  TrendingUp, 
  Plus,
  Eye,
  Edit,
  Calendar
} from "lucide-react";
import { Link } from "react-router-dom";
import LoadingSpinner from "@/components/animations/LoadingSpinner";
import { format } from "date-fns";

const AdminDashboard: React.FC = () => {
  const { portfolioItems, featuredItems, isLoading } = usePortfolioData();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const totalItems = portfolioItems.length;
  const featuredCount = featuredItems.length;
  const recentItems = portfolioItems.slice(0, 5);
  const categoryCounts = portfolioItems.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your portfolio and site content
          </p>
        </div>
        <Link to="/admin/portfolio">
          <Button className="bg-nature-forest hover:bg-nature-leaf">
            <Plus className="h-4 w-4 mr-2" />
            Add Portfolio Item
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Portfolio Items</CardTitle>
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalItems}</div>
            <p className="text-xs text-muted-foreground">
              Active portfolio projects
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Featured Items</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{featuredCount}</div>
            <p className="text-xs text-muted-foreground">
              Currently featured on homepage
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Object.keys(categoryCounts).length}</div>
            <p className="text-xs text-muted-foreground">
              Different project types
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Items and Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Portfolio Items */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Recent Portfolio Items
              <Link to="/admin/portfolio">
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  View All
                </Button>
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{item.title}</h4>
                    <p className="text-xs text-gray-500">{item.client}</p>
                    <div className="flex items-center mt-1 space-x-2">
                      <Badge variant="outline" className="text-xs">
                        {item.category}
                      </Badge>
                      {item.featured && (
                        <Badge className="text-xs bg-amber-100 text-amber-800">
                          <Star className="h-3 w-3 mr-1" />
                          Featured
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    {format(new Date(item.createdAt), 'MMM dd')}
                  </div>
                </div>
              ))}
              {recentItems.length === 0 && (
                <p className="text-center text-gray-500 py-8">
                  No portfolio items yet. Create your first one!
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Category Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(categoryCounts).map(([category, count]) => (
                <div key={category} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{category}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-nature-forest h-2 rounded-full" 
                        style={{ width: `${(count / totalItems) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-500 min-w-[2rem]">{count}</span>
                  </div>
                </div>
              ))}
              {Object.keys(categoryCounts).length === 0 && (
                <p className="text-center text-gray-500 py-8">
                  No categories yet
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link to="/admin/portfolio">
              <Button variant="outline" className="w-full justify-start">
                <Plus className="h-4 w-4 mr-2" />
                Create Portfolio Item
              </Button>
            </Link>
            <Link to="/admin/portfolio">
              <Button variant="outline" className="w-full justify-start">
                <Edit className="h-4 w-4 mr-2" />
                Manage Portfolio
              </Button>
            </Link>
            <Link to="/admin/analytics">
              <Button variant="outline" className="w-full justify-start">
                <TrendingUp className="h-4 w-4 mr-2" />
                View Analytics
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
