import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, UserPlus, AlertCircle, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const AdminUserManagement: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const { toast } = useToast();

  const promoteToAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setMessage({ type: 'error', text: 'Please enter an email address' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      console.log('🔄 Promoting user to admin:', email);
      
      // Since we can't use admin methods on client side, we'll try to find the user profile directly
      // This assumes the user already has a profile (they've signed up and logged in at least once)
      const { data: existingProfile, error: profileError } = await supabase
        .from('user_profiles')
        .select('user_id, role')
        .eq('user_id', (
          await supabase
            .from('user_profiles')
            .select('user_id')
            .limit(1000) // Get a reasonable number of profiles to search through
        ).data?.find(() => true)?.user_id || '') // This is a placeholder - we need a better approach
        .single();

      // Since we can't reliably find users by email on client side,
      // let's use a simpler approach: try to update by email directly if possible
      // or ask the user to provide the user ID instead

      setMessage({ 
        type: 'error', 
        text: 'Client-side user promotion is not supported. Please ask the user to contact an administrator directly.' 
      });

      toast({
        title: "Feature Not Available",
        description: "User promotion must be done server-side for security reasons",
        variant: "destructive",
      });

    } catch (error) {
      console.error('❌ Unexpected error:', error);
      setMessage({ 
        type: 'error', 
        text: 'An unexpected error occurred' 
      });
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Shield className="h-5 w-5 mr-2 text-nature-forest" />
          Admin Management
        </CardTitle>
        <CardDescription>
          Promote users to admin role. Only existing admins can perform this action.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={promoteToAdmin} className="space-y-4">
          <div>
            <Label htmlFor="email">User Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="user@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          {message && (
            <Alert className={message.type === 'error' ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'}>
              {message.type === 'error' ? (
                <AlertCircle className="h-4 w-4 text-red-600" />
              ) : (
                <CheckCircle className="h-4 w-4 text-green-600" />
              )}
              <AlertDescription className={message.type === 'error' ? 'text-red-800' : 'text-green-800'}>
                {message.text}
              </AlertDescription>
            </Alert>
          )}

          <Button 
            type="submit" 
            className="w-full" 
            disabled={true} // Temporarily disabled due to security limitations
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Promote to Admin (Coming Soon)
          </Button>
        </form>

        <div className="mt-6 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            <strong>Note:</strong> For security reasons, user promotion to admin must be done server-side. 
            This feature will be implemented with proper server-side functions in a future update.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminUserManagement;
