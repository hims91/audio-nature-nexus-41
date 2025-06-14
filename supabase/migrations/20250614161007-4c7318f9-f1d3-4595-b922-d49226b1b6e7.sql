
-- Fix RLS policies for contact_submissions to allow public submissions
DROP POLICY IF EXISTS "Anyone can insert contact submissions" ON contact_submissions;
DROP POLICY IF EXISTS "Admins can view all contact submissions" ON contact_submissions;
DROP POLICY IF EXISTS "Admins can update contact submissions" ON contact_submissions;

-- Allow anyone (including anonymous users) to insert contact submissions
CREATE POLICY "Anyone can insert contact submissions" ON contact_submissions
  FOR INSERT 
  WITH CHECK (true);

-- Only admins can view contact submissions
CREATE POLICY "Admins can view all contact submissions" ON contact_submissions
  FOR SELECT 
  USING (public.get_user_role(auth.uid()) = 'admin');

-- Only admins can update contact submissions (for status changes)
CREATE POLICY "Admins can update contact submissions" ON contact_submissions
  FOR UPDATE 
  USING (public.get_user_role(auth.uid()) = 'admin');

-- Only admins can delete contact submissions
CREATE POLICY "Admins can delete contact submissions" ON contact_submissions
  FOR DELETE 
  USING (public.get_user_role(auth.uid()) = 'admin');
