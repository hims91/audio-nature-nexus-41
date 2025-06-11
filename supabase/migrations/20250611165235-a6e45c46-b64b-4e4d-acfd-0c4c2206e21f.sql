
-- Create storage buckets for portfolio files
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('portfolio-images', 'portfolio-images', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
  ('portfolio-audio', 'portfolio-audio', true, 52428800, ARRAY['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp3']),
  ('portfolio-videos', 'portfolio-videos', true, 104857600, ARRAY['video/mp4', 'video/webm', 'video/quicktime']);

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

-- Enable RLS on portfolio_items
ALTER TABLE portfolio_items ENABLE ROW LEVEL SECURITY;

-- Create policies for portfolio_items
CREATE POLICY "Users can view all portfolio items" ON portfolio_items
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own portfolio items" ON portfolio_items
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own portfolio items" ON portfolio_items
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own portfolio items" ON portfolio_items
  FOR DELETE USING (auth.uid() = user_id);

-- Create storage policies for portfolio buckets
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

-- Create updated_at trigger
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
