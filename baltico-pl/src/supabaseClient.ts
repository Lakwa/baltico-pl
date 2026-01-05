import { createClient } from '@supabase/supabase-js';

// 1. Pobieramy adres URL i Klucz z pliku .env
// Vite używa obiektu import.meta.env do dostępu do zmiennych środowiskowych
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// 2. Zabezpieczenie: Sprawdzamy czy na pewno są wpisane
// To oszczędzi Ci godzin szukania błędu, jeśli zapomnisz o pliku .env
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('🛑 BŁĄD: Brakuje zmiennych VITE_SUPABASE_URL lub VITE_SUPABASE_ANON_KEY w pliku .env');
}

// 3. Tworzymy i eksportujemy gotowego klienta
export const supabase = createClient(supabaseUrl, supabaseAnonKey);