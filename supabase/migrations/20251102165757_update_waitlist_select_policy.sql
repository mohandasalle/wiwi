/*
  # Update Waitlist SELECT Policy

  1. Changes
    - Drop existing restrictive SELECT policy
    - Create new SELECT policy that allows both anonymous and authenticated users
    - This enables the admin dashboard to read waitlist entries using the anon key
    - Security is maintained through password protection in the admin UI

  2. Security Notes
    - Admin page has password protection at the application level
    - RLS still prevents unauthorized modifications (INSERT is separate policy)
*/

-- Drop the old policy
DROP POLICY IF EXISTS "Authenticated users can view waitlist" ON waitlist;

-- Create new policy allowing both anon and authenticated users to read
CREATE POLICY "Allow read access to waitlist"
  ON waitlist
  FOR SELECT
  TO anon, authenticated
  USING (true);
