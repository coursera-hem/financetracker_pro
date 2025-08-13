import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env?.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env?.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

// Auth helpers
export const authHelpers = {
  // Sign up
  signUp: async (email, password, metadata = {}) => {
    const { data, error } = await supabase?.auth?.signUp({
      email,
      password,
      options: {
        data: metadata
      }
    });
    return { data, error };
  },

  // Sign in
  signIn: async (email, password) => {
    const { data, error } = await supabase?.auth?.signInWithPassword({
      email,
      password
    });
    return { data, error };
  },

  // Sign out
  signOut: async () => {
    const { error } = await supabase?.auth?.signOut();
    return { error };
  },

  // Get current user
  getCurrentUser: () => {
    return supabase?.auth?.getUser();
  },

  // Get session
  getSession: () => {
    return supabase?.auth?.getSession();
  }
};