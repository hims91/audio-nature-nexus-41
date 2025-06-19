
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Star, User } from 'lucide-react';
import { useProductReviews, useReviewMutations } from '@/hooks/useProductReviews';
import { useEnhancedAuth } from '@/hooks/useEnhancedAuth';
import { toast } from 'sonner';
import FadeInView from '@/components/animations/FadeInView';

interface ProductReviewsProps {
  productId: string;
}

const ProductReviews: React.FC<ProductReviewsProps> = ({ productId }) => {
  const { data: reviews = [], isLoading } = useProductReviews(productId);
  const { createReview } = useReviewMutations();
  const { user } = useEnhancedAuth();

  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0;

  const ratingDistribution = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: reviews.filter(review => review.rating === star).length,
    percentage: reviews.length > 0 
      ? (reviews.filter(review => review.rating === star).length / reviews.length) * 100 
      : 0
  }));

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please log in to submit a review');
      return;
    }

    setIsSubmitting(true);
    try {
      await createReview.mutateAsync({
        product_id: productId,
        rating,
        title: title.trim() || undefined,
        review_text: reviewText.trim() || undefined,
      });

      setTitle('');
      setReviewText('');
      setRating(5);
      setShowReviewForm(false);
    } catch (error) {
      console.error('Error submitting review:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (rating: number, interactive = false, onStarClick?: (rating: number) => void) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating
                ? 'text-yellow-400 fill-current'
                : 'text-gray-300'
            } ${interactive ? 'cursor-pointer hover:text-yellow-400' : ''}`}
            onClick={() => interactive && onStarClick && onStarClick(star)}
          />
        ))}
      </div>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Reviews Summary */}
      <FadeInView direction="up">
        <Card>
          <CardHeader>
            <CardTitle>Customer Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  {renderStars(Math.round(averageRating))}
                  <span className="text-2xl font-bold">{averageRating.toFixed(1)}</span>
                  <span className="text-gray-600">({reviews.length} reviews)</span>
                </div>
                
                <div className="space-y-2">
                  {ratingDistribution.map(({ star, count, percentage }) => (
                    <div key={star} className="flex items-center gap-2 text-sm">
                      <span className="w-8">{star}</span>
                      <Star className="h-3 w-3 text-yellow-400 fill-current" />
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-yellow-400 h-2 rounded-full"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="w-8 text-right">{count}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col justify-center">
                {user ? (
                  <Button
                    onClick={() => setShowReviewForm(!showReviewForm)}
                    className="w-full"
                  >
                    {showReviewForm ? 'Cancel Review' : 'Write a Review'}
                  </Button>
                ) : (
                  <p className="text-center text-gray-600">
                    Please log in to write a review
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </FadeInView>

      {/* Review Form */}
      {showReviewForm && user && (
        <FadeInView direction="up">
          <Card>
            <CardHeader>
              <CardTitle>Write a Review</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Rating</label>
                  {renderStars(rating, true, setRating)}
                </div>

                <div>
                  <label htmlFor="review-title" className="block text-sm font-medium mb-2">
                    Title (optional)
                  </label>
                  <Input
                    id="review-title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Summarize your review"
                    maxLength={100}
                  />
                </div>

                <div>
                  <label htmlFor="review-text" className="block text-sm font-medium mb-2">
                    Review (optional)
                  </label>
                  <Textarea
                    id="review-text"
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="Share your experience with this product"
                    rows={4}
                    maxLength={1000}
                  />
                </div>

                <div className="flex gap-2">
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Submitting...' : 'Submit Review'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowReviewForm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </FadeInView>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((review, index) => (
          <FadeInView key={review.id} direction="up" delay={index * 0.1}>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium">
                        {review.user_profile?.first_name || review.user_profile?.username || 'Anonymous'}
                      </p>
                      <div className="flex items-center gap-2">
                        {renderStars(review.rating)}
                        {review.is_verified_purchase && (
                          <Badge variant="outline" className="text-xs">
                            Verified Purchase
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">
                    {formatDate(review.created_at)}
                  </span>
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
        ))}

        {reviews.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-gray-600">No reviews yet. Be the first to review this product!</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ProductReviews;
