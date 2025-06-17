
import { supabase } from "@/integrations/supabase/client";

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  fileAttachments?: File[];
}

export interface ContactSubmissionResult {
  success: boolean;
  error?: string;
  submissionId?: string;
}

export const submitContactForm = async (formData: ContactFormData): Promise<ContactSubmissionResult> => {
  try {
    console.log('📧 Submitting contact form:', formData.subject);
    
    // Handle file uploads if any
    let fileAttachments: Array<{filename: string; url: string; type: string}> = [];
    
    if (formData.fileAttachments && formData.fileAttachments.length > 0) {
      console.log('📎 Processing file attachments:', formData.fileAttachments.length);
      
      for (const file of formData.fileAttachments) {
        const fileName = `${Date.now()}_${file.name}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('contact-files')
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false
          });
        
        if (uploadError) {
          console.error('❌ File upload error:', uploadError);
          throw new Error(`Failed to upload file ${file.name}: ${uploadError.message}`);
        }
        
        const { data: { publicUrl } } = supabase.storage
          .from('contact-files')
          .getPublicUrl(fileName);
        
        fileAttachments.push({
          filename: file.name,
          url: publicUrl,
          type: file.type
        });
      }
    }
    
    // Store the contact submission in the database
    const { data: submission, error: dbError } = await supabase
      .from('contact_submissions')
      .insert({
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
        file_attachments: fileAttachments,
        status: 'new'
      })
      .select()
      .single();

    if (dbError) {
      console.error('❌ Database error:', dbError);
      throw new Error(`Failed to save contact submission: ${dbError.message}`);
    }

    console.log('✅ Contact submission saved:', submission.id);

    // Send email notification using edge function
    const { data: emailResult, error: emailError } = await supabase.functions.invoke('send-contact-email', {
      body: {
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
        fileAttachments: fileAttachments
      }
    });

    if (emailError) {
      console.error('❌ Email sending error:', emailError);
      // Don't fail the entire submission if email fails
      console.warn('⚠️ Contact form saved but email notification failed');
    } else {
      console.log('✅ Contact emails sent successfully');
    }

    return {
      success: true,
      submissionId: submission.id
    };

  } catch (error) {
    console.error('❌ Contact form submission error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred'
    };
  }
};
