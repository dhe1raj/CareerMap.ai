// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://ddjqbsscsxgiicaabxxc.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkanFic3Njc3hnaWljYWFieHhjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc3MTg4OTEsImV4cCI6MjA2MzI5NDg5MX0.gyBvS28g8ohGSUrlXCUofZuUwWIcaPdNnq0yungEAas";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);