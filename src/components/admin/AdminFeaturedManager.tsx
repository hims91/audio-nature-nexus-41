
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Star, 
  StarOff, 
  Eye, 
  Calendar,
  Image as ImageIcon,
  Music,
  Video,
  ExternalLink
} from 'lucide-react';
import { usePortfolioData } from '@/hooks/usePortfolioData';
import { useToast } from '@/hooks/use-toast';
import { useAdminMonitoring } from '@/hooks/useAdminMonitoring';
import LoadingSpinner from '@/components/animations/LoadingSpinner';

const AdminFeaturedManager: React.FC = () => {
  const { portfolioItems, featuredItems, updatePortfolioItem, isLoading } = usePortfolioData();
  const { toast } = useToast();
  const { trackPortfolioAction } = useAdminMonitoring();

  const toggleFeatured = async (itemId: string, currentFeatured: boolean) => {
    try {
      console.log('⭐ Toggling featured status:', itemId, !currentFeatured);
      
      await updatePortfolioItem.mutateAsync({
        id: itemId,
        updates: { featured: !currentFeatured }
      });

      trackPortfolioAction(
        currentFeatured ? 'unfeatured' : 'featured',
        itemId,
        { featured: !currentFeatured }
      );

      toast({
        title: "Success",
        description: `Portfolio item ${!currentFeatured ? 'featured' : 'unfeatured'} successfully.`,
      });
    } catch (error: any) {
      console.error('❌ Error toggling featured status:', error);
      toast({
        title: "Error",
        description: "Failed to update featured status.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <LoadingSpinner size="md" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Featured Items Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Star className="h-5 w-5 mr-2 text-yellow-500" />
            Featured Portfolio Items ({featuredItems.length})
          </CardTitle>
          <CardDescription>
            These items will be prominently displayed on the homepage
          </CardDescription>
        </CardHeader>
        <CardContent>
          {featuredItems.length === 0 ? (
            <Alert className="border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20 dark:border-yellow-800">
              <Star className="h-4 w-4 text-yellow-600" />
              <AlertDescription className="text-yellow-800 dark:text-yellow-200">
                <strong>No featured items yet.</strong>
                <br />
                Use the "Feature" button on portfolio items below to showcase them on your homepage.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {featuredItems.map((item) => (
                <div key={item.id} className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-1">
                        {item.title}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {item.client} • {item.category}
                      </p>
                    </div>
                    <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300">
                      <Star className="h-3 w-3 mr-1" />
                      Featured
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                    <div className="flex items-center space-x-2">
                      {item.coverImageUrl && <ImageIcon className="h-3 w-3" />}
                      {item.audioUrl && <Music className="h-3 w-3" />}
                      {item.videoUrl && <Video className="h-3 w-3" />}
                      {item.externalLinks.length > 0 && <ExternalLink className="h-3 w-3" />}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {new Date(item.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toggleFeatured(item.id, true)}
                    className="w-full text-xs"
                  >
                    <StarOff className="h-3 w-3 mr-1" />
                    Remove from Featured
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* All Portfolio Items */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Eye className="h-5 w-5 mr-2 text-nature-forest" />
            All Portfolio Items ({portfolioItems.length})
          </CardTitle>
          <CardDescription>
            Manage which items are featured on the homepage
          </CardDescription>
        </CardHeader>
        <CardContent>
          {portfolioItems.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-6xl mb-4 opacity-20">🎵</div>
              <h3 className="text-lg font-medium text-nature-forest dark:text-white mb-2">
                No portfolio items found
              </h3>
              <p className="text-nature-bark dark:text-gray-300">
                Create some portfolio items to manage featured content.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {portfolioItems.map((item) => (
                <div key={item.id} className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-nature-forest rounded-lg flex items-center justify-center">
                        {item.coverImageUrl ? (
                          <img 
                            src={item.coverImageUrl} 
                            alt={item.title}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <Music className="h-6 w-6 text-white" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium text-gray-900 dark:text-gray-100">
                            {item.title}
                          </h4>
                          {item.featured && (
                            <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300">
                              <Star className="h-3 w-3 mr-1" />
                              Featured
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>{item.client}</span>
                          <span>•</span>
                          <span>{item.category}</span>
                          <span>•</span>
                          <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    
                    <Button
                      size="sm"
                      variant={item.featured ? "outline" : "default"}
                      onClick={() => toggleFeatured(item.id, item.featured)}
                      disabled={updatePortfolioItem.isPending}
                      className="min-w-[100px]"
                    >
                      {item.featured ? (
                        <>
                          <StarOff className="h-3 w-3 mr-1" />
                          Unfeature
                        </>
                      ) : (
                        <>
                          <Star className="h-3 w-3 mr-1" />
                          Feature
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminFeaturedManager;
