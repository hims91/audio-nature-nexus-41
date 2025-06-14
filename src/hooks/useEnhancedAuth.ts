
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface AuthSession {
  id: string;
  user_id: string;
  login_method: string;
  ip_address?: string | null;
  user_agent?: string | null;
  location?: string | null;
  device_info?: any;
  session_start: string;
  session_end?: string | null;
  is_active: boolean;
  created_at: string;
}

export const useEnhancedAuth = () => {
  const { signIn, signUp, signOut, user, session, loading } = useAuth();
  const { toast } = useToast();
  const [socialLoading, setSocialLoading] = useState<string | null>(null);

  const signInWithGoogle = async () => {
    setSocialLoading('google');
    try {
      const redirectUrl = `${window.location.origin}/`;
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
        },
      });

      if (error) {
        toast({
          title: "Google Sign In Error",
          description: error.message,
          variant: "destructive",
        });
        return { error };
      }

      return { error: null };
    } catch (error: any) {
      toast({
        title: "Error",
        description: "An unexpected error occurred during Google sign in.",
        variant: "destructive",
      });
      return { error };
    } finally {
      setSocialLoading(null);
    }
  };

  const signInWithTwitter = async () => {
    setSocialLoading('twitter');
    try {
      const redirectUrl = `${window.location.origin}/`;
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'twitter',
        options: {
          redirectTo: redirectUrl,
        },
      });

      if (error) {
        toast({
          title: "X Sign In Error",
          description: error.message,
          variant: "destructive",
        });
        return { error };
      }

      return { error: null };
    } catch (error: any) {
      toast({
        title: "Error",
        description: "An unexpected error occurred during X sign in.",
        variant: "destructive",
      });
      return { error };
    } finally {
      setSocialLoading(null);
    }
  };

  const trackLoginSession = async (loginMethod: string) => {
    if (!user) return;

    try {
      const userAgent = navigator.userAgent;
      const deviceInfo = {
        platform: navigator.platform,
        language: navigator.language,
        cookieEnabled: navigator.cookieEnabled,
        screenResolution: `${screen.width}x${screen.height}`,
      };

      const { data, error } = await supabase.rpc('track_login_session', {
        p_user_id: user.id,
        p_login_method: loginMethod,
        p_user_agent: userAgent,
        p_device_info: deviceInfo,
      });

      if (error) {
        console.warn('Failed to track login session:', error);
      }
    } catch (error) {
      console.warn('Error tracking login session:', error);
    }
  };

  const getActiveSessions = async (): Promise<AuthSession[]> => {
    if (!user) return [];

    try {
      const { data, error } = await supabase
        .from('auth_sessions')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('session_start', { ascending: false });

      if (error) {
        console.error('Failed to fetch sessions:', error);
        return [];
      }

      return (data || []).map(session => ({
        ...session,
        ip_address: session.ip_address as string | null,
        user_agent: session.user_agent as string | null,
        location: session.location as string | null,
        session_end: session.session_end as string | null,
      }));
    } catch (error) {
      console.error('Error fetching sessions:', error);
      return [];
    }
  };

  const terminateSession = async (sessionId: string) => {
    try {
      const { error } = await supabase
        .from('auth_sessions')
        .update({ 
          is_active: false, 
          session_end: new Date().toISOString() 
        })
        .eq('id', sessionId);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to terminate session.",
          variant: "destructive",
        });
        return { error };
      }

      toast({
        title: "Session Terminated",
        description: "The session has been successfully terminated.",
      });

      return { error: null };
    } catch (error: any) {
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
      return { error };
    }
  };

  return {
    // Original auth methods
    signIn,
    signUp,
    signOut,
    user,
    session,
    loading,
    
    // Enhanced social auth methods
    signInWithGoogle,
    signInWithTwitter,
    socialLoading,
    
    // Session management
    trackLoginSession,
    getActiveSessions,
    terminateSession,
  };
};
