import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY;

// In browser we require VITE vars; if missing, the client will be null and
// components should gracefully fallback to REST/serverless endpoints.
export const supabase = url && anon ? createClient(String(url), String(anon)) : null;

export default supabase;
