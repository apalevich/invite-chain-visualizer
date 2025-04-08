/*
  # Create Telegram Users Table

  1. New Tables
    - `telegram_users`
      - `id` (uuid, primary key)
      - `telegram_id` (text, unique)
      - `username` (text)
      - `first_name` (text)
      - `last_name` (text)
      - `invited_by` (uuid, references telegram_users)
      - `joined_at` (timestamp)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `telegram_users` table
    - Add policy for authenticated users to read all data
*/

CREATE TABLE IF NOT EXISTS telegram_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  telegram_id text UNIQUE NOT NULL,
  username text,
  first_name text,
  last_name text,
  invited_by uuid REFERENCES telegram_users(id),
  joined_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE telegram_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read access to all authenticated users"
  ON telegram_users
  FOR SELECT
  TO authenticated
  USING (true);