
-- Create a table to hold site-wide settings
CREATE TABLE public.site_settings (
  id INT PRIMARY KEY CHECK (id = 1), -- Enforces a single row for settings
  site_name TEXT NOT NULL DEFAULT 'Terra Echo Studios',
  site_description TEXT NOT NULL DEFAULT 'Professional Audio Engineering Services',
  contact_email TEXT NOT NULL DEFAULT 'TerraEchoStudios@gmail.com',
  featured_items_limit INT NOT NULL DEFAULT 6,
  allow_user_registration BOOLEAN NOT NULL DEFAULT TRUE,
  email_notifications BOOLEAN NOT NULL DEFAULT TRUE,
  portfolio_auto_approve BOOLEAN NOT NULL DEFAULT FALSE,
  maintenance_mode BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Insert the initial singleton row of settings
-- The CHECK constraint on ID ensures this is the only row that can exist.
INSERT INTO public.site_settings (id) VALUES (1);

-- Auto-update the 'updated_at' column on changes
CREATE TRIGGER handle_site_settings_update
BEFORE UPDATE ON public.site_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public, unauthenticated read access to settings
CREATE POLICY "Allow public read access to settings"
ON public.site_settings
FOR SELECT
USING (true);

-- Policy: Allow admins to update settings
CREATE POLICY "Allow admins to update settings"
ON public.site_settings
FOR UPDATE
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

