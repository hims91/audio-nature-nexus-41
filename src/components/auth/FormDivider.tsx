
import React from 'react';

const FormDivider: React.FC = () => {
  return (
    <div className="relative my-6">
      <div className="absolute inset-0 flex items-center">
        <span className="w-full border-t border-gray-200 dark:border-gray-700" />
      </div>
      <div className="relative flex justify-center text-sm">
        <span className="px-4 bg-white/90 dark:bg-gray-900/90 text-gray-500 dark:text-gray-400 font-medium">
          Or continue with email
        </span>
      </div>
    </div>
  );
};

export default FormDivider;
