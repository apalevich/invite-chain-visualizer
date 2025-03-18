/*
  # Initialize Test Data for Telegram Users

  1. Test Data
    - Creates 10 sample users with realistic names and usernames
    - Sets up an invitation chain where:
      - User 1 is the original member
      - User 2-4 are invited by User 1
      - User 5-7 are invited by User 2
      - User 8-10 are invited by User 3
    
  2. Data Structure
    - Each user has:
      - Unique telegram_id
      - Username (some intentionally null to test handling)
      - First and last names
      - Invitation chain references
      - Joined dates spread across a realistic timeframe
*/

-- First wave of users (original members)
INSERT INTO telegram_users (telegram_id, username, first_name, last_name, joined_at)
VALUES
  ('123456789', 'john_doe', 'John', 'Doe', '2024-01-01T10:00:00Z');

-- Get the ID of the first user
DO $$
DECLARE
  first_user_id uuid;
BEGIN
  SELECT id INTO first_user_id FROM telegram_users WHERE telegram_id = '123456789';

  -- Second wave (invited by John)
  INSERT INTO telegram_users (telegram_id, username, first_name, last_name, invited_by, joined_at)
  VALUES
    ('223456789', 'alice_smith', 'Alice', 'Smith', first_user_id, '2024-01-02T14:30:00Z'),
    ('323456789', 'bob_wilson', 'Bob', 'Wilson', first_user_id, '2024-01-03T09:15:00Z'),
    ('423456789', 'carol_brown', 'Carol', 'Brown', first_user_id, '2024-01-04T16:45:00Z');

  -- Get IDs for second wave users
  WITH second_wave AS (
    SELECT id, telegram_id FROM telegram_users 
    WHERE telegram_id IN ('223456789', '323456789')
  )
  INSERT INTO telegram_users (telegram_id, username, first_name, last_name, invited_by, joined_at)
  SELECT 
    -- Users invited by Alice (223456789)
    '523456789', 'david_miller', 'David', 'Miller', 
    (SELECT id FROM second_wave WHERE telegram_id = '223456789'),
    '2024-01-05T11:20:00Z'
  UNION ALL
  SELECT 
    '623456789', NULL, 'Emma', 'Davis',
    (SELECT id FROM second_wave WHERE telegram_id = '223456789'),
    '2024-01-06T13:40:00Z'
  UNION ALL
  SELECT 
    '723456789', 'frank_jones', 'Frank', 'Jones',
    (SELECT id FROM second_wave WHERE telegram_id = '223456789'),
    '2024-01-07T15:10:00Z'
  UNION ALL
  -- Users invited by Bob (323456789)
  SELECT 
    '823456789', 'grace_taylor', 'Grace', 'Taylor',
    (SELECT id FROM second_wave WHERE telegram_id = '323456789'),
    '2024-01-08T10:05:00Z'
  UNION ALL
  SELECT 
    '923456789', NULL, 'Henry', 'Anderson',
    (SELECT id FROM second_wave WHERE telegram_id = '323456789'),
    '2024-01-09T14:25:00Z'
  UNION ALL
  SELECT 
    '023456789', 'isabel_white', 'Isabel', 'White',
    (SELECT id FROM second_wave WHERE telegram_id = '323456789'),
    '2024-01-10T16:30:00Z';
END $$;