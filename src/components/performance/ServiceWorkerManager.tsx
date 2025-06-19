
import React, { useEffect, useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { useServiceWorker } from '@/hooks/useServiceWorker';

const ServiceWorkerManager: React.FC = () => {
  const { isSupported, isRegistered, isUpdating, hasUpdate, updateServiceWorker } = useServiceWorker();
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isSupported) {
    return (
      <Alert className="border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20 dark:border-yellow-800">
        <AlertCircle className="h-4 w-4 text-yellow-600" />
        <AlertDescription className="text-yellow-800 dark:text-yellow-200">
          Service Workers are not supported in this browser. Offline functionality will be limited.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      {/* Online Status */}
      <Alert className={isOnline ? 'border-green-200 bg-green-50 dark:bg-green-950/20 dark:border-green-800' : 'border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-800'}>
        <CheckCircle className={`h-4 w-4 ${isOnline ? 'text-green-600' : 'text-red-600'}`} />
        <AlertDescription className={isOnline ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'}>
          {isOnline ? 'Online - All features available' : 'Offline - Using cached content'}
        </AlertDescription>
      </Alert>

      {/* Service Worker Status */}
      {isRegistered && (
        <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-950/20 dark:border-blue-800">
          <CheckCircle className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800 dark:text-blue-200">
            Service Worker is active. App will work offline and load faster.
          </AlertDescription>
        </Alert>
      )}

      {/* Update Available */}
      {hasUpdate && (
        <Alert className="border-orange-200 bg-orange-50 dark:bg-orange-950/20 dark:border-orange-800">
          <RefreshCw className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800 dark:text-orange-200 flex items-center justify-between">
            <span>A new version of the app is available!</span>
            <Button
              size="sm"
              onClick={updateServiceWorker}
              className="bg-orange-600 hover:bg-orange-700 text-white"
            >
              Update Now
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Updating Status */}
      {isUpdating && (
        <Alert className="border-purple-200 bg-purple-50 dark:bg-purple-950/20 dark:border-purple-800">
          <RefreshCw className="h-4 w-4 text-purple-600 animate-spin" />
          <AlertDescription className="text-purple-800 dark:text-purple-200">
            Updating app in the background...
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default ServiceWorkerManager;
