
-- First, check and drop any existing admin policies
DROP POLICY IF EXISTS "Only admins can create portfolio items" ON portfolio_items;
DROP POLICY IF EXISTS "Only admins can update portfolio items" ON portfolio_items;
DROP POLICY IF EXISTS "Only admins can delete portfolio items" ON portfolio_items;
DROP POLICY IF EXISTS "Admin only create portfolio items" ON portfolio_items;
DROP POLICY IF EXISTS "Admin only update portfolio items" ON portfolio_items;
DROP POLICY IF EXISTS "Admin only delete portfolio items" ON portfolio_items;

-- Create new admin-only policies with unique names
CREATE POLICY "Admin only create access" ON portfolio_items
  FOR INSERT WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admin only update access" ON portfolio_items
  FOR UPDATE USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admin only delete access" ON portfolio_items
  FOR DELETE USING (public.is_admin(auth.uid()));

-- Ensure all existing portfolio items are associated with admin users
UPDATE portfolio_items 
SET user_id = (
  SELECT user_id 
  FROM user_profiles 
  WHERE role = 'admin' 
  LIMIT 1
)
WHERE user_id IS NULL OR user_id NOT IN (
  SELECT user_id 
  FROM user_profiles 
  WHERE role = 'admin'
);
