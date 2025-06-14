
-- Phase 1: Database Schema Enhancement

-- 1.1 Extend user_profiles table with missing fields
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS username TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS company TEXT,
ADD COLUMN IF NOT EXISTS website TEXT,
ADD COLUMN IF NOT EXISTS location TEXT,
ADD COLUMN IF NOT EXISTS timezone TEXT DEFAULT 'UTC',
ADD COLUMN IF NOT EXISTS social_links JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS profile_completed_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS notification_preferences JSONB DEFAULT '{"email": true, "push": true, "marketing": false}',
ADD COLUMN IF NOT EXISTS privacy_settings JSONB DEFAULT '{"profile_visibility": "public", "show_email": false}';

-- 1.2 Create authentication audit table
CREATE TABLE IF NOT EXISTS public.auth_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  login_method TEXT NOT NULL CHECK (login_method IN ('email', 'google', 'twitter')),
  ip_address INET,
  user_agent TEXT,
  location TEXT,
  device_info JSONB DEFAULT '{}',
  session_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  session_end TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 1.3 Create permissions table for granular access control
CREATE TABLE IF NOT EXISTS public.permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  resource TEXT NOT NULL,
  action TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 1.4 Create role_permissions junction table
CREATE TABLE IF NOT EXISTS public.role_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role TEXT NOT NULL,
  permission_id UUID REFERENCES public.permissions(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(role, permission_id)
);

-- Enable RLS on new tables
ALTER TABLE public.auth_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for auth_sessions
CREATE POLICY "Users can view their own sessions" 
  ON public.auth_sessions 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own sessions" 
  ON public.auth_sessions 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- RLS Policies for permissions (admin only)
CREATE POLICY "Admins can manage permissions" 
  ON public.permissions 
  FOR ALL 
  USING (public.get_user_role(auth.uid()) = 'admin');

CREATE POLICY "Authenticated users can view permissions" 
  ON public.permissions 
  FOR SELECT 
  TO authenticated 
  USING (true);

-- RLS Policies for role_permissions (admin only)
CREATE POLICY "Admins can manage role permissions" 
  ON public.role_permissions 
  FOR ALL 
  USING (public.get_user_role(auth.uid()) = 'admin');

CREATE POLICY "Authenticated users can view role permissions" 
  ON public.role_permissions 
  FOR SELECT 
  TO authenticated 
  USING (true);

-- Insert default permissions
INSERT INTO public.permissions (name, description, resource, action) VALUES
('portfolio.create', 'Create portfolio items', 'portfolio', 'create'),
('portfolio.read', 'View portfolio items', 'portfolio', 'read'),
('portfolio.update', 'Update portfolio items', 'portfolio', 'update'),
('portfolio.delete', 'Delete portfolio items', 'portfolio', 'delete'),
('profile.read', 'View user profiles', 'profile', 'read'),
('profile.update', 'Update user profiles', 'profile', 'update'),
('admin.users', 'Manage users', 'admin', 'users'),
('admin.system', 'System administration', 'admin', 'system')
ON CONFLICT (name) DO NOTHING;

-- Assign permissions to roles
INSERT INTO public.role_permissions (role, permission_id)
SELECT 'user', id FROM public.permissions WHERE name IN ('portfolio.create', 'portfolio.read', 'portfolio.update', 'portfolio.delete', 'profile.read', 'profile.update')
ON CONFLICT (role, permission_id) DO NOTHING;

INSERT INTO public.role_permissions (role, permission_id)
SELECT 'admin', id FROM public.permissions
ON CONFLICT (role, permission_id) DO NOTHING;

-- Create function to check user permissions
CREATE OR REPLACE FUNCTION public.user_has_permission(user_id UUID, permission_name TEXT)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.user_profiles up
    JOIN public.role_permissions rp ON rp.role = up.role
    JOIN public.permissions p ON p.id = rp.permission_id
    WHERE up.user_id = $1 AND p.name = $2
  );
$$;

-- Create function to track login sessions
CREATE OR REPLACE FUNCTION public.track_login_session(
  p_user_id UUID,
  p_login_method TEXT,
  p_ip_address INET DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL,
  p_device_info JSONB DEFAULT '{}'
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  session_id UUID;
BEGIN
  -- End any existing active sessions for this user
  UPDATE public.auth_sessions 
  SET is_active = FALSE, session_end = NOW()
  WHERE user_id = p_user_id AND is_active = TRUE;
  
  -- Create new session
  INSERT INTO public.auth_sessions (user_id, login_method, ip_address, user_agent, device_info)
  VALUES (p_user_id, p_login_method, p_ip_address, p_user_agent, p_device_info)
  RETURNING id INTO session_id;
  
  RETURN session_id;
END;
$$;

-- Update handle_new_user function to include new fields
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
    privacy_settings
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
    '{"profile_visibility": "public", "show_email": false}'::jsonb
  );
  RETURN NEW;
END;
$$;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_auth_sessions_user_id ON public.auth_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_auth_sessions_active ON public.auth_sessions(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_user_profiles_username ON public.user_profiles(username);
CREATE INDEX IF NOT EXISTS idx_role_permissions_role ON public.role_permissions(role);
