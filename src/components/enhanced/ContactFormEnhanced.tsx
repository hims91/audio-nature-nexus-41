import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, X, FileText, Send, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { submitContactForm } from "@/services/contactService";

const ContactFormEnhanced: React.FC = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const newFiles = Array.from(e.dataTransfer.files);
      setFiles(prev => [...prev, ...newFiles].slice(0, 5)); // Max 5 files
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...newFiles].slice(0, 5)); // Max 5 files
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await submitContactForm({
        ...formData,
        fileAttachments: files
      });

      if (result.success) {
        toast({
          title: "Message Sent Successfully!",
          description: "Thank you for your message. I'll get back to you soon.",
        });
        
        // Reset form
        setFormData({ name: "", email: "", subject: "", message: "" });
        setFiles([]);
      } else {
        throw new Error(result.error || "Failed to send message");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send message",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Card className="max-w-2xl mx-auto shadow-xl border-0 bg-gradient-to-br from-white to-nature-mist">
      <CardHeader className="text-center pb-6">
        <CardTitle className="text-2xl font-bold text-nature-forest">Get In Touch</CardTitle>
        <p className="text-nature-bark">Let's discuss your next audio project</p>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name" className="text-nature-forest font-medium">Name *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="mt-1 border-nature-sage focus:border-nature-forest"
              />
            </div>
            <div>
              <Label htmlFor="email" className="text-nature-forest font-medium">Email *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="mt-1 border-nature-sage focus:border-nature-forest"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="subject" className="text-nature-forest font-medium">Subject *</Label>
            <Input
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
              required
              className="mt-1 border-nature-sage focus:border-nature-forest"
            />
          </div>

          <div>
            <Label htmlFor="message" className="text-nature-forest font-medium">Message *</Label>
            <Textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              rows={6}
              required
              className="mt-1 border-nature-sage focus:border-nature-forest resize-none"
              placeholder="Tell me about your project, timeline, and any specific requirements..."
            />
          </div>

          {/* File Upload Area */}
          <div>
            <Label className="text-nature-forest font-medium">Attach Files (Optional)</Label>
            <p className="text-sm text-nature-bark mb-3">Share audio/video references or project files (max 5 files, 25MB each)</p>
            
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                dragActive 
                  ? 'border-nature-forest bg-nature-mist' 
                  : 'border-nature-sage hover:border-nature-forest hover:bg-nature-mist/50'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Upload className="mx-auto h-12 w-12 text-nature-sage mb-4" />
              <p className="text-nature-forest font-medium mb-2">
                Drag and drop files here, or click to select
              </p>
              <p className="text-sm text-nature-bark mb-4">
                Supports: Audio (MP3, WAV), Video (MP4), Images (JPG, PNG), Documents (PDF)
              </p>
              <input
                type="file"
                multiple
                onChange={handleFileSelect}
                className="hidden"
                id="file-upload"
                accept="audio/*,video/*,image/*,.pdf"
              />
              <Label htmlFor="file-upload" className="cursor-pointer">
                <Button type="button" variant="outline" className="pointer-events-none">
                  Select Files
                </Button>
              </Label>
            </div>

            {/* File List */}
            {files.length > 0 && (
              <div className="mt-4 space-y-2">
                {files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-nature-mist rounded-lg">
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 text-nature-forest mr-3" />
                      <div>
                        <p className="text-sm font-medium text-nature-forest">{file.name}</p>
                        <p className="text-xs text-nature-bark">{formatFileSize(file.size)}</p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-nature-forest hover:bg-nature-leaf text-white font-medium py-3 rounded-lg transition-all duration-200 transform hover:scale-[1.02]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Sending Message...
              </>
            ) : (
              <>
                <Send className="mr-2 h-5 w-5" />
                Send Message
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ContactFormEnhanced;
