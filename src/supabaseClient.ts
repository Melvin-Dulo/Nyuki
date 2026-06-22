import { createClient } from '@supabase/supabase-js';

// This is your exact regional project URL
const supabaseUrl = 'https://wfyhudjtykihydchkhzv.supabase.co';

// Go to that settings tab, copy the long "anon" "public" key string, and paste it right inside these quotes:
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndmeWh1ZGp0eWtpaHlkY2hraHp2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIxMzg0OTUsImV4cCI6MjA5NzcxNDQ5NX0.6l5biAsoXQis1a1-nu7Cjv2UZNJtW6bSG0qLj-SUDIA';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
