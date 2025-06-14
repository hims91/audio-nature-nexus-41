
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { usePortfolioData } from "@/hooks/usePortfolioData";
import { BarChart3, TrendingUp, Eye, Star } from "lucide-react";
import LoadingSpinner from "@/components/animations/LoadingSpinner";

const AdminAnalytics: React.FC = () => {
  const { portfolioItems, featuredItems, isLoading } = usePortfolioData();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const categoryCounts = portfolioItems.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const totalItems = portfolioItems.length;
  const featuredCount = featuredItems.length;
  const averageItemsPerCategory = totalItems / Object.keys(categoryCounts).length || 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Portfolio Analytics
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Insights into your portfolio performance and distribution
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalItems}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Featured</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{featuredCount}</div>
            <p className="text-xs text-muted-foreground">
              {totalItems > 0 ? Math.round((featuredCount / totalItems) * 100) : 0}% of total
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
              Avg {averageItemsPerCategory.toFixed(1)} items/category
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Visibility</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Public</div>
            <p className="text-xs text-muted-foreground">
              All items visible
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Category Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Category Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(categoryCounts)
              .sort(([,a], [,b]) => b - a)
              .map(([category, count]) => (
              <div key={category} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">{category}</Badge>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-nature-forest h-2 rounded-full" 
                      style={{ width: `${(count / totalItems) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium min-w-[3rem] text-right">
                    {count} ({Math.round((count / totalItems) * 100)}%)
                  </span>
                </div>
              </div>
            ))}
            {Object.keys(categoryCounts).length === 0 && (
              <p className="text-center text-gray-500 py-8">
                No portfolio items to analyze
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Featured Items Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Featured Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {featuredItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">{item.title}</h4>
                  <p className="text-sm text-gray-600">{item.client}</p>
                </div>
                <Badge className="bg-amber-100 text-amber-800">
                  <Star className="h-3 w-3 mr-1" />
                  Featured
                </Badge>
              </div>
            ))}
            {featuredItems.length === 0 && (
              <p className="text-center text-gray-500 py-8">
                No featured items yet
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAnalytics;
