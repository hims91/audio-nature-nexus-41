
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Save,
  RefreshCw,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useEnhancedAuth } from '@/contexts/EnhancedAuthContext';
import { useAdminMonitoring } from '@/hooks/useAdminMonitoring';
import { useSettings, useUpdateSettings } from '@/hooks/useSettings';
import { Skeleton } from '@/components/ui/skeleton';
import { TablesUpdate, Tables } from '@/integrations/supabase/types';
import SocialLinksManager, { SocialLink } from '@/components/admin/SocialLinksManager';
import GeneralSettings from '@/components/admin/settings/GeneralSettings';
import PortfolioSettings from '@/components/admin/settings/PortfolioSettings';
import UserSettings from '@/components/admin/settings/UserSettings';
import EmailSettings from '@/components/admin/settings/EmailSettings';
import LogoManager from '@/components/admin/settings/LogoManager';
import ColorThemeManager from '@/components/admin/settings/ColorThemeManager';

interface BrandColors {
  primary: string;
  secondary: string;
  accent: string;
}

interface AdminSettingsData {
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  featuredItemsLimit: number;
  allowUserRegistration: boolean;
  emailNotifications: boolean;
  portfolioAutoApprove: boolean;
  maintenanceMode: boolean;
  socialLinks: SocialLink[];
  logoUrl: string | null;
  brandColors: BrandColors;
}

const AdminSettings: React.FC = () => {
  const { data: initialSettings, isLoading: isLoadingSettings, isError } = useSettings();
  const { mutate: updateSettings, isPending: isSaving } = useUpdateSettings();

  const [settings, setSettings] = useState<AdminSettingsData | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const { isAdmin } = useEnhancedAuth();
  const { toast } = useToast();
  const { trackPageView, logAdminAction } = useAdminMonitoring();

  const mapSettingsForState = (s: Tables<'site_settings'>): AdminSettingsData => {
    const socialLinksWithId = ((s.social_links as any[]) || []).map(link => ({
      ...link,
      id: crypto.randomUUID(),
    }));

    const brandColors = (s.brand_colors as BrandColors) || { 
      primary: "#10b981", 
      secondary: "#059669", 
      accent: "#34d399" 
    };

    return {
      siteName: s.site_name,
      siteDescription: s.site_description,
      contactEmail: s.contact_email,
      featuredItemsLimit: s.featured_items_limit,
      allowUserRegistration: s.allow_user_registration,
      emailNotifications: s.email_notifications,
      portfolioAutoApprove: s.portfolio_auto_approve,
      maintenanceMode: s.maintenance_mode,
      socialLinks: socialLinksWithId,
      logoUrl: s.logo_url,
      brandColors,
    };
  };

  useEffect(() => {
    trackPageView('admin_settings');
  }, [trackPageView]);

  useEffect(() => {
    if (initialSettings) {
      setSettings(mapSettingsForState(initialSettings));
      setHasChanges(false);
    }
  }, [initialSettings]);

  const handleSettingChange = (key: keyof AdminSettingsData, value: any) => {
    setSettings(prev => (prev ? { ...prev, [key]: value } : null));
    setHasChanges(true);
  };

  const saveSettings = async () => {
    if (!settings) return;

    const socialLinksToSave = settings.socialLinks.map(({ platform, url }) => ({ platform, url }));

    const settingsToUpdate: TablesUpdate<'site_settings'> = {
        site_name: settings.siteName,
        site_description: settings.siteDescription,
        contact_email: settings.contactEmail,
        featured_items_limit: settings.featuredItemsLimit,
        allow_user_registration: settings.allowUserRegistration,
        email_notifications: settings.emailNotifications,
        portfolio_auto_approve: settings.portfolioAutoApprove,
        maintenance_mode: settings.maintenanceMode,
        social_links: socialLinksToSave,
        logo_url: settings.logoUrl,
        brand_colors: settings.brandColors,
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
          description: "Your settings have been saved successfully and will be reflected across the site.",
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
      setSettings(mapSettingsForState(initialSettings));
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
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="branding">Branding</TabsTrigger>
          <TabsTrigger value="colors">Colors</TabsTrigger>
          <TabsTrigger value="social">Social</TabsTrigger>
          <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <GeneralSettings settings={settings} handleSettingChange={handleSettingChange} />
        </TabsContent>

        <TabsContent value="branding">
          <LogoManager
            logoUrl={settings.logoUrl}
            onLogoUpdate={(url) => handleSettingChange('logoUrl', url)}
          />
        </TabsContent>

        <TabsContent value="colors">
          <ColorThemeManager
            brandColors={settings.brandColors}
            onColorsUpdate={(colors) => handleSettingChange('brandColors', colors)}
          />
        </TabsContent>

        <TabsContent value="social">
          <SocialLinksManager
            links={settings.socialLinks}
            onUpdate={(newLinks) => handleSettingChange('socialLinks', newLinks)}
          />
        </TabsContent>

        <TabsContent value="portfolio">
          <PortfolioSettings settings={settings} handleSettingChange={handleSettingChange} />
        </TabsContent>

        <TabsContent value="users">
          <UserSettings settings={settings} handleSettingChange={handleSettingChange} />
        </TabsContent>

        <TabsContent value="email">
          <EmailSettings settings={settings} handleSettingChange={handleSettingChange} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSettings;
