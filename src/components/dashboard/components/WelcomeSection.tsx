
import React from 'react';
import { User } from '@supabase/supabase-js';
import { Card, CardContent } from '@/components/ui/card';
import OptimizedAvatar from '@/components/performance/OptimizedAvatar';
import { formatDistanceToNow } from 'date-fns';

interface WelcomeSectionProps {
  user: User | null;
  userProfile: any;
}

const WelcomeSection: React.FC<WelcomeSectionProps> = ({ user, userProfile }) => {
  const firstName = userProfile?.first_name || user?.user_metadata?.first_name;
  const lastName = userProfile?.last_name || user?.user_metadata?.last_name;
  const fullName = firstName && lastName ? `${firstName} ${lastName}` : 'User';
  
  const memberSince = userProfile?.created_at 
    ? formatDistanceToNow(new Date(userProfile.created_at), { addSuffix: true })
    : 'recently';

  return (
    <Card className="bg-gradient-to-r from-nature-forest to-nature-leaf text-white">
      <CardContent className="p-6">
        <div className="flex items-center space-x-4">
          <OptimizedAvatar
            src={userProfile?.avatar_url}
            alt={fullName}
            fallbackText={firstName?.[0] || 'U'}
            className="h-16 w-16 text-lg"
          />
          <div>
            <h1 className="text-2xl font-bold">Welcome back, {firstName || 'User'}!</h1>
            <p className="text-nature-mist">
              Member since {memberSince} • {user?.email}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WelcomeSection;
