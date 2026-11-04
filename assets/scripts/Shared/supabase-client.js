/**
 * Tourist Portal Subsystem · Supabase client
 * Load AFTER the Supabase CDN script and BEFORE register.js / login-auth.js / auth-guard.js
 */
const SUPABASE_URL = "https://fgyktjjewtcdeavhksnl.supabase.co";   // Project Settings > API
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZneWt0ampld3RjZGVhdmhrc25sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMwNzc3NjYsImV4cCI6MjEwODY1Mzc2Nn0.2igl1UOOeCuy2E8hZWfIvnBMOk40V5yPaeBD0ZuhZGA";                 // anon / public key ONLY

window.sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);