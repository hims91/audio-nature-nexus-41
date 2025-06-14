
-- This is a diagnostic step to rule out RLS issues.
-- It temporarily makes the contact_submissions table public.
ALTER TABLE public.contact_submissions DISABLE ROW LEVEL SECURITY;
