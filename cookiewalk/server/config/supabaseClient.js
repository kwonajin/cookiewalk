
require('dotenv').config();
const {createClient} = require('@supabase/supabase-js');
// const supabaseUrl = 'https://rbdbdnushdupstmiydea.supabase.co';
const supabaseUrl = process.env.SUPABSE_URL;
const supabaseAnonKey = process.env.SUPABASE_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

module.exports=supabase