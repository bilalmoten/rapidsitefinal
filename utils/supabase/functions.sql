-- Stored procedure to increment vote count
CREATE OR REPLACE FUNCTION increment_vote_count(website_id INTEGER)
RETURNS VOID AS $$
BEGIN
  UPDATE websites
  SET vote_count = vote_count + 1
  WHERE id = website_id;
END;
$$ LANGUAGE plpgsql;

-- Stored procedure to decrement vote count
CREATE OR REPLACE FUNCTION decrement_vote_count(website_id INTEGER)
RETURNS VOID AS $$
BEGIN
  UPDATE websites
  SET vote_count = GREATEST(vote_count - 1, 0)
  WHERE id = website_id;
END;
$$ LANGUAGE plpgsql;

-- Stored procedure to increment clone count
CREATE OR REPLACE FUNCTION increment_clone_count(website_id INTEGER)
RETURNS VOID AS $$
BEGIN
  UPDATE websites
  SET clone_count = clone_count + 1
  WHERE id = website_id;
END;
$$ LANGUAGE plpgsql; 