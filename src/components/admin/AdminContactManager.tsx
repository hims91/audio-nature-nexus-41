import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Mail, 
  Calendar, 
  User, 
  MessageSquare, 
  CheckCircle, 
  Clock,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useEnhancedAuth } from '@/contexts/EnhancedAuthContext';
import LoadingSpinner from '@/components/animations/LoadingSpinner';

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'replied' | 'closed';
  created_at: string;
  read_at?: string;
  replied_at?: string;
  file_attachments?: any[];
}

const AdminContactManager: React.FC = () => {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAdmin } = useEnhancedAuth();
  const { toast } = useToast();

  const fetchSubmissions = async () => {
    if (!isAdmin) return;
    
    try {
      console.log('📧 Fetching contact submissions...');
      const { data, error } = await supabase
        .from('contact_submissions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        throw error;
      }

      console.log('✅ Contact submissions fetched:', data?.length || 0);
      // Type cast the status field to ensure TypeScript compatibility
      const typedSubmissions = data?.map(submission => ({
        ...submission,
        status: submission.status as 'new' | 'read' | 'replied' | 'closed'
      })) || [];
      
      setSubmissions(typedSubmissions);
      setError(null);
    } catch (error: any) {
      console.error('❌ Error fetching contact submissions:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      const { error } = await supabase
        .from('contact_submissions')
        .update({ 
          status: 'read', 
          read_at: new Date().toISOString() 
        })
        .eq('id', id);

      if (error) throw error;

      // Update local state
      setSubmissions(prev => 
        prev.map(sub => 
          sub.id === id 
            ? { ...sub, status: 'read' as const, read_at: new Date().toISOString() }
            : sub
        )
      );

      toast({
        title: "Success",
        description: "Contact submission marked as read.",
      });
    } catch (error: any) {
      console.error('Error marking as read:', error);
      toast({
        title: "Error",
        description: "Failed to update submission status.",
        variant: "destructive",
      });
    }
  };

  const markAsReplied = async (id: string) => {
    try {
      const { error } = await supabase
        .from('contact_submissions')
        .update({ 
          status: 'replied', 
          replied_at: new Date().toISOString() 
        })
        .eq('id', id);

      if (error) throw error;

      // Update local state
      setSubmissions(prev => 
        prev.map(sub => 
          sub.id === id 
            ? { ...sub, status: 'replied' as const, replied_at: new Date().toISOString() }
            : sub
        )
      );

      toast({
        title: "Success",
        description: "Contact submission marked as replied.",
      });
    } catch (error: any) {
      console.error('Error marking as replied:', error);
      toast({
        title: "Error",
        description: "Failed to update submission status.",
        variant: "destructive",
      });
    }
  };

  // Set up real-time subscription
  useEffect(() => {
    if (!isAdmin) return;

    fetchSubmissions();

    // Subscribe to real-time changes
    console.log('🔄 Setting up real-time subscription for contact submissions...');
    const channel = supabase
      .channel('contact_submissions_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'contact_submissions'
        },
        (payload) => {
          console.log('📧 Real-time contact submission change:', payload);
          
          if (payload.eventType === 'INSERT') {
            const newSubmission = {
              ...payload.new,
              status: payload.new.status as 'new' | 'read' | 'replied' | 'closed'
            } as ContactSubmission;
            setSubmissions(prev => [newSubmission, ...prev.slice(0, 9)]); // Keep latest 10
            
            toast({
              title: "New Contact Submission",
              description: `From ${newSubmission.name}: ${newSubmission.subject}`,
            });
          } else if (payload.eventType === 'UPDATE') {
            const updatedSubmission = {
              ...payload.new,
              status: payload.new.status as 'new' | 'read' | 'replied' | 'closed'
            } as ContactSubmission;
            setSubmissions(prev => 
              prev.map(sub => 
                sub.id === updatedSubmission.id ? updatedSubmission : sub
              )
            );
          } else if (payload.eventType === 'DELETE') {
            const deletedId = payload.old.id;
            setSubmissions(prev => prev.filter(sub => sub.id !== deletedId));
          }
        }
      )
      .subscribe();

    return () => {
      console.log('🔄 Cleaning up contact submissions subscription...');
      supabase.removeChannel(channel);
    };
  }, [isAdmin, toast]);

  if (!isAdmin) {
    return null;
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      'new': 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
      'read': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300',
      'replied': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
      'closed': 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300'
    };
    
    return (
      <Badge className={variants[status as keyof typeof variants] || variants.new}>
        {status}
      </Badge>
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center">
              <Mail className="h-5 w-5 mr-2 text-nature-forest" />
              Contact Submissions
            </CardTitle>
            <CardDescription>
              Recent contact form submissions and inquiries
            </CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={fetchSubmissions}
            disabled={loading}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <LoadingSpinner size="md" />
          </div>
        ) : error ? (
          <Alert className="border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-800">
            <AlertDescription className="text-red-800 dark:text-red-200">
              <strong>Error loading submissions:</strong> {error}
            </AlertDescription>
          </Alert>
        ) : submissions.length === 0 ? (
          <div className="text-center py-8">
            <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              No contact submissions yet. When users submit the contact form, they'll appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {submissions.map((submission) => (
              <div 
                key={submission.id}
                className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">{submission.name}</span>
                    <span className="text-gray-500 text-sm">({submission.email})</span>
                  </div>
                  {getStatusBadge(submission.status)}
                </div>
                
                <div className="mb-3">
                  <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-1">
                    {submission.subject}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
                    {submission.message}
                  </p>
                </div>
                
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {new Date(submission.created_at).toLocaleDateString()}
                    </div>
                    {submission.file_attachments && submission.file_attachments.length > 0 && (
                      <div className="flex items-center">
                        <ExternalLink className="h-3 w-3 mr-1" />
                        {submission.file_attachments.length} file(s)
                      </div>
                    )}
                  </div>
                  
                  <div className="flex space-x-2">
                    {submission.status === 'new' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => markAsRead(submission.id)}
                        className="text-xs h-6"
                      >
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Mark Read
                      </Button>
                    )}
                    {submission.status === 'read' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => markAsReplied(submission.id)}
                        className="text-xs h-6"
                      >
                        <MessageSquare className="h-3 w-3 mr-1" />
                        Mark Replied
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.open(`mailto:${submission.email}?subject=Re: ${submission.subject}`, '_blank')}
                      className="text-xs h-6"
                    >
                      <Mail className="h-3 w-3 mr-1" />
                      Reply
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminContactManager;
