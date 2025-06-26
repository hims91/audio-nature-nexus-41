
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, firstName?: string, lastName?: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  sendPasswordResetEmail: (email: string) => Promise<{ error: any }>;
  resetPassword: (token: string, newPassword: string) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        // Send welcome email for new signups (but not for OAuth or existing users)
        if (event === 'SIGNED_UP' && session?.user && !session.user.app_metadata?.provider) {
          console.log('New user signed up, sending welcome email');
          setTimeout(async () => {
            try {
              const { data: profile } = await supabase
                .from('user_profiles')
                .select('first_name, last_name')
                .eq('user_id', session.user.id)
                .single();

              await supabase.functions.invoke('send-welcome-email', {
                body: {
                  email: session.user.email,
                  firstName: profile?.first_name || 'User',
                  lastName: profile?.last_name || ''
                }
              });
            } catch (error) {
              console.error('Failed to send welcome email:', error);
            }
          }, 1000);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, firstName?: string, lastName?: string) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          first_name: firstName || '',
          last_name: lastName || ''
        }
      }
    });
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const sendPasswordResetEmail = async (email: string) => {
    try {
      const { error } = await supabase.functions.invoke('send-password-reset-email', {
        body: { email }
      });
      return { error };
    } catch (error: any) {
      return { error };
    }
  };

  const resetPassword = async (token: string, newPassword: string) => {
    try {
      // Verify the token first
      const { data: tokenData, error: verifyError } = await supabase
        .rpc('verify_password_reset_token', { reset_token: token });

      if (verifyError || !tokenData?.[0]?.is_valid) {
        return { error: new Error('Invalid or expired reset token') };
      }

      // Update the password using Supabase auth
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      return { error };
    } catch (error: any) {
      return { error };
    }
  };

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    sendPasswordResetEmail,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
