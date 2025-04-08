import { supabase } from './supabase';

 export type TelegramUser = {
   id: number;
   first_name: string;
   last_name?: string;
   username?: string;
   photo_url?: string;
   auth_date: number;
   hash: string;
 };

 export async function verifyTelegramUser(user: TelegramUser) {
   try {
     const { data, error } = await supabase
       .from('telegram_users')
       .select('*')
       .eq('telegram_id', user.id.toString())
       .single();

     if (error) throw error;
     return data;
   } catch (error) {
     console.error('Error verifying Telegram user:', error);
     return null;
   }
 } 