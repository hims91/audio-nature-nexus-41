
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Users, DollarSign, Tag } from 'lucide-react';
import { useDiscountAnalytics } from '@/hooks/useDiscountAnalytics';
import { formatPrice } from '@/utils/currency';
import LoadingSpinner from '@/components/animations/LoadingSpinner';
import FadeInView from '@/components/animations/FadeInView';

const DiscountAnalytics: React.FC = () => {
  const { stats, isLoading, error } = useDiscountAnalytics();

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !stats) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-gray-500">Failed to load analytics</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <FadeInView direction="up">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Total Codes
                  </p>
                  <p className="text-2xl font-bold">{stats.total_codes}</p>
                </div>
                <Tag className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </FadeInView>

        <FadeInView direction="up" delay={0.1}>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Active Codes
                  </p>
                  <p className="text-2xl font-bold text-green-600">{stats.active_codes}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </FadeInView>

        <FadeInView direction="up" delay={0.2}>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Total Usage
                  </p>
                  <p className="text-2xl font-bold">{stats.total_usage}</p>
                </div>
                <Users className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </FadeInView>

        <FadeInView direction="up" delay={0.3}>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Total Discount Given
                  </p>
                  <p className="text-2xl font-bold text-red-600">
                    {formatPrice(stats.total_discount_given)}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </FadeInView>
      </div>

      {/* Top Performing Codes */}
      <FadeInView direction="up" delay={0.4}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Top Performing Codes
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stats.top_performing_codes.length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                No discount codes have been used yet
              </p>
            ) : (
              <div className="space-y-4">
                {stats.top_performing_codes.map((code, index) => (
                  <div
                    key={code.code}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="text-lg px-3 py-1">
                        #{index + 1}
                      </Badge>
                      <div>
                        <p className="font-semibold font-mono">{code.code}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Used {code.usage_count} times
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-red-600">
                        {formatPrice(code.total_discount)}
                      </p>
                      <p className="text-xs text-gray-500">total discount</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </FadeInView>
    </div>
  );
};

export default DiscountAnalytics;
