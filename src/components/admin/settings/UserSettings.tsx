
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Users } from 'lucide-react';

interface UserSettingsProps {
  settings: {
    allowUserRegistration: boolean;
  };
  handleSettingChange: (key: string, value: any) => void;
}

const UserSettings: React.FC<UserSettingsProps> = ({ settings, handleSettingChange }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Users className="h-5 w-5 mr-2 text-nature-forest" />
          User Management
        </CardTitle>
        <CardDescription>
          Configure user registration and account settings
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div className="space-y-1">
            <Label>Allow User Registration</Label>
            <p className="text-sm text-gray-500">
              Allow new users to register for accounts
            </p>
          </div>
          <Switch
            checked={settings.allowUserRegistration}
            onCheckedChange={(checked) => handleSettingChange('allowUserRegistration', checked)}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default UserSettings;
