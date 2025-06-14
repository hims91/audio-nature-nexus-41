
-- Enable RLS on portfolio_items table (if not already enabled)
ALTER TABLE portfolio_items ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Anyone can view portfolio items" ON portfolio_items;
DROP POLICY IF EXISTS "Authenticated users can create portfolio items" ON portfolio_items;
DROP POLICY IF EXISTS "Users can update their own portfolio items" ON portfolio_items;
DROP POLICY IF EXISTS "Users can delete their own portfolio items" ON portfolio_items;

-- Create RLS policies for portfolio_items
CREATE POLICY "Anyone can view portfolio items" ON portfolio_items
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create portfolio items" ON portfolio_items
  FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND user_id = auth.uid());

CREATE POLICY "Users can update their own portfolio items" ON portfolio_items
  FOR UPDATE USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete their own portfolio items" ON portfolio_items
  FOR DELETE USING (user_id = auth.uid());

-- Add database indexes for better performance
CREATE INDEX IF NOT EXISTS idx_portfolio_items_user_id ON portfolio_items(user_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_items_category ON portfolio_items(category);
CREATE INDEX IF NOT EXISTS idx_portfolio_items_featured ON portfolio_items(featured);
CREATE INDEX IF NOT EXISTS idx_portfolio_items_created_at ON portfolio_items(created_at DESC);

-- Enable realtime for portfolio_items
ALTER TABLE portfolio_items REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE portfolio_items;
