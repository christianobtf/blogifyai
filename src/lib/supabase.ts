import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
  throw new Error(
    'Please connect to Supabase using the "Connect to Supabase" button in the top right corner'
  );
}

// Ensure the URL is properly formatted
const formattedUrl = supabaseUrl.startsWith('http') 
  ? supabaseUrl 
  : `https://${supabaseUrl}`;

export const supabase = createClient(formattedUrl, supabaseAnonKey);