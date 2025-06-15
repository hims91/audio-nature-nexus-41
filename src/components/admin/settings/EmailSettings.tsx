
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Mail } from 'lucide-react';

interface EmailSettingsProps {
  settings: {
    emailNotifications: boolean;
  };
  handleSettingChange: (key: string, value: any) => void;
}

const EmailSettings: React.FC<EmailSettingsProps> = ({ settings, handleSettingChange }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Mail className="h-5 w-5 mr-2 text-nature-forest" />
          Email Settings
        </CardTitle>
        <CardDescription>
          Configure email notifications and communication
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div className="space-y-1">
            <Label>Email Notifications</Label>
            <p className="text-sm text-gray-500">
              Send email notifications for important events
            </p>
          </div>
          <Switch
            checked={settings.emailNotifications}
            onCheckedChange={(checked) => handleSettingChange('emailNotifications', checked)}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default EmailSettings;
