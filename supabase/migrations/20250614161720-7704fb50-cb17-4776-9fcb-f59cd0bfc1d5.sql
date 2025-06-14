
-- Disable RLS to clear any policy cache
ALTER TABLE contact_submissions DISABLE ROW LEVEL SECURITY;

-- Re-enable RLS
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Clean up all potential old policies to ensure a fresh start
DROP POLICY IF EXISTS "Anyone can insert contact submissions" ON contact_submissions;
DROP POLICY IF EXISTS "Public can insert contact submissions" ON contact_submissions;
DROP POLICY IF EXISTS "Admins can view all contact submissions" ON contact_submissions;
DROP POLICY IF EXISTS "Admins can view contact submissions" ON contact_submissions;
DROP POLICY IF EXISTS "Admins can update contact submissions" ON contact_submissions;
DROP POLICY IF EXISTS "Admins can delete contact submissions" ON contact_submissions;

-- Create a new, broad insert policy for everyone by granting to the 'public' role
CREATE POLICY "Allow public insert on contact submissions" ON contact_submissions
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Re-create admin-only policies for other operations
CREATE POLICY "Admins can view contact submissions" ON contact_submissions
  FOR SELECT
  TO authenticated
  USING (public.get_user_role(auth.uid()) = 'admin');

CREATE POLICY "Admins can update contact submissions" ON contact_submissions
  FOR UPDATE
  TO authenticated
  USING (public.get_user_role(auth.uid()) = 'admin');

CREATE POLICY "Admins can delete contact submissions" ON contact_submissions
  FOR DELETE
  TO authenticated
  USING (public.get_user_role(auth.uid()) = 'admin');
