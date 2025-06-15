
ALTER TABLE public.site_settings
ADD COLUMN social_links JSONB NOT NULL DEFAULT '[]'::jsonb;
