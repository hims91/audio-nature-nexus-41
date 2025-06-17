
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ContactEmailRequest {
  name: string;
  email: string;
  subject: string;
  message: string;
  fileAttachments?: Array<{
    filename: string;
    url: string;
    type: string;
  }>;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, subject, message, fileAttachments }: ContactEmailRequest = await req.json();

    // Send notification email to admin
    const adminEmailResponse = await resend.emails.send({
      from: "Terra Echo Studios <noreply@terraechostudios.com>",
      to: ["TerraEchoStudios@gmail.com"],
      subject: `New Contact Form Submission: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #10b981; border-bottom: 2px solid #10b981; padding-bottom: 10px;">
            New Contact Form Submission
          </h2>
          
          <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #374151; margin-top: 0;">Contact Details</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject}</p>
          </div>
          
          <div style="background-color: #ffffff; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #374151; margin-top: 0;">Message</h3>
            <p style="white-space: pre-wrap; line-height: 1.6;">${message}</p>
          </div>
          
          ${fileAttachments && fileAttachments.length > 0 ? `
            <div style="background-color: #fef3c7; padding: 20px; border: 1px solid #f59e0b; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #92400e; margin-top: 0;">File Attachments</h3>
              <ul style="margin: 0; padding-left: 20px;">
                ${fileAttachments.map(file => `
                  <li style="margin: 5px 0;">
                    <strong>${file.filename}</strong> (${file.type})
                    <br><a href="${file.url}" style="color: #059669; text-decoration: none;">Download File</a>
                  </li>
                `).join('')}
              </ul>
            </div>
          ` : ''}
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">
            <p>This email was sent from the Terra Echo Studios contact form.</p>
            <p>Reply directly to this email to respond to ${name} at ${email}</p>
          </div>
        </div>
      `,
      replyTo: email, // Allow direct reply to the sender
    });

    // Send confirmation email to the user
    const userEmailResponse = await resend.emails.send({
      from: "Terra Echo Studios <noreply@terraechostudios.com>",
      to: [email],
      subject: "Thank you for contacting Terra Echo Studios",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #10b981; border-bottom: 2px solid #10b981; padding-bottom: 10px;">
            Thank you for reaching out!
          </h2>
          
          <p>Hi ${name},</p>
          
          <p>Thank you for contacting Terra Echo Studios. We've received your message and will get back to you as soon as possible.</p>
          
          <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #374151; margin-top: 0;">Your Message Summary</h3>
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Message:</strong></p>
            <p style="white-space: pre-wrap; line-height: 1.6; font-style: italic; color: #6b7280;">${message.substring(0, 200)}${message.length > 200 ? '...' : ''}</p>
          </div>
          
          <p>We typically respond within 24-48 hours during business days.</p>
          
          <div style="margin-top: 30px; padding: 20px; background-color: #ecfdf5; border-radius: 8px;">
            <h3 style="color: #065f46; margin-top: 0;">About Terra Echo Studios</h3>
            <p style="color: #047857; margin-bottom: 0;">
              Professional audio engineering services specializing in mixing, mastering, 
              sound design, and post-production. We're passionate about bringing your 
              creative vision to life with exceptional sound quality.
            </p>
          </div>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px; text-align: center;">
            <p>Terra Echo Studios | Professional Audio Engineering</p>
            <p>TerraEchoStudios@gmail.com</p>
          </div>
        </div>
      `,
    });

    console.log("Admin email sent:", adminEmailResponse);
    console.log("User confirmation email sent:", userEmailResponse);

    return new Response(
      JSON.stringify({ 
        success: true, 
        adminEmail: adminEmailResponse,
        userEmail: userEmailResponse
      }), 
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("Error in send-contact-email function:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
