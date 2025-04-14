import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Psychiatrist = {
  id: string;
  name: string;
  license_id: string;
  location: string;
  availability: string;
  contact: string;
}

export type Chat = {
  id: string;
  user_id?: string;
  title: string;
  is_anonymous: boolean;
  created_at: string;
}

export type Message = {
  id: string;
  chat_id: string;
  role: 'user' | 'ai';
  content: string;
  created_at: string;
}

export type User = {
  id: string;
  email: string;
  created_at: string;
}
