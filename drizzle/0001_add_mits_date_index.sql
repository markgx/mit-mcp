-- Add composite index on date and order for better query performance
CREATE INDEX idx_mits_date_order ON mits(date DESC, "order" ASC);