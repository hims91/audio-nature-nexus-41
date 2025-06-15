
import React from 'react';
import { Wrench } from 'lucide-react';
import { BrandLogo } from '@/components/enhanced/BrandConsistencyManager';

const MaintenancePage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 text-center p-4">
      <BrandLogo size="lg" />
      <Wrench className="h-16 w-16 text-nature-forest my-8" />
      <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
        Under Maintenance
      </h1>
      <p className="text-lg text-gray-600 dark:text-gray-300 max-w-md">
        Our site is currently undergoing scheduled maintenance. We should be back shortly. Thank you for your patience.
      </p>
    </div>
  );
};

export default MaintenancePage;
