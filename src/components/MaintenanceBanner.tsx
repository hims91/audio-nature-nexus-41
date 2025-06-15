
import React from 'react';
import { useSettings } from '@/hooks/useSettings';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Wrench } from 'lucide-react';

const MaintenanceBanner: React.FC = () => {
  const { data: settings } = useSettings();

  if (!settings?.maintenance_mode) {
    return null;
  }

  return (
    <Alert variant="destructive" className="rounded-none border-l-0 border-r-0 border-t-0 sticky top-0 z-50">
      <Wrench className="h-4 w-4" />
      <AlertTitle>Maintenance Mode Active</AlertTitle>
      <AlertDescription>
        The site is currently in maintenance mode. Public access is disabled.
      </AlertDescription>
    </Alert>
  );
};

export default MaintenanceBanner;
