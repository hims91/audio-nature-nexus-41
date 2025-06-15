
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Globe } from 'lucide-react';

interface GeneralSettingsProps {
  settings: {
    siteName: string;
    siteDescription: string;
    contactEmail: string;
    maintenanceMode: boolean;
  };
  handleSettingChange: (key: string, value: any) => void;
}

const GeneralSettings: React.FC<GeneralSettingsProps> = ({ settings, handleSettingChange }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Globe className="h-5 w-5 mr-2 text-nature-forest" />
          General Settings
        </CardTitle>
        <CardDescription>
          Basic site configuration and branding
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="siteName">Site Name</Label>
            <Input
              id="siteName"
              value={settings.siteName}
              onChange={(e) => handleSettingChange('siteName', e.target.value)}
              placeholder="Enter site name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contactEmail">Contact Email</Label>
            <Input
              id="contactEmail"
              type="email"
              value={settings.contactEmail}
              onChange={(e) => handleSettingChange('contactEmail', e.target.value)}
              placeholder="Enter contact email"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="siteDescription">Site Description</Label>
          <Textarea
            id="siteDescription"
            value={settings.siteDescription}
            onChange={(e) => handleSettingChange('siteDescription', e.target.value)}
            placeholder="Enter site description"
            rows={3}
          />
        </div>

        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div className="space-y-1">
            <Label>Maintenance Mode</Label>
            <p className="text-sm text-gray-500">
              Put the site in maintenance mode for updates
            </p>
          </div>
          <Switch
            checked={settings.maintenanceMode}
            onCheckedChange={(checked) => handleSettingChange('maintenanceMode', checked)}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default GeneralSettings;
