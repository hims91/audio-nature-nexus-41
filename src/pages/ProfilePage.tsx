
import React from 'react';
import AvatarUploader from '@/components/profile/AvatarUploader';
import ProfileForm from '@/components/profile/ProfileForm';
import { useUserProfile } from '@/hooks/useUserProfile';
import LoadingSpinner from '@/components/animations/LoadingSpinner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';
import UnifiedNavbar from '@/components/UnifiedNavbar';
import Footer from '@/components/Footer';
import { SEOManager } from '@/components/SEO/SEOManager';

const ProfilePage: React.FC = () => {
  const { isLoading, isError, profile } = useUserProfile();

  const pageContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-full">
          <LoadingSpinner size="lg" />
        </div>
      );
    }
  
    if (isError || !profile) {
      return (
        <div className="flex items-center justify-center h-full p-4">
          <Alert variant="destructive" className="max-w-lg">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              Could not load your profile. Please try again later.
            </AlertDescription>
          </Alert>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
        <div className="md:col-span-1 flex justify-center">
          <AvatarUploader />
        </div>
        <div className="md:col-span-2">
          <ProfileForm />
        </div>
      </div>
    );
  }


  return (
    <>
      <SEOManager
        title="My Profile"
        description="Manage your profile information and settings."
        canonicalUrl={`${window.location.origin}/profile`}
      />
      <UnifiedNavbar />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
        <main className="container mx-auto px-4 py-12 md:py-24 max-w-4xl flex-grow">
          <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">Your Profile</h1>
          {pageContent()}
        </main>
      </div>
      <Footer />
    </>
  );
};

export default ProfilePage;
