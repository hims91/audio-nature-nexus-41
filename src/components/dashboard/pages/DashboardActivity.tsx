
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useUserActivity } from '@/hooks/useDashboardStats';
import { formatDistanceToNow } from 'date-fns';
import LoadingSpinner from '@/components/animations/LoadingSpinner';

const DashboardActivity: React.FC = () => {
  const { data: activities, isLoading } = useUserActivity();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Activity Log</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Recent account activity and actions.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-4">
              <LoadingSpinner size="sm" />
            </div>
          ) : activities && activities.length > 0 ? (
            <div className="space-y-4">
              {activities.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div>
                    <p className="font-medium">{activity.action}</p>
                    {activity.resource_type && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {activity.resource_type}: {activity.resource_id}
                      </p>
                    )}
                  </div>
                  <div className="text-sm text-gray-500">
                    {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No recent activity</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardActivity;
