
import React from 'react';
import { Button } from '@/components/ui/button';
import { Save, RefreshCw } from 'lucide-react';

interface AdminSettingsHeaderProps {
  isSaving: boolean;
  hasChanges: boolean;
  onSave: () => void;
  onReset: () => void;
}

const AdminSettingsHeader: React.FC<AdminSettingsHeaderProps> = ({ isSaving, hasChanges, onSave, onReset }) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-nature-forest dark:text-white">
          Settings
        </h1>
        <p className="text-nature-bark dark:text-gray-300 mt-2">
          Configure application settings and preferences
        </p>
      </div>
      <div className="flex space-x-2">
        <Button
          variant="outline"
          onClick={onReset}
          disabled={!hasChanges || isSaving}
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Reset
        </Button>
        <Button
          onClick={onSave}
          disabled={!hasChanges || isSaving}
        >
          <Save className="h-4 w-4 mr-2" />
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </div>
  );
};

export default AdminSettingsHeader;
