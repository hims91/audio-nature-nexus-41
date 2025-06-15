
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import GeneralSettings from '@/components/admin/settings/GeneralSettings';
import PortfolioSettings from '@/components/admin/settings/PortfolioSettings';
import UserSettings from '@/components/admin/settings/UserSettings';
import EmailSettings from '@/components/admin/settings/EmailSettings';
import LogoManager from '@/components/admin/settings/LogoManager';
import ColorThemeManager from '@/components/admin/settings/ColorThemeManager';
import SocialLinksManager from '@/components/admin/SocialLinksManager';
import { AdminSettingsData } from '@/types/settings';

interface SettingsTabsProps {
    settings: AdminSettingsData;
    handleSettingChange: (key: keyof AdminSettingsData, value: any) => void;
}

const SettingsTabs: React.FC<SettingsTabsProps> = ({ settings, handleSettingChange }) => {
    return (
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
    );
};

export default SettingsTabs;
