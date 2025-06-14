
-- Create storage buckets for portfolio files
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('portfolio-images', 'portfolio-images', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
  ('portfolio-audio', 'portfolio-audio', true, 52428800, ARRAY['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp3']),
  ('portfolio-videos', 'portfolio-videos', true, 104857600, ARRAY['video/mp4', 'video/webm', 'video/quicktime']),
  ('contact-files', 'contact-files', false, 26214400, ARRAY['image/jpeg', 'image/png', 'audio/mpeg', 'audio/wav', 'video/mp4', 'application/pdf']);

-- Create portfolio_items table
CREATE TABLE IF NOT EXISTS portfolio_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  client TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  cover_image_url TEXT,
  audio_url TEXT,
  video_url TEXT,
  external_links JSONB DEFAULT '[]'::jsonb,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create contact_submissions table
CREATE TABLE IF NOT EXISTS contact_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  file_attachments JSONB DEFAULT '[]'::jsonb,
  status TEXT DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  read_at TIMESTAMP WITH TIME ZONE,
  replied_at TIMESTAMP WITH TIME ZONE
);

-- Create project_categories table
CREATE TABLE IF NOT EXISTS project_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  color_theme TEXT DEFAULT '#10b981',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Insert default categories
INSERT INTO project_categories (name, description, color_theme) VALUES 
  ('Mixing & Mastering', 'Professional mixing and mastering services', '#10b981'),
  ('Sound Design', 'Creative sound design and audio effects', '#3b82f6'),
  ('Podcasting', 'Podcast production and editing', '#8b5cf6'),
  ('Sound for Picture', 'Audio for film, TV, and video content', '#f59e0b'),
  ('Dolby Atmos', 'Immersive audio mixing in Dolby Atmos', '#ef4444')
ON CONFLICT (name) DO NOTHING;

-- Create user profiles table for admin management
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  role TEXT DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  first_name TEXT,
  last_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  preferences JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on all tables
ALTER TABLE portfolio_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check user role
CREATE OR REPLACE FUNCTION public.get_user_role(user_id UUID)
RETURNS TEXT AS $$
  SELECT role FROM public.user_profiles WHERE user_id = $1;
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- RLS Policies for portfolio_items
CREATE POLICY "Anyone can view portfolio items" ON portfolio_items
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert portfolio items" ON portfolio_items
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own portfolio items" ON portfolio_items
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own portfolio items" ON portfolio_items
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for contact_submissions
CREATE POLICY "Admins can view all contact submissions" ON contact_submissions
  FOR SELECT USING (public.get_user_role(auth.uid()) = 'admin');

CREATE POLICY "Anyone can insert contact submissions" ON contact_submissions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can update contact submissions" ON contact_submissions
  FOR UPDATE USING (public.get_user_role(auth.uid()) = 'admin');

-- RLS Policies for project_categories
CREATE POLICY "Anyone can view project categories" ON project_categories
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage project categories" ON project_categories
  FOR ALL USING (public.get_user_role(auth.uid()) = 'admin');

-- RLS Policies for user_profiles
CREATE POLICY "Users can view their own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all profiles" ON user_profiles
  FOR SELECT USING (public.get_user_role(auth.uid()) = 'admin');

-- Storage policies for portfolio buckets
CREATE POLICY "Anyone can view portfolio images" ON storage.objects
  FOR SELECT USING (bucket_id = 'portfolio-images');

CREATE POLICY "Authenticated users can upload portfolio images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'portfolio-images' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update their own portfolio images" ON storage.objects
  FOR UPDATE USING (bucket_id = 'portfolio-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own portfolio images" ON storage.objects
  FOR DELETE USING (bucket_id = 'portfolio-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Similar policies for audio bucket
CREATE POLICY "Anyone can view portfolio audio" ON storage.objects
  FOR SELECT USING (bucket_id = 'portfolio-audio');

CREATE POLICY "Authenticated users can upload portfolio audio" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'portfolio-audio' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update their own portfolio audio" ON storage.objects
  FOR UPDATE USING (bucket_id = 'portfolio-audio' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own portfolio audio" ON storage.objects
  FOR DELETE USING (bucket_id = 'portfolio-audio' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Similar policies for video bucket
CREATE POLICY "Anyone can view portfolio videos" ON storage.objects
  FOR SELECT USING (bucket_id = 'portfolio-videos');

CREATE POLICY "Authenticated users can upload portfolio videos" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'portfolio-videos' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update their own portfolio videos" ON storage.objects
  FOR UPDATE USING (bucket_id = 'portfolio-videos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own portfolio videos" ON storage.objects
  FOR DELETE USING (bucket_id = 'portfolio-videos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Policies for contact files bucket (private)
CREATE POLICY "Admins can view contact files" ON storage.objects
  FOR SELECT USING (bucket_id = 'contact-files' AND public.get_user_role(auth.uid()) = 'admin');

CREATE POLICY "Anyone can upload contact files" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'contact-files');

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_portfolio_items_updated_at
    BEFORE UPDATE ON portfolio_items
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (user_id, first_name, last_name, role)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'first_name',
    NEW.raw_user_meta_data ->> 'last_name',
    CASE 
      WHEN NEW.email = 'TerraEchoStudios@gmail.com' THEN 'admin'
      ELSE 'user'
    END
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
