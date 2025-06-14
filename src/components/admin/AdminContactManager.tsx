
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { 
  Mail, 
  Search, 
  Filter, 
  User, 
  Calendar, 
  FileText,
  CheckCircle,
  Clock,
  AlertCircle
} from "lucide-react";
import FadeInView from "../animations/FadeInView";
import LoadingSpinner from "../animations/LoadingSpinner";

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  created_at: string;
  read_at?: string;
  replied_at?: string;
  file_attachments?: any[];
}

const AdminContactManager: React.FC = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null);
  const [replyMessage, setReplyMessage] = useState("");

  const { data: submissions = [], isLoading } = useQuery({
    queryKey: ['contact-submissions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contact_submissions')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as ContactSubmission[];
    }
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('contact_submissions')
        .update({ 
          read_at: new Date().toISOString(),
          status: 'read'
        })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contact-submissions'] });
      toast({
        title: "Marked as Read",
        description: "Contact submission has been marked as read."
      });
    }
  });

  const replyMutation = useMutation({
    mutationFn: async ({ id, message }: { id: string; message: string }) => {
      // In a real implementation, this would send an email
      const { error } = await supabase
        .from('contact_submissions')
        .update({ 
          replied_at: new Date().toISOString(),
          status: 'replied'
        })
        .eq('id', id);
      
      if (error) throw error;
      
      // Here you would integrate with an email service
      console.log('Reply sent:', { id, message });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contact-submissions'] });
      setSelectedSubmission(null);
      setReplyMessage("");
      toast({
        title: "Reply Sent",
        description: "Your reply has been sent successfully."
      });
    }
  });

  const filteredSubmissions = submissions.filter(submission => {
    const matchesSearch = 
      submission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.subject.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || submission.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new': return <AlertCircle className="h-4 w-4 text-blue-500" />;
      case 'read': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'replied': return <CheckCircle className="h-4 w-4 text-green-500" />;
      default: return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'read': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'replied': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <FadeInView direction="up">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Contact Management
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Manage and respond to contact submissions
            </p>
          </div>
          <Badge variant="outline" className="text-sm">
            {submissions.length} Total Submissions
          </Badge>
        </div>
      </FadeInView>

      {/* Filters */}
      <FadeInView direction="up" delay={0.1}>
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by name, email, or subject..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={statusFilter === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter("all")}
                >
                  All
                </Button>
                <Button
                  variant={statusFilter === "new" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter("new")}
                >
                  New
                </Button>
                <Button
                  variant={statusFilter === "read" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter("read")}
                >
                  Read
                </Button>
                <Button
                  variant={statusFilter === "replied" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter("replied")}
                >
                  Replied
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </FadeInView>

      {/* Submissions List */}
      <div className="grid gap-4">
        {filteredSubmissions.map((submission, index) => (
          <FadeInView key={submission.id} direction="up" delay={0.1 * index}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-500" />
                        <span className="font-medium text-gray-900 dark:text-white">
                          {submission.name}
                        </span>
                      </div>
                      <Badge className={getStatusColor(submission.status)}>
                        {getStatusIcon(submission.status)}
                        <span className="ml-1 capitalize">{submission.status}</span>
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
                      <div className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {submission.email}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(submission.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    
                    <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                      {submission.subject}
                    </h3>
                    
                    <p className="text-gray-600 dark:text-gray-400 line-clamp-2">
                      {submission.message}
                    </p>
                  </div>
                  
                  <div className="flex gap-2 ml-4">
                    {submission.status === 'new' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => markAsReadMutation.mutate(submission.id)}
                      >
                        Mark Read
                      </Button>
                    )}
                    <Button
                      size="sm"
                      onClick={() => setSelectedSubmission(submission)}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </FadeInView>
        ))}
      </div>

      {filteredSubmissions.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No submissions found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {searchTerm || statusFilter !== "all" 
                ? "Try adjusting your search or filter criteria." 
                : "No contact submissions have been received yet."}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Reply Modal would go here */}
      {selectedSubmission && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Contact Submission Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">From: {selectedSubmission.name}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">{selectedSubmission.email}</p>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Subject</h4>
                <p>{selectedSubmission.subject}</p>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Message</h4>
                <p className="whitespace-pre-wrap">{selectedSubmission.message}</p>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Reply</h4>
                <Textarea
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  placeholder="Type your reply here..."
                  rows={4}
                />
              </div>
              
              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  onClick={() => setSelectedSubmission(null)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => replyMutation.mutate({ 
                    id: selectedSubmission.id, 
                    message: replyMessage 
                  })}
                  disabled={!replyMessage.trim()}
                >
                  Send Reply
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AdminContactManager;
