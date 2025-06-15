
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Settings, 
  Palette, 
  Mail, 
  Users, 
  Save,
  RefreshCw,
  Globe,
  Shield
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useEnhancedAuth } from '@/contexts/EnhancedAuthContext';
import { useAdminMonitoring } from '@/hooks/useAdminMonitoring';
import { useSettings, useUpdateSettings } from '@/hooks/useSettings';
import { Skeleton } from '@/components/ui/skeleton';
import { TablesUpdate } from '@/integrations/supabase/types';

interface AdminSettingsData {
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  featuredItemsLimit: number;
  allowUserRegistration: boolean;
  emailNotifications: boolean;
  portfolioAutoApprove: boolean;
  maintenanceMode: boolean;
}

const AdminSettings: React.FC = () => {
  const { data: initialSettings, isLoading: isLoadingSettings, isError } = useSettings();
  const { mutate: updateSettings, isPending: isSaving } = useUpdateSettings();

  const [settings, setSettings] = useState<AdminSettingsData | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const { isAdmin } = useEnhancedAuth();
  const { toast } = useToast();
  const { trackPageView, logAdminAction } = useAdminMonitoring();

  useEffect(() => {
    trackPageView('admin_settings');
  }, [trackPageView]);

  useEffect(() => {
    if (initialSettings) {
      setSettings({
        siteName: initialSettings.site_name,
        siteDescription: initialSettings.site_description,
        contactEmail: initialSettings.contact_email,
        featuredItemsLimit: initialSettings.featured_items_limit,
        allowUserRegistration: initialSettings.allow_user_registration,
        emailNotifications: initialSettings.email_notifications,
        portfolioAutoApprove: initialSettings.portfolio_auto_approve,
        maintenanceMode: initialSettings.maintenance_mode,
      });
      setHasChanges(false);
    }
  }, [initialSettings]);

  const handleSettingChange = (key: keyof AdminSettingsData, value: any) => {
    setSettings(prev => (prev ? { ...prev, [key]: value } : null));
    setHasChanges(true);
  };

  const saveSettings = async () => {
    if (!settings) return;

    const settingsToUpdate: TablesUpdate<'site_settings'> = {
        site_name: settings.siteName,
        site_description: settings.siteDescription,
        contact_email: settings.contactEmail,
        featured_items_limit: settings.featuredItemsLimit,
        allow_user_registration: settings.allowUserRegistration,
        email_notifications: settings.emailNotifications,
        portfolio_auto_approve: settings.portfolioAutoApprove,
        maintenance_mode: settings.maintenanceMode,
    };

    updateSettings(settingsToUpdate, {
      onSuccess: () => {
        logAdminAction('settings_update', 'site_settings', '1', {
          settings: settingsToUpdate,
          timestamp: new Date().toISOString()
        });
        setHasChanges(false);
        toast({
          title: "Settings Saved",
          description: "Your settings have been saved successfully.",
        });
      },
      onError: (error: any) => {
        console.error('❌ Error saving settings:', error);
        toast({
          title: "Error",
          description: "Failed to save settings.",
          variant: "destructive",
        });
      }
    });
  };

  const resetChanges = () => {
    if (initialSettings) {
      setSettings({
        siteName: initialSettings.site_name,
        siteDescription: initialSettings.site_description,
        contactEmail: initialSettings.contact_email,
        featuredItemsLimit: initialSettings.featured_items_limit,
        allowUserRegistration: initialSettings.allow_user_registration,
        emailNotifications: initialSettings.email_notifications,
        portfolioAutoApprove: initialSettings.portfolio_auto_approve,
        maintenanceMode: initialSettings.maintenance_mode,
      });
      setHasChanges(false);
    }
  };

  if (!isAdmin) {
    return null;
  }

  if (isLoadingSettings) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
            <div className='space-y-2'>
              <Skeleton className="h-9 w-48" />
              <Skeleton className="h-5 w-80" />
            </div>
            <div className="flex space-x-2">
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-10 w-32" />
            </div>
        </div>
        <Skeleton className="h-10 w-full" />
        <Card>
            <CardHeader><Skeleton className="h-6 w-1/4" /><Skeleton className="h-4 w-1/2 mt-2" /></CardHeader>
            <CardContent className="space-y-6"><Skeleton className="h-24 w-full" /><Skeleton className="h-12 w-full" /></CardContent>
        </Card>
      </div>
    );
  }

  if (isError || !settings) {
    return <div className="text-destructive font-semibold">Could not load site settings. Please try refreshing the page.</div>;
  }

  return (
    <div className="space-y-6">
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
            onClick={resetChanges}
            disabled={!hasChanges || isSaving}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset
          </Button>
          <Button 
            onClick={saveSettings}
            disabled={!hasChanges || isSaving}
          >
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
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
        </TabsContent>

        <TabsContent value="portfolio">
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
        </TabsContent>

        <TabsContent value="users">
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
        </TabsContent>

        <TabsContent value="email">
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
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSettings;
