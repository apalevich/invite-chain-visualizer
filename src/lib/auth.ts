import { supabase } from './supabase';

// Define a test user that will be returned on successful password authentication
export const testUser = {
  telegram_id: 'test_user',
  username: 'Test',
  first_name: 'Test',
  last_name: 'User',
  invited_by: null,
  joined_at: new Date().toISOString(),
  comment: 'Test user for password authentication'
};

// Verify password against the environment variable
export async function verifyPassword(password: string) {
  const correctPassword = import.meta.env.VITE_AUTH_PASSWORD;
  
  if (!correctPassword) {
    console.error('Authentication password not set in environment variables');
    return null;
  }
  
  if (password === correctPassword) {
    return testUser;
  }
  
  return null;
}