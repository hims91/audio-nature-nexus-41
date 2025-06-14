
-- Disable and re-enable RLS to clear any potential policy cache
ALTER TABLE public.contact_submissions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- Clean up all old policies to ensure a fresh start
DROP POLICY IF EXISTS "Allow public insert on contact submissions" ON public.contact_submissions;
DROP POLICY IF EXISTS "Anyone can insert contact submissions" ON public.contact_submissions;
DROP POLICY IF EXISTS "Public can insert contact submissions" ON public.contact_submissions;
DROP POLICY IF EXISTS "Allow guest contact form submissions" ON public.contact_submissions;
DROP POLICY IF EXISTS "Admins can view submissions" ON public.contact_submissions;
DROP POLICY IF EXISTS "Admins can update submissions" ON public.contact_submissions;
DROP POLICY IF EXISTS "Admins can delete submissions" ON public.contact_submissions;

-- Create a new, explicit policy for inserts from any user (guest or logged in)
CREATE POLICY "Allow any user to submit form"
  ON public.contact_submissions
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Re-create admin-only policies for other operations
CREATE POLICY "Admins can view submissions"
  ON public.contact_submissions
  FOR SELECT
  TO authenticated
  USING (public.get_user_role(auth.uid()) = 'admin');

CREATE POLICY "Admins can update submissions"
  ON public.contact_submissions
  FOR UPDATE
  TO authenticated
  USING (public.get_user_role(auth.uid()) = 'admin');

CREATE POLICY "Admins can delete submissions"
  ON public.contact_submissions
  FOR DELETE
  TO authenticated
  USING (public.get_user_role(auth.uid()) = 'admin');
