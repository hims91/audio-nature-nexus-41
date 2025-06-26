
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import UnifiedNavbar from '@/components/UnifiedNavbar';
import Footer from '@/components/Footer';
import { Eye, EyeOff } from 'lucide-react';

const ResetPassword: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { resetPassword } = useAuth();

  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      toast({
        title: "Invalid reset link",
        description: "This password reset link is invalid or missing.",
        variant: "destructive",
      });
      navigate('/forgot-password');
    }
  }, [token, navigate, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure both passwords are the same.",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return;
    }

    if (!token) return;

    setLoading(true);

    try {
      const { error } = await resetPassword(token, password);

      if (error) {
        toast({
          title: "Error updating password",
          description: error.message || "Failed to update password. The reset link may be invalid or expired.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Password updated successfully",
          description: "Your password has been updated. You can now sign in with your new password.",
        });
        navigate('/auth');
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

  if (!token) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-nature-cream/30 via-white to-nature-sage/20 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <UnifiedNavbar />
      
      <main className="flex-grow py-16 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <Card className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-white/20 dark:border-gray-800/50 shadow-2xl">
            <CardHeader>
              <CardTitle className="text-2xl text-center text-nature-forest dark:text-nature-leaf">
                Set New Password
              </CardTitle>
              <CardDescription className="text-center">
                Enter your new password below
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    New Password
                  </Label>
                  <div className="relative mt-1">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="Enter your new password"
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
                
                <div>
                  <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Confirm New Password
                  </Label>
                  <div className="relative mt-1">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      placeholder="Confirm your new password"
                      className="pr-10 bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 focus:border-nature-forest dark:focus:border-nature-leaf"
                      minLength={6}
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

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-nature-forest to-nature-leaf hover:from-nature-leaf hover:to-nature-forest text-white font-medium py-3"
                  disabled={loading}
                >
                  {loading ? 'Updating...' : 'Update Password'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ResetPassword;
