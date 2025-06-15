
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useSettings, useUpdateSettings } from '@/hooks/useSettings';
import { useToast } from '@/hooks/use-toast';
import { useEnhancedAuth } from '@/contexts/EnhancedAuthContext';
import { useAdminMonitoring } from '@/hooks/useAdminMonitoring';
import { Skeleton } from '@/components/ui/skeleton';
import { Tables, TablesUpdate } from '@/integrations/supabase/types';
import type { SocialLink } from '@/components/admin/SocialLinksManager';
import AdminSettingsHeader from '@/components/admin/settings/AdminSettingsHeader';
import SettingsTabs from '@/components/admin/settings/SettingsTabs';
import { AdminSettingsData, BrandColors } from '@/types/settings';


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

    let brandColors: BrandColors = { 
      primary: "#10b981", 
      secondary: "#059669", 
      accent: "#34d399" 
    };
    
    if (s.brand_colors && typeof s.brand_colors === 'object' && !Array.isArray(s.brand_colors)) {
      const colors = s.brand_colors as Record<string, any>;
      if (colors.primary && colors.secondary && colors.accent) {
        brandColors = {
          primary: String(colors.primary),
          secondary: String(colors.secondary),
          accent: String(colors.accent)
        };
      }
    }

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
        brand_colors: settings.brandColors as any,
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
      <AdminSettingsHeader
        isSaving={isSaving}
        hasChanges={hasChanges}
        onSave={saveSettings}
        onReset={resetChanges}
      />
      <SettingsTabs
        settings={settings}
        handleSettingChange={handleSettingChange}
      />
    </div>
  );
};

export default AdminSettings;
