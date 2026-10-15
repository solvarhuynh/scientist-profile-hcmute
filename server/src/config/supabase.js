const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

let supabase = null;

if (supabaseUrl && supabaseKey && !supabaseUrl.includes('your-project-id')) {
  try {
    supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
    console.log('✅ Supabase Client initialized successfully with:', supabaseUrl);
  } catch (err) {
    console.warn('⚠️ Failed to connect to Supabase:', err.message);
  }
} else {
  console.log('ℹ️ Running in Local Mock/Stand-alone mode (Configure SUPABASE_URL & SUPABASE_KEY in .env for production database).');
}

module.exports = {
  supabase,
  isConfigured: () => !!supabase,
};
