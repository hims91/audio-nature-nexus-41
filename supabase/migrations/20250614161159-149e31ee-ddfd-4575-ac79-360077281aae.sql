
-- First, completely disable RLS temporarily to clear any cached policies
ALTER TABLE contact_submissions DISABLE ROW LEVEL SECURITY;

-- Re-enable RLS
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Drop all existing policies to start fresh
DROP POLICY IF EXISTS "Anyone can insert contact submissions" ON contact_submissions;
DROP POLICY IF EXISTS "Admins can view all contact submissions" ON contact_submissions;
DROP POLICY IF EXISTS "Admins can update contact submissions" ON contact_submissions;
DROP POLICY IF EXISTS "Admins can delete contact submissions" ON contact_submissions;

-- Create a more explicit policy for anonymous insertions
CREATE POLICY "Public can insert contact submissions" ON contact_submissions
  FOR INSERT 
  TO anon, authenticated
  WITH CHECK (true);

-- Only authenticated admins can view contact submissions
CREATE POLICY "Admins can view contact submissions" ON contact_submissions
  FOR SELECT 
  TO authenticated
  USING (public.get_user_role(auth.uid()) = 'admin');

-- Only authenticated admins can update contact submissions
CREATE POLICY "Admins can update contact submissions" ON contact_submissions
  FOR UPDATE 
  TO authenticated
  USING (public.get_user_role(auth.uid()) = 'admin');

-- Only authenticated admins can delete contact submissions
CREATE POLICY "Admins can delete contact submissions" ON contact_submissions
  FOR DELETE 
  TO authenticated
  USING (public.get_user_role(auth.uid()) = 'admin');
