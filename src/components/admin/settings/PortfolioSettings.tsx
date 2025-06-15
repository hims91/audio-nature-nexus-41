
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Palette } from 'lucide-react';

interface PortfolioSettingsProps {
  settings: {
    featuredItemsLimit: number;
    portfolioAutoApprove: boolean;
  };
  handleSettingChange: (key: string, value: any) => void;
}

const PortfolioSettings: React.FC<PortfolioSettingsProps> = ({ settings, handleSettingChange }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Palette className="h-5 w-5 mr-2 text-nature-forest" />
          Portfolio Settings
        </CardTitle>
        <CardDescription>
          Configure portfolio display and management options
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="featuredLimit">Featured Items Limit</Label>
          <Input
            id="featuredLimit"
            type="number"
            min="1"
            max="12"
            value={settings.featuredItemsLimit}
            onChange={(e) => handleSettingChange('featuredItemsLimit', parseInt(e.target.value))}
          />
          <p className="text-sm text-gray-500">
            Maximum number of featured items to display on the homepage
          </p>
        </div>

        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div className="space-y-1">
            <Label>Auto-approve Portfolio Items</Label>
            <p className="text-sm text-gray-500">
              Automatically publish new portfolio items without review
            </p>
          </div>
          <Switch
            checked={settings.portfolioAutoApprove}
            onCheckedChange={(checked) => handleSettingChange('portfolioAutoApprove', checked)}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default PortfolioSettings;
