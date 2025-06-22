
-- Add recorded_date column to portfolio_items table
ALTER TABLE public.portfolio_items 
ADD COLUMN recorded_date DATE;

-- Add a comment to describe the column
COMMENT ON COLUMN public.portfolio_items.recorded_date IS 'The date when the portfolio item was originally recorded/created by the client';
