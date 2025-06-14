
import { supabase } from "@/integrations/supabase/client";
import { FileUploadService } from "./fileUpload";

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  files?: File[];
}

export class ContactService {
  static async submitContactForm(formData: ContactFormData): Promise<{ success: boolean; error?: string }> {
    try {
      const fileAttachments: any[] = [];

      // Upload files if provided
      if (formData.files && formData.files.length > 0) {
        for (const file of formData.files) {
          const result = await this.uploadContactFile(file);
          if (result.success && result.url) {
            fileAttachments.push({
              filename: file.name,
              url: result.url,
              size: file.size,
              type: file.type
            });
          }
        }
      }

      // Submit contact form to database
      const { error } = await supabase
        .from('contact_submissions')
        .insert({
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
          file_attachments: fileAttachments
        });

      if (error) {
        console.error('Contact form submission error:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Contact service error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      };
    }
  }

  private static async uploadContactFile(file: File) {
    const bucketName = 'contact-files';
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}_${file.name}`;

    try {
      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('File upload error:', error);
        return { success: false, error: error.message };
      }

      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(fileName);

      return { success: true, url: publicUrl, path: fileName };
    } catch (error) {
      console.error('Upload service error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Upload failed' 
      };
    }
  }
}
