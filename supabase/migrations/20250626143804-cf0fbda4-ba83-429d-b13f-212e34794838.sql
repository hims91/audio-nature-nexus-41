
-- Add email verification status to user profiles
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS email_verification_token TEXT,
ADD COLUMN IF NOT EXISTS email_verification_expires_at TIMESTAMP WITH TIME ZONE;

-- Create password reset tokens table
CREATE TABLE IF NOT EXISTS public.password_reset_tokens (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Enable RLS on password reset tokens
ALTER TABLE public.password_reset_tokens ENABLE ROW LEVEL SECURITY;

-- Create policy for password reset tokens (users can only access their own tokens)
CREATE POLICY "Users can access their own reset tokens" 
  ON public.password_reset_tokens 
  FOR ALL 
  USING (auth.uid() = user_id);

-- Update the handle_new_user function to include email verification
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.user_profiles (
    user_id, 
    first_name, 
    last_name, 
    role,
    username,
    notification_preferences,
    privacy_settings,
    email_verified
  )
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'first_name',
    NEW.raw_user_meta_data ->> 'last_name',
    CASE 
      WHEN NEW.email = 'TerraEchoStudios@gmail.com' THEN 'admin'
      ELSE 'user'
    END,
    LOWER(REPLACE(COALESCE(NEW.raw_user_meta_data ->> 'first_name', '') || COALESCE(NEW.raw_user_meta_data ->> 'last_name', ''), ' ', '')) || '_' || EXTRACT(EPOCH FROM NOW())::TEXT,
    '{"email": true, "push": true, "marketing": false}'::jsonb,
    '{"profile_visibility": "public", "show_email": false}'::jsonb,
    CASE 
      WHEN NEW.email_confirmed_at IS NOT NULL THEN TRUE
      ELSE FALSE
    END
  );
  RETURN NEW;
END;
$$;

-- Create function to generate secure tokens
CREATE OR REPLACE FUNCTION public.generate_secure_token()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN encode(gen_random_bytes(32), 'hex');
END;
$$;

-- Create function to create password reset token
CREATE OR REPLACE FUNCTION public.create_password_reset_token(user_email TEXT)
RETURNS TABLE(token TEXT, user_id UUID, expires_at TIMESTAMP WITH TIME ZONE)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  found_user_id UUID;
  new_token TEXT;
  expiry_time TIMESTAMP WITH TIME ZONE;
BEGIN
  -- Find user by email
  SELECT id INTO found_user_id
  FROM auth.users
  WHERE email = user_email;
  
  IF found_user_id IS NULL THEN
    RAISE EXCEPTION 'User not found';
  END IF;
  
  -- Generate token and expiry (24 hours from now)
  new_token := public.generate_secure_token();
  expiry_time := NOW() + INTERVAL '24 hours';
  
  -- Invalidate existing tokens for this user
  UPDATE public.password_reset_tokens
  SET used = TRUE
  WHERE user_id = found_user_id AND used = FALSE;
  
  -- Insert new token
  INSERT INTO public.password_reset_tokens (user_id, token, expires_at)
  VALUES (found_user_id, new_token, expiry_time);
  
  RETURN QUERY SELECT new_token, found_user_id, expiry_time;
END;
$$;

-- Create function to verify password reset token
CREATE OR REPLACE FUNCTION public.verify_password_reset_token(reset_token TEXT)
RETURNS TABLE(user_id UUID, is_valid BOOLEAN)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  token_record RECORD;
BEGIN
  -- Find the token
  SELECT * INTO token_record
  FROM public.password_reset_tokens
  WHERE token = reset_token
    AND used = FALSE
    AND expires_at > NOW();
  
  IF token_record IS NULL THEN
    RETURN QUERY SELECT NULL::UUID, FALSE;
  ELSE
    -- Mark token as used
    UPDATE public.password_reset_tokens
    SET used = TRUE
    WHERE id = token_record.id;
    
    RETURN QUERY SELECT token_record.user_id, TRUE;
  END IF;
END;
$$;
