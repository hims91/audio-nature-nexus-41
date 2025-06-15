import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useEnhancedAuth } from '@/hooks/useEnhancedAuth';
import { useToast } from '@/hooks/use-toast';
import UnifiedNavbar from '@/components/UnifiedNavbar';
import Footer from '@/components/Footer';
import AuthCard from '@/components/auth/AuthCard';
import SocialButton from '@/components/auth/SocialButton';
import FormDivider from '@/components/auth/FormDivider';
import InteractiveButton from '@/components/interactive/InteractiveButton';
import { Eye, EyeOff } from 'lucide-react';

const AuthEnhanced: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  
  const { 
    signIn, 
    signUp, 
    signInWithGoogle, 
    signInWithTwitter, 
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

  const validateForm = () => {
    if (!email || !password) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return false;
    }

    if (!isLogin && password !== confirmPassword) {
      toast({
        title: "Validation Error",
        description: "Passwords do not match.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setFormLoading(true);

    try {
      let result;
      if (isLogin) {
        console.log('Attempting sign in for:', email);
        result = await signIn(email, password);
        if (!result.error) {
          console.log('Sign in successful, tracking session');
          await trackLoginSession('email');
          toast({
            title: "Welcome back!",
            description: "You have been successfully signed in.",
          });
          navigate('/');
        }
      } else {
        console.log('Attempting sign up for:', email);
        result = await signUp(email, password);
        if (!result.error) {
          toast({
            title: "Account created!",
            description: "Please check your email to verify your account.",
          });
          setIsLogin(true); // Switch to login mode after successful signup
        }
      }

      if (result.error) {
        console.error('Auth error:', result.error);
        toast({
          title: "Authentication Error",
          description: result.error.message,
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error('Unexpected auth error:', error);
      toast({
        title: "Authentication Error",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setFormLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'twitter') => {
    try {
      console.log(`Attempting ${provider} login`);
      let result;
      if (provider === 'google') {
        result = await signInWithGoogle();
      } else {
        result = await signInWithTwitter();
      }

      if (!result.error) {
        // Note: Session tracking will happen after OAuth redirect
        toast({
          title: "Redirecting...",
          description: `Redirecting to ${provider === 'google' ? 'Google' : 'X'} for authentication.`,
        });
      }
    } catch (error) {
      console.error(`${provider} login error:`, error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-nature-cream/30 via-white to-nature-sage/20 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <UnifiedNavbar />
      
      <main className="flex-grow py-16 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <AuthCard
            title={isLogin ? 'Welcome Back' : 'Create Account'}
            description={
              isLogin 
                ? 'Sign in to access your portfolio and manage your content' 
                : 'Join us to showcase your work and connect with others'
            }
          >
            {/* Social Login Buttons */}
            <div className="space-y-3">
              <SocialButton
                provider="google"
                onClick={() => handleSocialLogin('google')}
                loading={socialLoading === 'google'}
              />
              <SocialButton
                provider="twitter"
                onClick={() => handleSocialLogin('twitter')}
                loading={socialLoading === 'twitter'}
              />
            </div>

            <FormDivider />

            {/* Email/Password Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Enter your email address"
                  className="mt-1 bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 focus:border-nature-forest dark:focus:border-nature-leaf"
                />
              </div>
              
              <div>
                <Label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Password
                </Label>
                <div className="relative mt-1">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Enter your password"
                    className="pr-10 bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 focus:border-nature-forest dark:focus:border-nature-leaf"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {!isLogin && (
                <div>
                  <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Confirm Password
                  </Label>
                  <div className="relative mt-1">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      placeholder="Confirm your password"
                      className="pr-10 bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 focus:border-nature-forest dark:focus:border-nature-leaf"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              )}

              <InteractiveButton
                type="submit"
                className="w-full bg-gradient-to-r from-nature-forest to-nature-leaf hover:from-nature-leaf hover:to-nature-forest text-white font-medium py-3"
                disabled={formLoading}
                hapticType="medium"
              >
                {formLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                    <span>{isLogin ? 'Signing In...' : 'Creating Account...'}</span>
                  </div>
                ) : (
                  <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                )}
              </InteractiveButton>
            </form>
            
            <div className="text-center pt-4">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-nature-forest dark:text-nature-leaf hover:text-nature-leaf dark:hover:text-nature-forest font-medium underline transition-colors"
              >
                {isLogin 
                  ? "Don't have an account? Sign up" 
                  : "Already have an account? Sign in"
                }
              </button>
            </div>
          </AuthCard>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AuthEnhanced;
