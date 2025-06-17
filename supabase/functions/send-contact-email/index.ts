
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

    console.log(`📧 Processing contact form from ${name} (${email}): ${subject}`);

    // Enhanced email template for admin notification
    const adminEmailHtml = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 700px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px 40px; color: white; text-align: center;">
          <h1 style="margin: 0; font-size: 28px; font-weight: 600; letter-spacing: -0.5px;">
            🎵 New Contact Form Submission
          </h1>
          <p style="margin: 8px 0 0 0; font-size: 16px; opacity: 0.9;">
            Terra Echo Studios
          </p>
        </div>
        
        <!-- Content -->
        <div style="padding: 40px;">
          
          <!-- Contact Details Card -->
          <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
            <h2 style="color: #1e293b; margin: 0 0 16px 0; font-size: 18px; font-weight: 600; border-bottom: 2px solid #10b981; padding-bottom: 8px; display: inline-block;">
              📋 Contact Information
            </h2>
            <div style="display: grid; gap: 12px;">
              <div style="display: flex; align-items: center;">
                <span style="font-weight: 600; color: #475569; min-width: 80px;">👤 Name:</span>
                <span style="color: #1e293b; font-size: 16px;">${name}</span>
              </div>
              <div style="display: flex; align-items: center;">
                <span style="font-weight: 600; color: #475569; min-width: 80px;">📧 Email:</span>
                <a href="mailto:${email}" style="color: #10b981; text-decoration: none; font-size: 16px;">${email}</a>
              </div>
              <div style="display: flex; align-items: center;">
                <span style="font-weight: 600; color: #475569; min-width: 80px;">📌 Subject:</span>
                <span style="color: #1e293b; font-size: 16px; font-weight: 500;">${subject}</span>
              </div>
              <div style="display: flex; align-items: center;">
                <span style="font-weight: 600; color: #475569; min-width: 80px;">🕒 Time:</span>
                <span style="color: #64748b; font-size: 14px;">${new Date().toLocaleString('en-US', { 
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  timeZoneName: 'short'
                })}</span>
              </div>
            </div>
          </div>
          
          <!-- Message Card -->
          <div style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 24px; margin-bottom: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
            <h2 style="color: #1e293b; margin: 0 0 16px 0; font-size: 18px; font-weight: 600; border-bottom: 2px solid #10b981; padding-bottom: 8px; display: inline-block;">
              💬 Message Content
            </h2>
            <div style="background-color: #f1f5f9; padding: 20px; border-radius: 6px; border-left: 4px solid #10b981;">
              <p style="white-space: pre-wrap; line-height: 1.6; margin: 0; color: #334155; font-size: 15px;">${message}</p>
            </div>
          </div>
          
          ${fileAttachments && fileAttachments.length > 0 ? `
            <!-- File Attachments -->
            <div style="background-color: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
              <h2 style="color: #92400e; margin: 0 0 16px 0; font-size: 18px; font-weight: 600; border-bottom: 2px solid #f59e0b; padding-bottom: 8px; display: inline-block;">
                📎 File Attachments (${fileAttachments.length})
              </h2>
              <div style="display: grid; gap: 12px;">
                ${fileAttachments.map(file => `
                  <div style="background-color: #ffffff; padding: 16px; border-radius: 6px; border: 1px solid #f3c744; display: flex; align-items: center; justify-content: space-between;">
                    <div style="display: flex; align-items: center;">
                      <span style="font-size: 20px; margin-right: 12px;">
                        ${file.type.startsWith('image/') ? '🖼️' : 
                          file.type.startsWith('audio/') ? '🎵' : 
                          file.type.startsWith('video/') ? '🎬' : 
                          file.type === 'application/pdf' ? '📄' : '📎'}
                      </span>
                      <div>
                        <div style="font-weight: 600; color: #92400e; font-size: 14px;">${file.filename}</div>
                        <div style="color: #a16207; font-size: 12px;">${file.type}</div>
                      </div>
                    </div>
                    <a href="${file.url}" style="background-color: #f59e0b; color: white; padding: 8px 16px; border-radius: 4px; text-decoration: none; font-size: 12px; font-weight: 600; transition: all 0.2s;">
                      Download ⬇️
                    </a>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}
          
          <!-- Quick Actions -->
          <div style="background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); border-radius: 8px; padding: 24px; text-align: center;">
            <h3 style="color: #1e293b; margin: 0 0 16px 0; font-size: 16px; font-weight: 600;">
              🚀 Quick Actions
            </h3>
            <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
              <a href="mailto:${email}?subject=Re: ${encodeURIComponent(subject)}&body=Hello ${encodeURIComponent(name)},%0A%0AThank you for contacting Terra Echo Studios!%0A%0AI received your message about "${encodeURIComponent(subject)}" and I'm excited to help with your project.%0A%0APlease let me know:%0A- Your project timeline%0A- Budget range%0A- Any specific requirements%0A%0ALooking forward to working together!%0A%0ABest regards,%0A[Your Name]%0ATerra Echo Studios%0A%0A---Original Message---%0A${encodeURIComponent(message)}" 
                 style="background-color: #10b981; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 14px; transition: all 0.2s;">
                📧 Reply to ${name}
              </a>
            </div>
          </div>
        </div>
        
        <!-- Footer -->
        <div style="background-color: #f1f5f9; padding: 20px 40px; text-align: center; color: #64748b; font-size: 12px; border-top: 1px solid #e2e8f0;">
          <p style="margin: 0 0 8px 0;">
            📨 This email was automatically generated from your Terra Echo Studios contact form
          </p>
          <p style="margin: 0;">
            🔗 Visit: <a href="https://terraechostudios.com" style="color: #10b981; text-decoration: none;">terraechostudios.com</a> | 
            📧 Admin: <a href="mailto:terraechostudios@gmail.com" style="color: #10b981; text-decoration: none;">terraechostudios@gmail.com</a>
          </p>
        </div>
      </div>
    `;

    // Send notification email to admin with corrected email address
    const adminEmailResponse = await resend.emails.send({
      from: "Terra Echo Studios Contact <noreply@terraechostudios.com>",
      to: ["terraechostudios@gmail.com"], // Fixed: using lowercase as requested
      subject: `🎵 New Contact Form: ${subject} - from ${name}`,
      html: adminEmailHtml,
      replyTo: email,
      headers: {
        'X-Priority': '1',
        'X-MSMail-Priority': 'High',
        'Importance': 'high'
      }
    });

    console.log("✅ Admin notification email sent to terraechostudios@gmail.com:", adminEmailResponse.id);

    // Enhanced confirmation email for user
    const userConfirmationHtml = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; color: white; text-align: center;">
          <h1 style="margin: 0; font-size: 24px; font-weight: 600;">
            🎵 Thank You, ${name}!
          </h1>
          <p style="margin: 12px 0 0 0; font-size: 16px; opacity: 0.9;">
            Your message has been received
          </p>
        </div>
        
        <!-- Content -->
        <div style="padding: 30px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <div style="background-color: #10b981; width: 60px; height: 60px; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; font-size: 24px;">
              ✅
            </div>
            <h2 style="color: #1e293b; margin: 0 0 12px 0; font-size: 20px;">
              Message Successfully Sent!
            </h2>
            <p style="color: #64748b; margin: 0; font-size: 16px; line-height: 1.5;">
              Thank you for reaching out to Terra Echo Studios. We've received your inquiry and will get back to you as soon as possible.
            </p>
          </div>
          
          <!-- Message Summary -->
          <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
            <h3 style="color: #374151; margin: 0 0 12px 0; font-size: 16px; font-weight: 600;">
              📋 Your Message Summary
            </h3>
            <div style="margin-bottom: 12px;">
              <strong style="color: #475569;">Subject:</strong> ${subject}
            </div>
            <div style="margin-bottom: 12px;">
              <strong style="color: #475569;">Submitted:</strong> ${new Date().toLocaleDateString('en-US', { 
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
            ${fileAttachments && fileAttachments.length > 0 ? `
              <div>
                <strong style="color: #475569;">Attachments:</strong> ${fileAttachments.length} file(s) included
              </div>
            ` : ''}
            <div style="margin-top: 16px; padding: 16px; background-color: #f1f5f9; border-radius: 6px; border-left: 4px solid #10b981;">
              <strong style="color: #475569; display: block; margin-bottom: 8px;">Message:</strong>
              <p style="margin: 0; color: #334155; font-style: italic; line-height: 1.5;">
                "${message.substring(0, 200)}${message.length > 200 ? '...' : ''}"
              </p>
            </div>
          </div>
          
          <!-- What's Next -->
          <div style="background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%); border: 1px solid #a7f3d0; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
            <h3 style="color: #065f46; margin: 0 0 12px 0; font-size: 16px; font-weight: 600;">
              🚀 What Happens Next?
            </h3>
            <ul style="margin: 0; padding-left: 20px; color: #047857; line-height: 1.6;">
              <li>We typically respond within <strong>24-48 hours</strong> during business days</li>
              <li>For urgent projects, we'll prioritize your request</li>
              <li>We'll discuss your specific needs and provide a detailed quote</li>
              <li>Once approved, we'll schedule your project and get started!</li>
            </ul>
          </div>
          
          <!-- About Terra Echo Studios -->
          <div style="text-align: center; padding: 20px; background-color: #f8fafc; border-radius: 8px;">
            <h3 style="color: #1e293b; margin: 0 0 12px 0; font-size: 16px; font-weight: 600;">
              🎧 About Terra Echo Studios
            </h3>
            <p style="color: #475569; margin: 0; font-size: 14px; line-height: 1.6;">
              Professional audio engineering services specializing in mixing, mastering, 
              sound design, and post-production. We're passionate about bringing your 
              creative vision to life with exceptional sound quality.
            </p>
            <div style="margin-top: 16px;">
              <a href="https://terraechostudios.com" style="color: #10b981; text-decoration: none; font-weight: 600; margin-right: 20px;">
                🌐 Visit Our Website
              </a>
              <a href="https://terraechostudios.com/portfolio" style="color: #10b981; text-decoration: none; font-weight: 600;">
                🎵 View Our Work
              </a>
            </div>
          </div>
        </div>
        
        <!-- Footer -->
        <div style="background-color: #1e293b; padding: 20px; text-align: center; color: #94a3b8;">
          <p style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600; color: #f1f5f9;">
            Terra Echo Studios
          </p>
          <p style="margin: 0 0 8px 0; font-size: 12px;">
            Professional Audio Engineering Services
          </p>
          <p style="margin: 0; font-size: 12px;">
            📧 <a href="mailto:terraechostudios@gmail.com" style="color: #10b981; text-decoration: none;">terraechostudios@gmail.com</a>
          </p>
        </div>
      </div>
    `;

    // Send confirmation email to user
    const userEmailResponse = await resend.emails.send({
      from: "Terra Echo Studios <noreply@terraechostudios.com>",
      to: [email],
      subject: `✅ Thank you for contacting Terra Echo Studios - ${subject}`,
      html: userConfirmationHtml,
    });

    console.log("✅ User confirmation email sent:", userEmailResponse.id);

    return new Response(
      JSON.stringify({ 
        success: true, 
        adminEmailId: adminEmailResponse.id,
        userEmailId: userEmailResponse.id,
        message: "Emails sent successfully to both admin and user",
        adminEmail: "terraechostudios@gmail.com" // Added for confirmation
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
    console.error("❌ Error in send-contact-email function:", error);
    
    // Enhanced error response
    return new Response(
      JSON.stringify({ 
        error: `Email delivery failed: ${error.message}`,
        success: false,
        details: error.details || "Please check your email configuration and try again"
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
