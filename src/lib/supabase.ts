import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type TelegramUser = {
  telegram_id: string;
  username: string | null;
  first_name: string | null;
  last_name: string | null;
  invited_by: string | null;
  joined_at: string;
  comment: string | null;
};