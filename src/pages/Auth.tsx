
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import UnifiedNavbar from '@/components/UnifiedNavbar';
import Footer from '@/components/Footer';
import SocialButton from '@/components/auth/SocialButton';
import FormDivider from '@/components/auth/FormDivider';
import { Eye, EyeOff } from 'lucide-react';

const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signIn, signUp, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleGoogleLogin = async () => {
    try {
      const { supabase } = await import('@/integrations/supabase/client');
      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl
        },
      });

      if (error) {
        toast({
          title: "Gmail Sign In Error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Redirecting...",
          description: "Redirecting to Gmail for authentication.",
        });
      }
    } catch (error: any) {
      toast({
        title: "Gmail Sign In Error",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let result;
      if (isLogin) {
        result = await signIn(email, password);
      } else {
        if (!firstName.trim() || !lastName.trim()) {
          toast({
            title: "Missing Information",
            description: "Please enter both first and last name.",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }
        result = await signUp(email, password, firstName.trim(), lastName.trim());
      }

      if (result.error) {
        toast({
          title: "Authentication Error",
          description: result.error.message,
          variant: "destructive",
        });
      } else {
        if (isLogin) {
          toast({
            title: "Welcome back!",
            description: "You have been successfully signed in.",
          });
          navigate('/');
        } else {
          toast({
            title: "Account created successfully!",
            description: "Please check your email to verify your account. A welcome email has been sent.",
          });
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-nature-cream/30 via-white to-nature-sage/20 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <UnifiedNavbar />
      
      <main className="flex-grow py-16 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <Card className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-white/20 dark:border-gray-800/50 shadow-2xl">
            <CardHeader>
              <CardTitle className="text-2xl text-center text-nature-forest dark:text-nature-leaf">
                {isLogin ? 'Sign In' : 'Create Account'}
              </CardTitle>
              <CardDescription className="text-center">
                {isLogin 
                  ? 'Sign in to access your account' 
                  : 'Create your Terra Echo Studios account'
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Gmail Login Button */}
              <SocialButton
                provider="google"
                onClick={handleGoogleLogin}
              />
              
              <FormDivider />
              
              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        First Name
                      </Label>
                      <Input
                        id="firstName"
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required={!isLogin}
                        placeholder="John"
                        className="mt-1 bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 focus:border-nature-forest dark:focus:border-nature-leaf"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Last Name
                      </Label>
                      <Input
                        id="lastName"
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required={!isLogin}
                        placeholder="Doe"
                        className="mt-1 bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 focus:border-nature-forest dark:focus:border-nature-leaf"
                      />
                    </div>
                  </div>
                )}
                
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
                    placeholder="Enter your email"
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
                      minLength={6}
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
                
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-nature-forest to-nature-leaf hover:from-nature-leaf hover:to-nature-forest text-white font-medium py-3"
                  disabled={loading}
                >
                  {loading ? 'Loading...' : (isLogin ? 'Sign In' : 'Create Account')}
                </Button>
              </form>
              
              {isLogin && (
                <div className="text-center">
                  <Link
                    to="/forgot-password"
                    className="text-nature-forest dark:text-nature-leaf hover:text-nature-leaf dark:hover:text-nature-forest text-sm underline"
                  >
                    Forgot your password?
                  </Link>
                </div>
              )}
              
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-nature-forest dark:text-nature-leaf hover:text-nature-leaf dark:hover:text-nature-forest underline"
                >
                  {isLogin 
                    ? "Don't have an account? Create one" 
                    : "Already have an account? Sign in"
                  }
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Auth;
