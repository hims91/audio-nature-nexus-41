
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
  submissionId: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, subject, message, submissionId }: ContactEmailRequest = await req.json();

    // Send notification email to admin
    const adminEmailResponse = await resend.emails.send({
      from: "Terra Echo Audio <onboarding@resend.dev>",
      to: ["TerraEchoStudios@gmail.com"],
      subject: `New Contact Form Submission: ${subject}`,
      html: `
        <h1>New Contact Form Submission</h1>
        <div style="margin-bottom: 20px;">
          <strong>From:</strong> ${name} (${email})<br>
          <strong>Subject:</strong> ${subject}<br>
          <strong>Submission ID:</strong> ${submissionId}
        </div>
        <div style="background: #f5f5f5; padding: 15px; border-radius: 5px;">
          <strong>Message:</strong><br>
          ${message.replace(/\n/g, '<br>')}
        </div>
        <div style="margin-top: 20px; padding: 15px; background: #e8f4f8; border-radius: 5px;">
          <small>This email was sent from your Terra Echo Audio website contact form.</small>
        </div>
      `,
    });

    // Send confirmation email to user
    const userEmailResponse = await resend.emails.send({
      from: "Terra Echo Audio <onboarding@resend.dev>",
      to: [email],
      subject: "Thank you for contacting Terra Echo Audio",
      html: `
        <h1>Thank you for reaching out, ${name}!</h1>
        <p>We have received your message regarding "<strong>${subject}</strong>" and will get back to you as soon as possible.</p>
        
        <div style="margin: 20px 0; padding: 15px; background: #f8f9fa; border-radius: 5px;">
          <h3>Your message:</h3>
          <p>${message.replace(/\n/g, '<br>')}</p>
        </div>
        
        <p>We typically respond within 24-48 hours during business days.</p>
        
        <div style="margin-top: 30px;">
          <p>Best regards,<br>
          <strong>The Terra Echo Audio Team</strong></p>
          <p style="color: #666; font-size: 14px;">
            Professional Audio Engineering Services<br>
            Email: TerraEchoStudios@gmail.com
          </p>
        </div>
      `,
    });

    console.log("Admin email sent:", adminEmailResponse);
    console.log("User confirmation email sent:", userEmailResponse);

    return new Response(JSON.stringify({ 
      success: true,
      adminEmail: adminEmailResponse,
      userEmail: userEmailResponse 
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-contact-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
