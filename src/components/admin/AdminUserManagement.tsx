
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
      
      // First, get the user ID from the email
      const { data: userData, error: userError } = await supabase
        .from('user_profiles')
        .select('user_id, role')
        .eq('user_id', (
          await supabase.auth.admin.listUsers()
        ).data.users.find(u => u.email === email.trim())?.id || '')
        .single();

      if (userError || !userData) {
        // Try a different approach - check if user exists by querying auth users
        const { data: authUsers } = await supabase.auth.admin.listUsers();
        const targetUser = authUsers.users.find(u => u.email === email.trim());
        
        if (!targetUser) {
          setMessage({ 
            type: 'error', 
            text: `User with email ${email} not found. Make sure they have signed up first.` 
          });
          toast({
            title: "User Not Found",
            description: `User with email ${email} not found`,
            variant: "destructive",
          });
          return;
        }

        // Update user role directly
        const { error: updateError } = await supabase
          .from('user_profiles')
          .update({ 
            role: 'admin',
            updated_at: new Date().toISOString()
          })
          .eq('user_id', targetUser.id);

        if (updateError) {
          console.error('❌ Error promoting user:', updateError);
          setMessage({ 
            type: 'error', 
            text: updateError.message || 'Failed to promote user to admin' 
          });
          toast({
            title: "Error",
            description: updateError.message || "Failed to promote user to admin",
            variant: "destructive",
          });
        } else {
          console.log('✅ User promoted successfully');
          setMessage({ 
            type: 'success', 
            text: `Successfully promoted ${email} to admin` 
          });
          setEmail('');
          toast({
            title: "Success",
            description: `${email} has been promoted to admin`,
          });
        }
      } else {
        // User exists, update their role
        const { error: updateError } = await supabase
          .from('user_profiles')
          .update({ 
            role: 'admin',
            updated_at: new Date().toISOString()
          })
          .eq('user_id', userData.user_id);

        if (updateError) {
          console.error('❌ Error promoting user:', updateError);
          setMessage({ 
            type: 'error', 
            text: updateError.message || 'Failed to promote user to admin' 
          });
          toast({
            title: "Error",
            description: updateError.message || "Failed to promote user to admin",
            variant: "destructive",
          });
        } else {
          console.log('✅ User promoted successfully');
          setMessage({ 
            type: 'success', 
            text: `Successfully promoted ${email} to admin` 
          });
          setEmail('');
          toast({
            title: "Success",
            description: `${email} has been promoted to admin`,
          });
        }
      }
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
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Promoting...
              </>
            ) : (
              <>
                <UserPlus className="h-4 w-4 mr-2" />
                Promote to Admin
              </>
            )}
          </Button>
        </form>

        <div className="mt-6 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            <strong>Note:</strong> The user must have an existing account before they can be promoted to admin.
            Admin users can access the admin panel and manage portfolio items.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminUserManagement;
