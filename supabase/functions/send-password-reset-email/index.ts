
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface PasswordResetRequest {
  email: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email }: PasswordResetRequest = await req.json();

    console.log("Creating password reset token for:", email);

    // Create password reset token using our database function
    const { data: tokenData, error: tokenError } = await supabase
      .rpc('create_password_reset_token', { user_email: email });

    if (tokenError) {
      console.error("Error creating reset token:", tokenError);
      return new Response(
        JSON.stringify({ error: "User not found or error creating reset token" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const resetToken = tokenData[0]?.token;
    if (!resetToken) {
      throw new Error("Failed to generate reset token");
    }

    // Get user's name for personalization
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('first_name, last_name')
      .eq('user_id', tokenData[0]?.user_id)
      .single();

    const firstName = profile?.first_name || 'User';
    const resetUrl = `${Deno.env.get('SUPABASE_URL')?.replace('https://kfkxbbhzpnouixxougxw.supabase.co', 'https://terraechostudio.com') || 'https://terraechostudio.com'}/reset-password?token=${resetToken}`;

    console.log("Sending password reset email to:", email);

    const emailResponse = await resend.emails.send({
      from: "Terra Echo Studios <onboarding@resend.dev>",
      to: [email],
      subject: "Reset Your Password - Terra Echo Studios",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #10b981, #34d399); padding: 40px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Password Reset Request</h1>
          </div>
          
          <div style="padding: 40px; background: #f9fafb;">
            <h2 style="color: #10b981; margin-bottom: 20px;">Hello ${firstName}!</h2>
            
            <p style="font-size: 16px; line-height: 1.6; color: #374151; margin-bottom: 20px;">
              We received a request to reset your password for your Terra Echo Studios account.
            </p>
            
            <p style="font-size: 16px; line-height: 1.6; color: #374151; margin-bottom: 30px;">
              Click the button below to reset your password. This link will expire in 24 hours.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" 
                 style="background: #10b981; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                Reset My Password
              </a>
            </div>
            
            <p style="font-size: 14px; line-height: 1.6; color: #6b7280; margin-top: 30px;">
              If you didn't request this password reset, you can safely ignore this email. Your password will not be changed.
            </p>
            
            <p style="font-size: 14px; line-height: 1.6; color: #6b7280;">
              If the button doesn't work, copy and paste this link into your browser:
              <br><span style="word-break: break-all;">${resetUrl}</span>
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

    console.log("Password reset email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error sending password reset email:", error);
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
