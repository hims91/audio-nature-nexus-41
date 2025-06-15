
import type { SocialLink } from '@/components/admin/SocialLinksManager';

export interface BrandColors {
  primary: string;
  secondary: string;
  accent: string;
}

export interface AdminSettingsData {
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
