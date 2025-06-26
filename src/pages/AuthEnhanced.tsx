
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEnhancedAuth } from '@/hooks/useEnhancedAuth';
import { useToast } from '@/hooks/use-toast';
import UnifiedNavbar from '@/components/UnifiedNavbar';
import Footer from '@/components/Footer';
import AuthCard from '@/components/auth/AuthCard';
import SocialButton from '@/components/auth/SocialButton';
import InteractiveButton from '@/components/interactive/InteractiveButton';

const AuthEnhanced: React.FC = () => {
  const { 
    signInWithGoogle, 
    socialLoading, 
    user,
    trackLoginSession 
  } = useEnhancedAuth();
  
  const { toast } = useToast();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      console.log('User authenticated, redirecting to home');
      navigate('/');
    }
  }, [user, navigate]);

  const handleGoogleLogin = async () => {
    try {
      console.log('Attempting Google login');
      const result = await signInWithGoogle();

      if (!result.error) {
        // Note: Session tracking will happen after OAuth redirect
        toast({
          title: "Redirecting...",
          description: "Redirecting to Gmail for authentication.",
        });
      }
    } catch (error) {
      console.error('Google login error:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-nature-cream/30 via-white to-nature-sage/20 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <UnifiedNavbar />
      
      <main className="flex-grow py-16 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <AuthCard
            title="Welcome to Terra Echo Studios"
            description="Sign in with your Gmail account to access your portfolio and manage your content"
          >
            {/* Gmail Login Button */}
            <div className="space-y-6">
              <SocialButton
                provider="google"
                onClick={handleGoogleLogin}
                loading={socialLoading === 'google'}
              />
              
              <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                By signing in, you agree to our Terms of Service and Privacy Policy
              </div>
            </div>
          </AuthCard>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AuthEnhanced;
