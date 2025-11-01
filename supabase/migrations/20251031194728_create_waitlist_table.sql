/*
  # Create waitlist table

  1. New Tables
    - `waitlist`
      - `id` (uuid, primary key) - Unique identifier for each entry
      - `email` (text, unique) - Email address of the user
      - `created_at` (timestamptz) - Timestamp when the user joined the waitlist
      - `ip_address` (text, optional) - IP address for basic fraud prevention
      - `user_agent` (text, optional) - Browser user agent string
  
  2. Security
    - Enable RLS on `waitlist` table
    - Add policy for anonymous users to insert their own email
    - Add policy for authenticated users to read all waitlist entries (admin access)
  
  3. Notes
    - Email field is unique to prevent duplicate signups
    - Created_at defaults to current timestamp
    - Anonymous users can only insert, not read (privacy)
    - Only authenticated users can view the full waitlist
*/

-- Create waitlist table
CREATE TABLE IF NOT EXISTS waitlist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now(),
  ip_address text,
  user_agent text
);

-- Enable Row Level Security
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anyone to insert their email
CREATE POLICY "Anyone can join waitlist"
  ON waitlist
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Policy: Only authenticated users can view waitlist entries (admin access)
CREATE POLICY "Authenticated users can view waitlist"
  ON waitlist
  FOR SELECT
  TO authenticated
  USING (true);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_waitlist_email ON waitlist(email);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_waitlist_created_at ON waitlist(created_at DESC);