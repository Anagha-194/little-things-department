// =============================================
// THE LITTLE THINGS DEPARTMENT
// SUPABASE CONNECTION
// =============================================

// 1. Your Supabase project URL
const SUPABASE_URL = "https://ochtrfiatmvsklyknfzd.supabase.co";

// 2. Your Supabase publishable key
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_eS2T04Y6t-Sqbtvemwi9nw_FTePqjd6";

// 3. Create the connection
const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
);

console.log("Supabase connection initialized!");