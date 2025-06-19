
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Star, Search, Filter, Check, X, Eye, User } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAdminReviewMutations } from '@/hooks/useProductReviews';
import LoadingSpinner from '@/components/animations/LoadingSpinner';
import FadeInView from '@/components/animations/FadeInView';
import { ProductReview } from '@/types/ecommerce';

interface AdminReviewsFilters {
  status?: 'approved' | 'pending' | 'all';
  rating?: string;
  search?: string;
}

const AdminReviews: React.FC = () => {
  const [filters, setFilters] = useState<AdminReviewsFilters>({
    status: 'all',
    rating: 'all',
    search: '',
  });

  const { updateReviewStatus } = useAdminReviewMutations();

  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ['admin-reviews', filters],
    queryFn: async (): Promise<ProductReview[]> => {
      let query = supabase
        .from('product_reviews')
        .select(`
          *,
          user_profiles!inner(first_name, last_name, username),
          products!inner(name, slug)
        `);

      if (filters.status === 'approved') {
        query = query.eq('is_approved', true);
      } else if (filters.status === 'pending') {
        query = query.eq('is_approved', false);
      }

      if (filters.rating && filters.rating !== 'all') {
        query = query.eq('rating', parseInt(filters.rating));
      }

      if (filters.search) {
        query = query.or(`title.ilike.%${filters.search}%,review_text.ilike.%${filters.search}%`);
      }

      query = query.order('created_at', { ascending: false });

      const { data, error } = await query;
      if (error) throw error;

      return (data || []).map(review => ({
        ...review,
        user_profile: Array.isArray(review.user_profiles) 
          ? review.user_profiles[0] 
          : review.user_profiles || undefined,
        product: Array.isArray(review.products)
          ? review.products[0]
          : review.products || undefined
      })) as ProductReview[];
    },
  });

  const handleApprove = async (id: string) => {
    await updateReviewStatus.mutateAsync({ id, is_approved: true });
  };

  const handleReject = async (id: string) => {
    await updateReviewStatus.mutateAsync({ id, is_approved: false });
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating
                ? 'text-yellow-400 fill-current'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (isApproved: boolean) => {
    return isApproved ? (
      <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
        Approved
      </Badge>
    ) : (
      <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">
        Pending
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <FadeInView direction="up">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Review Management</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Moderate and manage product reviews
            </p>
          </div>
        </div>
      </FadeInView>

      {/* Filters */}
      <FadeInView direction="up" delay={0.1}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Filter className="h-5 w-5 mr-2" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search reviews..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="pl-10"
                />
              </div>
              
              <Select
                value={filters.status}
                onValueChange={(value) => setFilters({ ...filters, status: value as any })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Reviews</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={filters.rating}
                onValueChange={(value) => setFilters({ ...filters, rating: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Ratings</SelectItem>
                  <SelectItem value="5">5 Stars</SelectItem>
                  <SelectItem value="4">4 Stars</SelectItem>
                  <SelectItem value="3">3 Stars</SelectItem>
                  <SelectItem value="2">2 Stars</SelectItem>
                  <SelectItem value="1">1 Star</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                onClick={() => setFilters({ status: 'all', rating: 'all', search: '' })}
              >
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>
      </FadeInView>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <FadeInView direction="up" delay={0.2}>
            <Card>
              <CardContent className="text-center py-12">
                <Eye className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold mb-2">No reviews found</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  No reviews match your current filters.
                </p>
              </CardContent>
            </Card>
          </FadeInView>
        ) : (
          reviews.map((review, index) => (
            <FadeInView key={review.id} direction="up" delay={index * 0.1}>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium">
                            {review.user_profile?.first_name || review.user_profile?.username || 'Anonymous'}
                          </p>
                          {review.is_verified_purchase && (
                            <Badge variant="outline" className="text-xs">
                              Verified Purchase
                            </Badge>
                          )}
                          {getStatusBadge(review.is_approved)}
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          {renderStars(review.rating)}
                          <span className="text-sm text-gray-500">
                            for {(review as any).product?.name || 'Unknown Product'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 mb-2">
                          {formatDate(review.created_at)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {!review.is_approved && (
                        <Button
                          size="sm"
                          onClick={() => handleApprove(review.id)}
                          disabled={updateReviewStatus.isPending}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                      )}
                      {review.is_approved && (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleReject(review.id)}
                          disabled={updateReviewStatus.isPending}
                        >
                          <X className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      )}
                    </div>
                  </div>

                  {review.title && (
                    <h4 className="font-medium mb-2">{review.title}</h4>
                  )}

                  {review.review_text && (
                    <p className="text-gray-700 dark:text-gray-300 mb-3">
                      {review.review_text}
                    </p>
                  )}

                  {review.helpful_count > 0 && (
                    <p className="text-sm text-gray-500">
                      {review.helpful_count} people found this helpful
                    </p>
                  )}
                </CardContent>
              </Card>
            </FadeInView>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminReviews;
