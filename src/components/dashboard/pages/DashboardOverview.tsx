
import React from 'react';
import { useEnhancedAuth } from '@/contexts/EnhancedAuthContext';
import WelcomeSection from '../components/WelcomeSection';
import QuickStatsCards from '../components/QuickStatsCards';
import RecentActivityFeed from '../components/RecentActivityFeed';
import QuickActions from '../components/QuickActions';
import RecommendedProducts from '../components/RecommendedProducts';

const DashboardOverview: React.FC = () => {
  const { user, userProfile } = useEnhancedAuth();

  return (
    <div className="space-y-6">
      <WelcomeSection user={user} userProfile={userProfile} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <QuickStatsCards />
          <RecentActivityFeed />
        </div>
        
        <div className="space-y-6">
          <QuickActions />
          <RecommendedProducts />
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
