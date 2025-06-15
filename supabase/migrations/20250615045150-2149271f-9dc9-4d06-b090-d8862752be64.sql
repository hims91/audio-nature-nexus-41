
-- Add logo_url and brand_colors columns to site_settings table
ALTER TABLE public.site_settings 
ADD COLUMN logo_url TEXT,
ADD COLUMN brand_colors JSONB DEFAULT '{"primary": "#10b981", "secondary": "#059669", "accent": "#34d399"}'::jsonb;

-- Enable realtime for site_settings table
ALTER TABLE public.site_settings REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.site_settings;
