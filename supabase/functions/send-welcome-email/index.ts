
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface WelcomeEmailRequest {
  email: string;
  firstName: string;
  lastName: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, firstName, lastName }: WelcomeEmailRequest = await req.json();

    console.log("Sending welcome email to:", email);

    const emailResponse = await resend.emails.send({
      from: "Terra Echo Studios <onboarding@resend.dev>",
      to: [email],
      subject: "Welcome to Terra Echo Studios!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #10b981, #34d399); padding: 40px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to Terra Echo Studios!</h1>
          </div>
          
          <div style="padding: 40px; background: #f9fafb;">
            <h2 style="color: #10b981; margin-bottom: 20px;">Hello ${firstName} ${lastName}!</h2>
            
            <p style="font-size: 16px; line-height: 1.6; color: #374151; margin-bottom: 20px;">
              Thank you for joining Terra Echo Studios! We're excited to have you as part of our community.
            </p>
            
            <p style="font-size: 16px; line-height: 1.6; color: #374151; margin-bottom: 20px;">
              Your account has been successfully created. You can now:
            </p>
            
            <ul style="font-size: 16px; line-height: 1.8; color: #374151; margin-bottom: 30px;">
              <li>Browse our professional audio engineering services</li>
              <li>View our portfolio of work</li>
              <li>Shop for audio equipment and services</li>
              <li>Manage your orders and profile</li>
            </ul>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${Deno.env.get('SUPABASE_URL')?.replace('.supabase.co', '') || 'https://terraechostudio.com'}" 
                 style="background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                Explore Our Website
              </a>
            </div>
            
            <p style="font-size: 14px; color: #6b7280; margin-top: 40px;">
              If you have any questions, feel free to contact us at TerraEchoStudios@gmail.com
            </p>
          </div>
          
          <div style="background: #374151; padding: 20px; text-align: center;">
            <p style="color: #9ca3af; margin: 0; font-size: 14px;">
              © 2024 Terra Echo Studios. All rights reserved.
            </p>
          </div>
        </div>
      `,
    });

    console.log("Welcome email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, data: emailResponse }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error sending welcome email:", error);
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
