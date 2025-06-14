
import React from "react";
import { usePortfolioData } from "@/hooks/usePortfolioData";
import LoadingSpinner from "@/components/animations/LoadingSpinner";
import AdminAnalyticsCharts from "@/components/admin/AdminAnalyticsCharts";
import FadeInView from "@/components/animations/FadeInView";

const AdminAnalytics: React.FC = () => {
  const { isLoading } = usePortfolioData();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <FadeInView direction="up">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Portfolio Analytics
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Comprehensive insights into your portfolio performance and growth
          </p>
        </div>
      </FadeInView>

      <FadeInView direction="up" delay={0.1}>
        <AdminAnalyticsCharts />
      </FadeInView>
    </div>
  );
};

export default AdminAnalytics;
