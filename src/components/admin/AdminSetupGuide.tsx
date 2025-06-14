
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  Database, 
  CheckCircle, 
  AlertCircle, 
  ExternalLink 
} from 'lucide-react';
import { useEnhancedAuth } from '@/contexts/EnhancedAuthContext';

const AdminSetupGuide: React.FC = () => {
  const { user, userProfile, isAdmin } = useEnhancedAuth();

  const setupSteps = [
    {
      id: 'register',
      title: 'Create Account',
      description: 'Register using the /auth page',
      completed: !!user,
      icon: CheckCircle
    },
    {
      id: 'profile',
      title: 'User Profile Created',
      description: 'Profile record in user_profiles table',
      completed: !!userProfile,
      icon: Database
    },
    {
      id: 'admin',
      title: 'Admin Role Assigned',
      description: 'Set role to "admin" in Supabase',
      completed: isAdmin,
      icon: Shield
    }
  ];

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Shield className="h-5 w-5 mr-2 text-nature-forest" />
          Admin Setup Guide
        </CardTitle>
        <CardDescription>
          Follow these steps to set up admin access
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Status */}
        <Alert className={isAdmin ? 'border-green-200 bg-green-50 dark:bg-green-950/20' : 'border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20'}>
          {isAdmin ? (
            <CheckCircle className="h-4 w-4 text-green-600" />
          ) : (
            <AlertCircle className="h-4 w-4 text-yellow-600" />
          )}
          <AlertDescription className={isAdmin ? 'text-green-800 dark:text-green-200' : 'text-yellow-800 dark:text-yellow-200'}>
            {isAdmin ? (
              <strong>Admin access is active!</strong>
            ) : (
              <strong>Admin setup required:</strong>
            )}
            <br />
            {user ? `Logged in as: ${user.email}` : 'Not logged in'}
            {userProfile && (
              <><br />Role: <Badge variant="outline">{userProfile.role || 'user'}</Badge></>
            )}
          </AlertDescription>
        </Alert>

        {/* Setup Steps */}
        <div className="space-y-4">
          {setupSteps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div 
                key={step.id}
                className={`flex items-start space-x-3 p-3 rounded-lg border ${
                  step.completed 
                    ? 'bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800' 
                    : 'bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700'
                }`}
              >
                <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                  step.completed 
                    ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400' 
                    : 'bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500'
                }`}>
                  {step.completed ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <span className="text-sm font-medium">{index + 1}</span>
                  )}
                </div>
                <div className="flex-1">
                  <h4 className={`font-medium ${
                    step.completed 
                      ? 'text-green-900 dark:text-green-100' 
                      : 'text-gray-900 dark:text-gray-100'
                  }`}>
                    {step.title}
                  </h4>
                  <p className={`text-sm ${
                    step.completed 
                      ? 'text-green-700 dark:text-green-300' 
                      : 'text-gray-600 dark:text-gray-400'
                  }`}>
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Manual Admin Setup Instructions */}
        {user && userProfile && !isAdmin && (
          <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-950/20 dark:border-blue-800">
            <Database className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800 dark:text-blue-200">
              <strong>Manual Admin Setup Required:</strong>
              <br />
              1. Go to your Supabase dashboard
              <br />
              2. Navigate to Table Editor → user_profiles
              <br />
              3. Find your record (user_id: <code className="text-xs bg-blue-100 px-1 rounded dark:bg-blue-900">{user.id}</code>)
              <br />
              4. Change the "role" field from "user" to "admin"
              <br />
              5. Save the changes and refresh this page
            </AlertDescription>
          </Alert>
        )}

        {/* Supabase Dashboard Link */}
        <div className="flex justify-center">
          <a
            href="https://supabase.com/dashboard/project/kfkxbbhzpnouixxougxw/editor"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 dark:bg-blue-950/20 dark:border-blue-800 dark:text-blue-400 dark:hover:bg-blue-900/30"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Open Supabase Dashboard
          </a>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminSetupGuide;
