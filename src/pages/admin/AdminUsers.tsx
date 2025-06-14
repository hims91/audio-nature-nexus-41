
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Users, 
  Search, 
  Shield, 
  User, 
  Calendar, 
  Mail,
  RefreshCw,
  Crown,
  UserCheck
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useEnhancedAuth } from '@/contexts/EnhancedAuthContext';
import LoadingSpinner from '@/components/animations/LoadingSpinner';
import { useAdminMonitoring } from '@/hooks/useAdminMonitoring';

interface UserProfile {
  id: string;
  user_id: string;
  role: string;
  first_name?: string;
  last_name?: string;
  username?: string;
  created_at: string;
  updated_at: string;
  onboarding_completed: boolean;
}

const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { isAdmin } = useEnhancedAuth();
  const { toast } = useToast();
  const { trackPageView, logAdminAction } = useAdminMonitoring();

  useEffect(() => {
    trackPageView('admin_users');
  }, [trackPageView]);

  const fetchUsers = async () => {
    if (!isAdmin) return;
    
    try {
      console.log('👥 Fetching user profiles...');
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      console.log('✅ User profiles fetched:', data?.length || 0);
      setUsers(data || []);
      setError(null);
    } catch (error: any) {
      console.error('❌ Error fetching users:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      console.log('🔄 Updating user role:', userId, newRole);
      
      const { error } = await supabase
        .from('user_profiles')
        .update({ role: newRole })
        .eq('user_id', userId);

      if (error) throw error;

      // Update local state
      setUsers(prev => 
        prev.map(user => 
          user.user_id === userId 
            ? { ...user, role: newRole }
            : user
        )
      );

      logAdminAction('user_role_update', 'user', userId, { 
        new_role: newRole,
        timestamp: new Date().toISOString()
      });

      toast({
        title: "Success",
        description: `User role updated to ${newRole}.`,
      });
    } catch (error: any) {
      console.error('❌ Error updating user role:', error);
      toast({
        title: "Error",
        description: "Failed to update user role.",
        variant: "destructive",
      });
    }
  };

  // Set up real-time subscription
  useEffect(() => {
    if (!isAdmin) return;

    fetchUsers();

    console.log('🔄 Setting up real-time subscription for user profiles...');
    const channel = supabase
      .channel('user_profiles_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_profiles'
        },
        (payload) => {
          console.log('👥 Real-time user profile change:', payload);
          
          if (payload.eventType === 'INSERT') {
            const newUser = payload.new as UserProfile;
            setUsers(prev => [newUser, ...prev]);
            
            toast({
              title: "New User Registered",
              description: `${newUser.username || 'New user'} has joined.`,
            });
          } else if (payload.eventType === 'UPDATE') {
            const updatedUser = payload.new as UserProfile;
            setUsers(prev => 
              prev.map(user => 
                user.id === updatedUser.id ? updatedUser : user
              )
            );
          } else if (payload.eventType === 'DELETE') {
            const deletedId = payload.old.id;
            setUsers(prev => prev.filter(user => user.id !== deletedId));
          }
        }
      )
      .subscribe();

    return () => {
      console.log('🔄 Cleaning up user profiles subscription...');
      supabase.removeChannel(channel);
    };
  }, [isAdmin, toast]);

  const filteredUsers = users.filter(user => {
    const searchLower = searchTerm.toLowerCase();
    return (
      user.first_name?.toLowerCase().includes(searchLower) ||
      user.last_name?.toLowerCase().includes(searchLower) ||
      user.username?.toLowerCase().includes(searchLower) ||
      user.role.toLowerCase().includes(searchLower)
    );
  });

  const getRoleBadge = (role: string) => {
    const variants = {
      'admin': 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300',
      'user': 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300'
    };
    
    return (
      <Badge className={variants[role as keyof typeof variants] || variants.user}>
        {role === 'admin' ? <Crown className="h-3 w-3 mr-1" /> : <User className="h-3 w-3 mr-1" />}
        {role}
      </Badge>
    );
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-nature-forest dark:text-white">
            User Management
          </h1>
          <p className="text-nature-bark dark:text-gray-300 mt-2">
            Manage user accounts and permissions
          </p>
        </div>
        <Button 
          variant="outline" 
          onClick={fetchUsers}
          disabled={loading}
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Search Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search users by name, username, or role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Users List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2 text-nature-forest" />
            All Users ({filteredUsers.length})
          </CardTitle>
          <CardDescription>
            Manage user roles and view account information
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <LoadingSpinner size="md" />
            </div>
          ) : error ? (
            <Alert className="border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-800">
              <AlertDescription className="text-red-800 dark:text-red-200">
                <strong>Error loading users:</strong> {error}
              </AlertDescription>
            </Alert>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                {searchTerm ? 'No users found matching your search.' : 'No users found.'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredUsers.map((user) => (
                <div 
                  key={user.id}
                  className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-nature-forest rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">
                          {(user.first_name?.[0] || user.username?.[0] || 'U').toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium text-gray-900 dark:text-gray-100">
                            {user.first_name && user.last_name 
                              ? `${user.first_name} ${user.last_name}`
                              : user.username || 'Unknown User'
                            }
                          </h4>
                          {getRoleBadge(user.role)}
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                          <span>@{user.username || 'no-username'}</span>
                          <div className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            Joined {new Date(user.created_at).toLocaleDateString()}
                          </div>
                          {user.onboarding_completed && (
                            <div className="flex items-center text-green-600">
                              <UserCheck className="h-3 w-3 mr-1" />
                              Verified
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      {user.role !== 'admin' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateUserRole(user.user_id, 'admin')}
                          className="text-xs"
                        >
                          <Shield className="h-3 w-3 mr-1" />
                          Make Admin
                        </Button>
                      )}
                      {user.role === 'admin' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateUserRole(user.user_id, 'user')}
                          className="text-xs"
                        >
                          <User className="h-3 w-3 mr-1" />
                          Remove Admin
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminUsers;
