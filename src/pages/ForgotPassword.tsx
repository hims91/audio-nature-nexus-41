
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import UnifiedNavbar from '@/components/UnifiedNavbar';
import Footer from '@/components/Footer';
import { ArrowLeft } from 'lucide-react';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { toast } = useToast();
  const { sendPasswordResetEmail } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await sendPasswordResetEmail(email);

      if (error) {
        toast({
          title: "Error",
          description: error.message || "Failed to send password reset email.",
          variant: "destructive",
        });
      } else {
        setSent(true);
        toast({
          title: "Email sent successfully",
          description: "Please check your email for password reset instructions.",
        });
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
              <div className="flex items-center gap-3 mb-2">
                <Link 
                  to="/auth" 
                  className="text-nature-forest dark:text-nature-leaf hover:text-nature-leaf dark:hover:text-nature-forest transition-colors"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Link>
                <CardTitle className="text-2xl text-nature-forest dark:text-nature-leaf">
                  Reset Password
                </CardTitle>
              </div>
              <CardDescription>
                {sent 
                  ? "We've sent you a password reset link. Please check your email."
                  : "Enter your email address and we'll send you a link to reset your password."
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!sent ? (
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
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-nature-forest to-nature-leaf hover:from-nature-leaf hover:to-nature-forest text-white font-medium py-3"
                    disabled={loading}
                  >
                    {loading ? 'Sending...' : 'Send Reset Link'}
                  </Button>
                </form>
              ) : (
                <div className="text-center space-y-4">
                  <div className="text-green-600 dark:text-green-400">
                    ✓ Password reset email sent successfully
                  </div>
                  <Button 
                    onClick={() => setSent(false)}
                    variant="outline"
                    className="w-full"
                  >
                    Send another email
                  </Button>
                </div>
              )}
              
              <div className="mt-6 text-center">
                <Link
                  to="/auth"
                  className="text-nature-forest dark:text-nature-leaf hover:text-nature-leaf dark:hover:text-nature-forest font-medium underline transition-colors"
                >
                  Back to Sign In
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ForgotPassword;
